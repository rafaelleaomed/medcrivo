import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { getClaudeClient, getClaudeModel, isClaudeConfigured } from "@/lib/ai/claude";
import { HealthcareComplianceEngine, type AuditResult } from "@/lib/compliance";
import { CAREER_STAGE_LABELS, councilLabel, showsSpecialty, type DoctorProfile } from "@/lib/profile";

/** Origem do conteúdo, mostrada na tela para o usuário saber se veio da IA ou do rascunho de reserva. */
export type GeneratedBy = { source: "claude" | "heuristica"; model?: string; fallbackReason?: string };

export type Usage = { model: string; inputTokens: number; outputTokens: number };

export class RefusalError extends Error {}

/** Regras editoriais comuns às ferramentas de criação (prefixo estável para o cache). */
export const EDITORIAL_RULES = `Regras editoriais (normas do CFM, do CFO e LGPD):
- Sem promessa de cura, resultado ou garantia; sem "o melhor", "o único", "100%", "milagroso", "definitivo".
- Sem antes e depois, sem expor pacientes, sem casos com dados que permitam identificação.
- Sem diagnóstico ou prescrição individual pela internet; oriente procurar avaliação profissional.
- Sem preços, promoções, sorteios ou condições comerciais.
- Sem autopromoção sensacionalista nem promessa de alcance ou viralização.
- Nunca cite estudos, revistas, autores, números, porcentagens ou DOIs. Evidências são buscadas depois por pesquisa real.
- Português do Brasil, frases curtas, sem clichês de IA ("no vasto universo", "é crucial ressaltar", "mergulhar").
- Vale para médicos e dentistas: não escreva só "médicos" quando a regra vale para os dois.`;

/** Descrição do profissional para o prompt, respeitando a situação (estudante não é médico; especialidade só com RQE). */
export function describeProfessional(profile: DoctorProfile): string {
  const role =
    profile.profession === "dentista" ? "cirurgião-dentista" : CAREER_STAGE_LABELS[profile.careerStage].toLowerCase();
  const specialty = showsSpecialty(profile) && profile.specialty ? `, especialidade ${profile.specialty}` : "";
  const area = !specialty && profile.specialty ? `, área de interesse ${profile.specialty}` : "";
  const council = profile.careerStage === "estudante" ? "" : `, ${councilLabel(profile)} ${profile.crm || "não informado"}`;
  const pains = profile.audiencePains.length ? `\nDores do público: ${profile.audiencePains.join("; ")}.` : "";
  return `Profissional: ${profile.name || "não informado"} — ${role}${specialty}${area}${council}.${pains}`;
}

/**
 * Pede uma resposta estruturada ao Claude. Proxies sem suporte a saída estruturada respondem 400:
 * nesse caso repete pedindo o JSON no texto e valida com o mesmo schema.
 */
export async function askClaudeStructured<S extends z.ZodType>(opts: {
  schema: S;
  system: string;
  messages: Anthropic.MessageParam[];
  maxTokens?: number;
}): Promise<{ data: z.infer<S>; usage: Usage }> {
  const client = getClaudeClient();
  const request = {
    model: getClaudeModel(),
    max_tokens: opts.maxTokens ?? 8000,
    cache_control: { type: "ephemeral" as const },
    system: opts.system,
    messages: opts.messages,
  };

  let data: z.infer<S> | null = null;
  let response: Anthropic.Message;
  try {
    const parsed = await client.messages.parse({
      ...request,
      output_config: { format: zodOutputFormat(opts.schema), effort: "medium" },
    });
    response = parsed;
    data = (parsed.parsed_output as z.infer<S> | null) ?? null;
  } catch (err) {
    if (!(err instanceof Anthropic.BadRequestError)) throw err;
    response = await client.messages.create({
      ...request,
      system: `${opts.system}\n\nResponda somente com um objeto JSON válido (sem markdown) que siga este JSON Schema:\n${JSON.stringify(z.toJSONSchema(opts.schema))}`,
    });
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const result = opts.schema.safeParse(JSON.parse(json));
    data = result.success ? result.data : null;
  }

  if (response.stop_reason === "refusal") {
    throw new RefusalError("A IA recusou este pedido. Reformule com foco educativo.");
  }
  if (!data) throw new Error(`Resposta da IA fora do formato esperado (stop_reason: ${response.stop_reason}).`);
  return {
    data,
    usage: { model: response.model, inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
  };
}

/**
 * Tenta a IA e cai no rascunho heurístico quando não há chave ou a chamada falha.
 * Recusa não é mascarada: o erro sobe para a rota.
 */
export async function withFallback<T>(
  label: string,
  ai: () => Promise<{ data: T; usage: Usage }>,
  heuristic: () => T,
): Promise<{ data: T; generatedBy: GeneratedBy; usage?: Usage }> {
  if (!isClaudeConfigured()) {
    return { data: heuristic(), generatedBy: { source: "heuristica", fallbackReason: "Chave da IA não configurada." } };
  }
  try {
    const { data, usage } = await ai();
    return { data, usage, generatedBy: { source: "claude", model: usage.model } };
  } catch (err) {
    if (err instanceof RefusalError) throw err;
    const reason =
      err instanceof Anthropic.APIError ? `Erro da API (${err.status ?? "rede"})` : err instanceof Error ? err.message : "Erro desconhecido";
    console.warn(`${label}: IA falhou, usando heurística:`, reason);
    return { data: heuristic(), generatedBy: { source: "heuristica", fallbackReason: reason } };
  }
}

/**
 * Passa o texto pelo Crivo. `requireIdentification: false` ignora a falta de CRM/UF,
 * útil para pautas e respostas do assistente, que ainda não são peças publicadas.
 */
export function crivo(text: string, profile: DoctorProfile, { requireIdentification = true } = {}): AuditResult {
  const audit = HealthcareComplianceEngine.audit(text, {
    profession: profile.profession,
    doctorName: profile.name,
    crm: profile.crm,
    hasRqe: Boolean(profile.rqe.trim()),
  });
  if (requireIdentification) return audit;
  const infractions = audit.infractions.filter((i) => i.category !== "identificacao_obrigatoria");
  if (infractions.length === audit.infractions.length) return audit;
  let score = 100;
  for (const i of infractions) score -= i.severity === "CRITICAL" ? 30 : i.severity === "WARNING" ? 10 : 5;
  score = Math.max(0, score);
  return { ...audit, infractions, score, isApproved: score >= 80 && !infractions.some((i) => i.severity === "CRITICAL") };
}

/** Resumo do Crivo guardado junto de cada item. */
export type CrivoSummary = Pick<AuditResult, "score" | "isApproved" | "infractions">;

export function summarize(audit: AuditResult): CrivoSummary {
  return { score: audit.score, isApproved: audit.isApproved, infractions: audit.infractions };
}
