import Anthropic from "@anthropic-ai/sdk";
import { GeminiApiError } from "@/lib/ai/gemini";
import { askClaudeStructured, isAiConfigured } from "@/lib/creator/ai";
import { councilLabel, type DoctorProfile } from "@/lib/profile";
import type { CarouselJobInput } from "@/lib/store/types";
import { HUMANIZER_PROMPT_RULES, humanizeGeneratedCopy } from "./humanizer";
import { GeneratedPostSchema, type GeneratedPost, type GeneratedSlide } from "./schema";

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

Método (validado em perfis de marketing médico com alto engajamento):
- Capa (template capa_noticia): manchete em tom de notícia ou alerta, até 14 palavras, com 2 a 4 palavras de destaque. O body da capa é um subtítulo de uma linha.
- Miolo: um único ponto por slide. Use conteudo para explicar, passo para sequências ("PASSO 1", "PASSO 2"...), lista para checklists e frase para uma reflexão curta de impacto.
- Último slide (template cta): convite para comentar UMA palavra-chave em caixa alta para receber uma isca no direct (guia, checklist ou lista). A legenda termina com o mesmo convite.

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
  return [
    `Tema: ${input.topic}`,
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
  if (last.template !== "cta" || slides.length === 1) {
    const ctaSlide: GeneratedSlide = {
      template: "cta",
      kicker: "",
      headline: `Comente ${post.cta.keyword} para receber ${post.cta.promise}`,
      highlight: [post.cta.keyword],
      body: "",
      items: [],
      imagePrompt: last.imagePrompt,
    };
    slides = slides.length >= slideCount ? [...slides.slice(0, -1), ctaSlide] : [...slides, ctaSlide];
  }
  const keyword = post.cta.keyword.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase() || "GUIA";
  return {
    ...post,
    cta: { ...post.cta, keyword },
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
  return {
    post: normalizePost(humanizeGeneratedCopy(post), input.slideCount),
    source: usage.model.startsWith("gemini") ? "gemini" : "claude",
    model: usage.model,
    usage: { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens },
  };
}

/** Rascunho determinístico usado sem chave de IA ou quando a chamada falha. Não inventa referências. */
export function generateHeuristicPost(input: CarouselJobInput, profile: DoctorProfile): GeneratedPost {
  const topic = input.topic.trim();
  const short = topic.length > 60 ? `${topic.slice(0, 57)}...` : topic;
  const spec = profile.specialty || "saúde";
  const slides: GeneratedSlide[] = [
    {
      template: "capa_noticia",
      kicker: spec.toUpperCase(),
      headline: `O que pouca gente entende sobre “${short}”`,
      highlight: ["pouca gente"],
      body: "Um guia direto para entender e saber quando procurar avaliação.",
      items: [],
      imagePrompt: `editorial healthcare scene about ${topic}, modern clinic, soft natural light`,
    },
    { template: "conteudo", kicker: "ENTENDA", headline: "Por que isso importa", highlight: [], body: "Este tema afeta mais pessoas do que parece e costuma dar sinais discretos no início.", items: [], imagePrompt: `conceptual medical illustration of ${topic}, clean background` },
    { template: "lista", kicker: "SINAIS DE ATENÇÃO", headline: "Fique atento a", highlight: [], body: "", items: ["Mudanças persistentes no seu corpo", "Sintomas que voltam com frequência", "Histórico familiar relevante", "Piora progressiva sem explicação"], imagePrompt: "" },
    { template: "conteudo", kicker: "MITO", headline: "O erro mais comum", highlight: ["erro"], body: "Esperar o problema ficar evidente para buscar ajuda. Avaliação precoce amplia as opções de cuidado.", items: [], imagePrompt: "calm doctor consultation room, empty chairs, warm light" },
    { template: "passo", kicker: "PASSO 1", headline: "Observe e anote", highlight: [], body: "Registre quando os sintomas aparecem, a intensidade e o que melhora ou piora.", items: [], imagePrompt: "" },
    { template: "passo", kicker: "PASSO 2", headline: "Procure avaliação profissional", highlight: [], body: "Leve suas anotações para a consulta. Elas ajudam a orientar a investigação.", items: [], imagePrompt: "" },
    { template: "frase", kicker: "", headline: "Cuidar cedo é escolher ter mais opções depois.", highlight: ["mais opções"], body: "", items: [], imagePrompt: "" },
    { template: "conteudo", kicker: "RESUMO", headline: "O que levar deste post", highlight: [], body: "Informação de qualidade não substitui consulta, mas ajuda você a chegar mais preparado.", items: [], imagePrompt: "notebook and stethoscope on desk, minimal" },
    { template: "cta", kicker: "", headline: "Comente GUIA para receber o checklist completo", highlight: ["GUIA"], body: "", items: [], imagePrompt: "warm minimal healthcare still life" },
  ];
  return normalizePost(
    {
      framework: "checklist",
      angle: `Guia prático sobre ${topic}`,
      slides,
      caption: `Salve este post e compartilhe com quem precisa. Comente GUIA que eu te envio o checklist deste tema no direct.`,
      cta: {
        keyword: "GUIA",
        promise: "o checklist deste tema",
        leadMagnetTitle: `Checklist: ${short}`,
        leadMagnetOutline: ["Sinais de atenção", "Quando procurar avaliação", "Como se preparar para a consulta", "Perguntas para levar ao profissional"],
        dmMessage: `Oi! Aqui está o checklist de “${short}”. Qualquer dúvida, agende uma avaliação pelo link da bio.`,
      },
      evidenceQuery: topic,
    },
    input.slideCount,
  );
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
