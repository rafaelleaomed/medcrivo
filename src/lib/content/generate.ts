import Anthropic from "@anthropic-ai/sdk";
import { GeminiApiError } from "@/lib/ai/gemini";
import { askClaudeStructured, isAiConfigured } from "@/lib/creator/ai";
import { councilLabel, type DoctorProfile } from "@/lib/profile";
import type { CarouselJobInput } from "@/lib/store/types";
import { HUMANIZER_PROMPT_RULES, humanizeGeneratedCopy } from "./humanizer";
import { GeneratedPostSchema, type GeneratedPost, type GeneratedSlide } from "./schema";
import { buildHeuristicNarrative, narrativeQualityIssues } from "./editorialBriefing";

export interface GenerationResult {
  post: GeneratedPost;
  source: "claude" | "gemini" | "heuristica";
  model?: string;
  usage?: { inputTokens: number; outputTokens: number };
  /** Motivo do uso da heurística, quando a IA não respondeu. */
  fallbackReason?: string;
}

const TONES: Record<CarouselJobInput["tone"], string> = {
  didatico: "didático, com analogias do dia a dia e frases curtas",
  academico: "técnico e preciso, sem jargão desnecessário",
  consultorio: "acolhedor, como uma conversa de consultório",
};

// Prompt estável (sem dados variáveis) para aproveitar o cache de prefixo.
const SYSTEM_PROMPT = `Você é editor-chefe de conteúdo para profissionais de saúde no Instagram brasileiro.
Você escreve carrosséis que educam o paciente, geram autoridade e convertem comentários em contatos, sempre dentro das normas éticas.

${HUMANIZER_PROMPT_RULES}

Método editorial para retenção e compartilhamento:
- Não copie o tema bruto como manchete. Transforme-o numa promessa específica de leitura, com até 14 palavras.
- Escolha a estrutura pelo assunto. Não repita automaticamente sintomas → mito → passos → CTA.
- Construa uma cadeia causal: gancho → cena ou tensão concreta → explicação → limite/contraponto → aplicação → fechamento.
- O slide 2 precisa provar que vale continuar, trazendo contexto, contraste ou exemplo concreto.
- Cada slide acrescenta informação nova e cria a necessidade do próximo. Não parafraseie a mesma tese.
- Entregue valor cedo e faça o último slide pagar a promessa da capa antes de pedir qualquer ação.
- Use o gancho, o ângulo, o motivo de atualidade, o objetivo e a tendência do briefing quando existirem.
- Potencial de compartilhamento vem de reconhecimento, utilidade e surpresa honesta. Não invente urgência, números ou autoridade.
- O CTA deve nascer do conteúdo. Preencha cta.action com comment, save, share, follow ou none. Só use comment se existir uma entrega real; não force direct ou isca.
- Varie templates e ritmo conforme a pauta. Use conteudo, passo, lista e frase apenas quando cumprirem uma função narrativa.

Regras editoriais preventivas:
- Sem promessa de cura, de resultado ou garantia; sem "o melhor", "o único", "100%", "milagroso".
- Sem antes e depois identificável, sem expor pacientes, sem casos reais com dados que permitam identificação.
- Sem autopromoção sensacionalista.
- Sem diagnóstico ou prescrição individual pela internet; oriente procurar avaliação profissional.
- Para dentistas: a Resolução CFO 196/2019 condiciona imagens de diagnóstico e resultado final ao tratamento realizado pelo próprio cirurgião-dentista, com identificação por nome e CRO; selfie com paciente requer autorização escrita; não sugira imagens durante o procedimento. Não trate "antes e depois" como liberação irrestrita.
- Não cite estudos, revistas, autores, números de estudos ou DOIs. As referências científicas são anexadas depois por busca real; você só fornece a evidenceQuery.

Imagens: imagePrompt em inglês, cena editorial realista, sem texto, sem pessoas identificáveis como pacientes, sem agulhas nem sangue. Deixe vazio em frase, passo e lista.`;

function buildUserPrompt(input: CarouselJobInput, profile: DoctorProfile): string {
  const council = councilLabel(profile);
  const briefing = input.editorialBriefing;
  return [
    `Tema: ${input.topic}`,
    briefing ? `Briefing editorial:\n- Gancho: ${briefing.hook}\n- Ângulo: ${briefing.angle}\n- Por que agora: ${briefing.whyNow}\n- Formato sugerido: ${briefing.format}\n- Objetivo: ${briefing.goal}\n- Origem: ${briefing.source}${briefing.trendTitle ? `\n- Tendência relacionada: ${briefing.trendTitle}` : ""}` : null,
    input.sourceContext ? `Contexto da notícia/artigo de origem:\n${input.sourceContext}` : null,
    `Profissional: ${profile.name || "não informado"} — ${profile.profession === "dentista" ? "cirurgião-dentista" : "médico"}, ${profile.specialty || "especialidade não informada"}, ${council} ${profile.crm || "não informado"}.`,
    profile.audiencePains.length ? `Dores do público: ${profile.audiencePains.join("; ")}.` : null,
    `Tom: ${TONES[input.tone]}.`,
    `Quantidade de slides: exatamente ${input.slideCount} (primeiro capa_noticia, último cta).`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Garante a forma esperada pelos templates mesmo quando o modelo foge um pouco do pedido. */
export function normalizePost(post: GeneratedPost, slideCount: number): GeneratedPost {
  let slides = post.slides.filter((s) => s.headline.trim().length > 0).slice(0, slideCount);
  if (slides.length === 0) throw new Error("O modelo não retornou slides.");
  if (slides[0].template !== "capa_noticia") slides[0] = { ...slides[0], template: "capa_noticia" };
  const last = slides[slides.length - 1];
  const action = post.cta.action ?? (/\b(comente|direct)\b/i.test(`${post.caption} ${last.headline}`) ? "comment" : "save");
  if (last.template !== "cta" || slides.length === 1) {
    const ctaSlide: GeneratedSlide = slides.length === 1
      ? {
          template: "cta",
          kicker: "",
          headline: action === "comment" ? `Comente ${post.cta.keyword} para receber ${post.cta.promise}` : post.cta.promise,
          highlight: action === "comment" ? [post.cta.keyword] : [],
          body: "",
          items: [],
          imagePrompt: last.imagePrompt,
        }
      : { ...last, template: "cta" };
    slides = slides.length >= slideCount ? [...slides.slice(0, -1), ctaSlide] : [...slides, ctaSlide];
  }
  const keyword = post.cta.keyword.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase() || "GUIA";
  return {
    ...post,
    cta: { ...post.cta, action, keyword },
    slides: slides.map((s) => ({
      ...s,
      highlight: s.highlight.filter((w) => w && s.headline.toLowerCase().includes(w.toLowerCase())),
      items: s.template === "lista" ? s.items.slice(0, 7) : s.items,
    })),
  };
}

async function generateWithClaude(input: CarouselJobInput, profile: DoctorProfile): Promise<GenerationResult> {
  // Claude (ou Gemini, quando é o único configurado ou o Claude falha): ver askClaudeStructured.
  const { data: post, usage } = await askClaudeStructured({
    schema: GeneratedPostSchema,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(input, profile) }],
    maxTokens: 16000,
  });
  const normalized = normalizePost(humanizeGeneratedCopy(post), input.slideCount);
  const qualityIssues = narrativeQualityIssues(normalized, input.topic);
  if (qualityIssues.length) {
    throw new Error(`Roteiro rejeitado pelo crivo editorial: ${qualityIssues.join(" ")}`);
  }
  return {
    post: normalized,
    source: usage.model.startsWith("gemini") ? "gemini" : "claude",
    model: usage.model,
    usage: { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens },
  };
}

/** Rascunho determinístico usado sem chave de IA ou quando a chamada falha. Não inventa referências. */
export function generateHeuristicPost(input: CarouselJobInput, profile: DoctorProfile): GeneratedPost {
  const post = buildHeuristicNarrative(input, profile) as GeneratedPost;
  const normalized = normalizePost(humanizeGeneratedCopy(post), input.slideCount);
  const qualityIssues = narrativeQualityIssues(normalized, input.topic);
  if (qualityIssues.length) throw new Error(`Reserva rejeitada pelo crivo editorial: ${qualityIssues.join(" ")}`);
  return normalized;
}

export async function generatePost(input: CarouselJobInput, profile: DoctorProfile): Promise<GenerationResult> {
  if (!isAiConfigured()) {
    return { post: humanizeGeneratedCopy(generateHeuristicPost(input, profile)), source: "heuristica", fallbackReason: "Chave da IA não configurada." };
  }
  try {
    return await generateWithClaude(input, profile);
  } catch (err) {
    // Recusa é resposta legítima: não mascarar com conteúdo heurístico.
    if (err instanceof Error && err.message.startsWith("A IA recusou")) throw err;
    const reason = err instanceof Anthropic.APIError ? `Erro da API (${err.status ?? "rede"})` : err instanceof GeminiApiError ? err.message : err instanceof Error ? err.message : "Erro desconhecido";
    console.warn("Geração com Claude falhou, usando heurística:", reason);
    return { post: humanizeGeneratedCopy(generateHeuristicPost(input, profile)), source: "heuristica", fallbackReason: reason };
  }
}
