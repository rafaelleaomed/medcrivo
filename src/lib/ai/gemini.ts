import { z } from "zod";

/** Modelo padrão do plano gratuito; troque com GEMINI_MODEL se o Google renomear. */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/** Erro HTTP da API do Gemini (o status vira o motivo mostrado quando cai no rascunho de reserva). */
export class GeminiApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`Erro da API Gemini (${status})`);
    this.status = status;
  }
}

/** O Gemini bloqueou a resposta por segurança. */
export class GeminiRefusalError extends Error {}

type GeminiMessage = { role: string; content: unknown };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

function textOf(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((b) => (b && typeof b === "object" && "text" in b ? String((b as { text: unknown }).text) : "")).join("");
  }
  return "";
}

async function call(body: unknown, model: string): Promise<GeminiResponse> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new GeminiApiError(res.status);
  return (await res.json()) as GeminiResponse;
}

/** Resposta estruturada do Gemini, validada com o mesmo schema usado com o Claude. */
export async function askGeminiStructured<S extends z.ZodType>(opts: {
  schema: S;
  system: string;
  messages: GeminiMessage[];
  maxTokens?: number;
}): Promise<{ data: z.infer<S>; usage: { model: string; inputTokens: number; outputTokens: number } }> {
  const model = getGeminiModel();
  const jsonSchema = z.toJSONSchema(opts.schema) as Record<string, unknown>;
  delete jsonSchema.$schema;
  const body = (withSchema: boolean) => ({
    systemInstruction: {
      parts: [
        {
          text: withSchema
            ? opts.system
            : `${opts.system}\n\nResponda somente com um objeto JSON válido (sem markdown) que siga este JSON Schema:\n${JSON.stringify(jsonSchema)}`,
        },
      ],
    },
    contents: opts.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: textOf(m.content) }] })),
    generationConfig: {
      responseMimeType: "application/json",
      ...(withSchema ? { responseJsonSchema: jsonSchema } : {}),
      maxOutputTokens: Math.max(opts.maxTokens ?? 8000, 16000),
    },
  });

  let response: GeminiResponse;
  try {
    response = await call(body(true), model);
  } catch (err) {
    // Alguns modelos não aceitam todo o JSON Schema: repete com o schema no texto do prompt.
    if (!(err instanceof GeminiApiError) || err.status !== 400) throw err;
    response = await call(body(false), model);
  }

  if (response.promptFeedback?.blockReason || response.candidates?.[0]?.finishReason === "SAFETY") {
    throw new GeminiRefusalError("A IA recusou este pedido. Reformule com foco educativo.");
  }
  const text = (response.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Resposta da IA fora do formato esperado (JSON inválido).");
  }
  const result = opts.schema.safeParse(parsed);
  if (!result.success) throw new Error("Resposta da IA fora do formato esperado.");
  return {
    data: result.data,
    usage: {
      model,
      inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}
