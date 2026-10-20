import { z } from "zod";

/**
 * Stories (módulo "Stories" do CreatorMed): sequência de 4 a 6 telas 9:16 com uma interação.
 * Arquivo sem dependências de servidor para poder ser testado com `node --test`.
 */
export const STORY_GOALS = ["educar", "engajar", "converter"] as const;
export type StoryGoal = (typeof STORY_GOALS)[number];

export const STORY_KINDS = ["abertura", "conteudo", "enquete", "quiz", "caixa", "cta"] as const;
export type StoryKind = (typeof STORY_KINDS)[number];

export const StoriesInputSchema = z.object({
  topic: z.string().trim().min(3, "Informe um tema com pelo menos 3 caracteres.").max(300),
  goal: z.enum(STORY_GOALS).default("educar"),
  count: z.number().int().min(4).max(6).default(5),
});
export type StoriesInput = z.infer<typeof StoriesInputSchema>;

export const StoryFrameSchema = z.object({
  kind: z.enum(STORY_KINDS),
  text: z.string().describe("Texto principal da tela, até 18 palavras."),
  detail: z.string().describe("Linha de apoio, até 20 palavras. Vazio se não precisar."),
  question: z.string().describe("Pergunta do adesivo (enquete, quiz ou caixa). Vazio nas outras telas."),
  options: z.array(z.string()).describe("Opções do adesivo: 2 na enquete, 3 no quiz. Vazio nas outras telas."),
  visual: z.string().describe("Direção visual curta, até 10 palavras (ex.: 'selfie falando, fundo do consultório')."),
});
export type StoryFrame = z.infer<typeof StoryFrameSchema>;

export const StoriesOutputSchema = z.object({
  title: z.string().describe("Nome curto da sequência, até 6 palavras."),
  frames: z.array(StoryFrameSchema).describe("Primeira tela = abertura; última = cta; ao menos uma interação no meio."),
});
export type StoriesPlan = z.infer<typeof StoriesOutputSchema>;

export const GOAL_LABELS: Record<StoryGoal, string> = { educar: "Educar", engajar: "Engajar", converter: "Converter" };
export const KIND_LABELS: Record<StoryKind, string> = {
  abertura: "Abertura",
  conteudo: "Conteúdo",
  enquete: "Enquete",
  quiz: "Quiz",
  caixa: "Caixa de perguntas",
  cta: "Chamada",
};

const INTERACTIVE: StoryKind[] = ["enquete", "quiz", "caixa"];

function clean(frame: StoryFrame): StoryFrame {
  const interactive = INTERACTIVE.includes(frame.kind);
  const max = frame.kind === "quiz" ? 3 : frame.kind === "enquete" ? 2 : 0;
  return {
    ...frame,
    question: interactive ? frame.question : "",
    options: max ? frame.options.filter((o) => o.trim()).slice(0, max) : [],
  };
}

/** A sequência termina numa chamada ou numa caixa de perguntas. */
const ENDINGS: StoryKind[] = ["cta", "caixa"];

/** Garante abertura no início, chamada no fim e pelo menos uma interação, dentro do número pedido. */
export function normalizeStories(plan: StoriesPlan, count: number): StoriesPlan {
  let frames = plan.frames.filter((f) => f.text.trim()).map(clean).slice(0, count);
  if (frames.length === 0) throw new Error("A sequência veio vazia.");
  if (frames[0].kind !== "abertura") frames[0] = { ...frames[0], kind: "abertura", question: "", options: [] };
  if (frames.length > 1 && !ENDINGS.includes(frames[frames.length - 1].kind)) {
    const ctaFrame: StoryFrame = {
      kind: "cta",
      text: "Ficou com dúvida? Me mande uma pergunta.",
      detail: "Respondo as mais frequentes nos próximos stories.",
      question: "",
      options: [],
      visual: "selfie falando, fundo neutro",
    };
    frames = frames.length >= count ? [...frames.slice(0, -1), ctaFrame] : [...frames, ctaFrame];
  }
  if (frames.length > 2 && !frames.some((f) => INTERACTIVE.includes(f.kind))) {
    const i = Math.min(2, frames.length - 2);
    frames[i] = {
      ...frames[i],
      kind: "enquete",
      question: frames[i].question || "Você já sabia disso?",
      options: frames[i].options.length === 2 ? frames[i].options : ["Já sabia", "Não sabia"],
    };
  }
  return { title: plan.title.trim() || "Sequência de stories", frames };
}

function shorten(text: string, max = 48): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 3).trimEnd()}...` : t;
}

/** Rascunho determinístico usado sem IA. Não inventa estudo, número nem caso real. */
export function heuristicStories(input: StoriesInput): StoriesPlan {
  const topic = shorten(input.topic);
  const ending: Record<StoryGoal, StoryFrame> = {
    educar: {
      kind: "cta",
      text: "Salve e mande para quem precisa ver isso.",
      detail: "Informação não substitui consulta.",
      question: "",
      options: [],
      visual: "texto sobre fundo da marca",
    },
    engajar: {
      kind: "caixa",
      text: "Qual a sua maior dúvida sobre isso?",
      detail: "Respondo as mais frequentes amanhã.",
      question: `Sua dúvida sobre ${topic}`,
      options: [],
      visual: "selfie falando, fundo neutro",
    },
    converter: {
      kind: "cta",
      text: "Responda GUIA e eu te envio o resumo no direct.",
      detail: "Um material curto para consultar depois.",
      question: "",
      options: [],
      visual: "texto sobre fundo da marca",
    },
  };
  const frames: StoryFrame[] = [
    {
      kind: "abertura",
      text: `Vamos falar de ${topic}?`,
      detail: "Em poucos stories, o essencial.",
      question: "",
      options: [],
      visual: "selfie falando, fundo do consultório",
    },
    {
      kind: "enquete",
      text: "Antes, uma pergunta rápida.",
      detail: "",
      question: `Você sabe quando procurar avaliação sobre ${topic}?`,
      options: ["Sei", "Não sei"],
      visual: "fundo liso com adesivo de enquete",
    },
    {
      kind: "conteudo",
      text: "Sinais que persistem ou pioram merecem avaliação.",
      detail: "Anote quando começaram e o que melhora ou piora.",
      question: "",
      options: [],
      visual: "texto em tópicos sobre fundo da marca",
    },
    {
      kind: "quiz",
      text: "Verdade ou mito?",
      detail: "",
      question: "Se melhorou sozinho, não preciso investigar.",
      options: ["Verdade", "Mito", "Depende"],
      visual: "fundo liso com adesivo de quiz",
    },
    {
      kind: "conteudo",
      text: "Depende. Melhora não exclui a necessidade de avaliação.",
      detail: "Cada caso precisa de uma consulta individual.",
      question: "",
      options: [],
      visual: "selfie explicando, fundo neutro",
    },
  ];
  return normalizeStories(
    { title: `Stories: ${shorten(input.topic, 30)}`, frames: [...frames.slice(0, input.count - 1), ending[input.goal]] },
    input.count,
  );
}

/** Texto único da sequência, usado no Crivo. */
export function storiesText(plan: StoriesPlan): string {
  return plan.frames
    .map((f) => [f.text, f.detail, f.question, ...f.options].filter(Boolean).join("\n"))
    .join("\n\n");
}
