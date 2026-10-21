import { z } from "zod";

/**
 * Roteiros de Reels/TikTok (módulo "Roteiros"): 3 opções de gancho + desenvolvimento + chamada.
 * Dois destinos: o médico GRAVA falando (roteiro + notas de edição) ou o vídeo é CRIADO do zero
 * em motion (prompt pronto para o HyperFrames, que o usuário cola no próprio Claude).
 * Arquivo sem dependências de servidor para poder ser testado com `node --test`.
 */
export const REEL_MODES = ["gravar", "motion"] as const;
export type ReelMode = (typeof REEL_MODES)[number];

export const REEL_GOALS = ["educar", "engajar", "converter"] as const;
export type ReelGoal = (typeof REEL_GOALS)[number];

export const REEL_DURATIONS = [30, 45, 60] as const;

export const MODE_LABELS: Record<ReelMode, string> = { gravar: "Eu gravo", motion: "Motion do zero" };
export const GOAL_LABELS: Record<ReelGoal, string> = { educar: "Educar", engajar: "Engajar", converter: "Converter" };

export const ReelsInputSchema = z.object({
  topic: z.string().trim().min(3, "Informe um tema com pelo menos 3 caracteres.").max(300),
  mode: z.enum(REEL_MODES).default("gravar"),
  goal: z.enum(REEL_GOALS).default("educar"),
  duration: z.union([z.literal(30), z.literal(45), z.literal(60)]).default(45),
  /** Opcional: texto do link ou do PDF já resumido, para o roteiro partir dele sem inventar fatos. */
  context: z.string().trim().max(4000).optional(),
});
export type ReelsInput = z.infer<typeof ReelsInputSchema>;

export const ReelBeatSchema = z.object({
  speech: z.string().describe("Fala de quem grava, ou narração. Frases curtas."),
  onScreen: z.string().describe("Texto na tela, até 8 palavras. Vazio se não precisar."),
  visual: z.string().describe("O que aparece, até 12 palavras (ex.: 'close falando, fundo do consultório')."),
});
export type ReelBeat = z.infer<typeof ReelBeatSchema>;

export const ReelOptionSchema = z.object({
  angle: z.string().describe("Ângulo em até 4 palavras: mito, erro comum, sinal de atenção, passo a passo, pergunta."),
  hook: z.string().describe("Gancho: a primeira frase, até 14 palavras, sem sensacionalismo e sem número."),
  beats: z.array(ReelBeatSchema).describe("Desenvolvimento em 3 a 5 blocos."),
  cta: z.string().describe("Chamada final: salvar, compartilhar ou perguntar. Nunca preço nem promessa."),
});
export type ReelOption = z.infer<typeof ReelOptionSchema>;

export const ReelsOutputSchema = z.object({
  options: z.array(ReelOptionSchema).describe("Exatamente 3 opções, com ângulos diferentes entre si."),
});
export type ReelsPlan = z.infer<typeof ReelsOutputSchema>;

function shorten(text: string, max = 48): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 3).trimEnd()}...` : t;
}

/** Mantém 3 opções com 3 a 5 blocos, sem blocos vazios. */
export function normalizeReels(plan: ReelsPlan): ReelsPlan {
  const options = plan.options
    .map((o) => ({
      ...o,
      hook: o.hook.trim(),
      cta: o.cta.trim(),
      beats: o.beats.filter((b) => b.speech.trim()).slice(0, 5),
    }))
    .filter((o) => o.hook && o.beats.length >= 3)
    .slice(0, 3);
  if (options.length === 0) throw new Error("Os roteiros vieram vazios.");
  return { options };
}

const CTA: Record<ReelGoal, string> = {
  educar: "Salve este vídeo e mande para quem precisa ver.",
  engajar: "Qual a sua maior dúvida sobre isso? Escreva nos comentários.",
  converter: "Comente GUIA e eu te envio um resumo educativo no direct.",
};

/** Rascunho determinístico usado sem IA. Não inventa estudo, número nem caso real. */
export function heuristicReels(input: ReelsInput): ReelsPlan {
  const topic = shorten(input.topic);
  const cta = CTA[input.goal];
  const options: ReelOption[] = [
    {
      angle: "Pergunta direta",
      hook: `Você sabe quando procurar avaliação sobre ${topic}?`,
      beats: [
        { speech: `Muita gente deixa ${topic} para depois.`, onScreen: "Deixar para depois?", visual: "close falando, fundo do consultório" },
        { speech: "Sinais que persistem ou pioram merecem avaliação.", onScreen: "Persistiu? Avalie.", visual: "texto em tópicos sobre fundo da marca" },
        { speech: "Anote quando começou e o que melhora ou piora. Isso ajuda na consulta.", onScreen: "Anote e leve à consulta", visual: "close falando" },
      ],
      cta,
    },
    {
      angle: "Mito desfeito",
      hook: `Mito: se melhorou sozinho, ${topic} não precisa de atenção.`,
      beats: [
        { speech: "Melhora não exclui a necessidade de avaliação.", onScreen: "Melhorou ≠ resolvido", visual: "texto grande sobre fundo da marca" },
        { speech: "Cada caso é individual e só uma consulta pode dizer o que fazer.", onScreen: "Cada caso é um caso", visual: "close falando" },
        { speech: "Informação educativa não substitui a avaliação de um profissional.", onScreen: "Informação não é consulta", visual: "texto sobre fundo da marca" },
      ],
      cta,
    },
    {
      angle: "Erro comum",
      hook: `O erro mais comum com ${topic}: esperar piorar.`,
      beats: [
        { speech: "Esperar piorar costuma atrasar a avaliação.", onScreen: "Não espere piorar", visual: "close falando, fundo neutro" },
        { speech: "Observe os sinais, registre e procure um profissional de confiança.", onScreen: "Observe. Registre. Procure.", visual: "três ícones simples em sequência" },
        { speech: "Quanto mais claro o relato, mais útil a consulta.", onScreen: "Relato claro ajuda", visual: "close falando" },
      ],
      cta,
    },
  ];
  return normalizeReels({ options });
}

/** Texto único de uma opção, usado no Crivo. */
export function reelText(option: ReelOption): string {
  return [option.hook, ...option.beats.flatMap((b) => [b.speech, b.onScreen]), option.cta].filter(Boolean).join("\n");
}

/** Duração aproximada de cada bloco, repartindo o tempo (gancho 3 s e chamada 4 s no total). */
export function beatTimes(option: ReelOption, duration: number): { start: number; end: number }[] {
  const hookEnd = 3;
  const ctaStart = Math.max(hookEnd + option.beats.length, duration - 4);
  const span = (ctaStart - hookEnd) / option.beats.length;
  return option.beats.map((_, i) => ({ start: Math.round(hookEnd + i * span), end: Math.round(hookEnd + (i + 1) * span) }));
}

function mmss(sec: number): string {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

/** Roteiro com marcação de tempo para quem grava: fala, texto na tela e direção visual por bloco. */
export function recordingScript(option: ReelOption, duration: number): string {
  const times = beatTimes(option, duration);
  const lines = [
    `[00:00-00:03] GANCHO: ${option.hook}`,
    ...option.beats.map(
      (b, i) =>
        `[${mmss(times[i].start)}-${mmss(times[i].end)}] ${b.speech}` +
        (b.onScreen ? `\n   Tela: ${b.onScreen}` : "") +
        `\n   Visual: ${b.visual}`,
    ),
    `[${mmss(Math.max(duration - 4, 4))}-${mmss(duration)}] CHAMADA: ${option.cta}`,
  ];
  return lines.join("\n");
}

/** Notas de edição para quem grava: onde cortar, dar zoom, legendar e inserir motion. */
export function editNotes(option: ReelOption, duration: number): string[] {
  const times = beatTimes(option, duration);
  const notes = [
    "Cortes: remova pausas, repetições e tropeços; mantenha o ritmo de uma frase curta a cada 2 a 3 segundos.",
    `Legendas: use legenda automática no vídeo inteiro e destaque em cor da marca a palavra do gancho ("${option.hook.split(" ").slice(0, 3).join(" ")}...").`,
    `0:00 a 0:03: zoom leve sobre o gancho; texto grande na tela com a pergunta ou afirmação.`,
  ];
  option.beats.forEach((b, i) => {
    if (b.onScreen) notes.push(`${mmss(times[i].start)}: mostrar na tela "${b.onScreen}" (entrada com animação curta).`);
  });
  notes.push(`${mmss(Math.max(duration - 4, 4))}: cartela final com a chamada e a identificação profissional.`);
  return notes;
}

export type MotionPromptContext = { identification: string; topic: string; duration: number };

/**
 * Prompt pronto para colar no Claude (Claude Code) com a skill do HyperFrames. O Claude escreve a animação
 * em HTML e o HyperFrames renderiza o MP4 no computador do usuário, sem gastar a chave de API do estúdio.
 */
export function buildMotionPrompt(option: ReelOption, ctx: MotionPromptContext): string {
  const times = beatTimes(option, ctx.duration);
  const scenes = [
    `Cena 1 (0 a 3 s) — gancho: "${option.hook}"`,
    ...option.beats.map(
      (b, i) =>
        `Cena ${i + 2} (${times[i].start} a ${times[i].end} s) — locução: "${b.speech}"` +
        (b.onScreen ? ` | texto na tela: "${b.onScreen}"` : "") +
        ` | visual: ${b.visual}`,
    ),
    `Cena final (${Math.max(ctx.duration - 4, 4)} a ${ctx.duration} s) — chamada: "${option.cta}" + identificação: ${ctx.identification}`,
  ];
  return [
    `Crie um vídeo vertical 9:16 (1080x1920), ${ctx.duration} segundos, motion graphics sobre "${ctx.topic}", usando HyperFrames (HTML → MP4).`,
    "",
    "Passos: use a skill do HyperFrames (npx hyperframes init), escreva a composição em HTML/CSS com animações sincronizadas e renderize com `npx hyperframes render --quality high`. Salve o MP4 na pasta do projeto.",
    "",
    "Identidade visual MedCrivo: fundo Verde-pinho #123C36 e Marfim #F5F2E9, destaque Lima #D6EF72, texto Tinta #172A27, títulos em caixa alta e fonte grossa, textos curtos e legíveis no celular.",
    "",
    "Roteiro por cena:",
    ...scenes,
    "",
    "Regras obrigatórias (CFM/CFO e LGPD): não acrescente números, porcentagens, estudos, promessas de resultado, antes e depois, preço ou promoção; não mostre pessoas reais nem dados de pacientes. Mantenha a identificação profissional visível na cena final. Conteúdo educativo, sem diagnóstico individual.",
    "",
    "Entrega: o MP4 final e um resumo de 3 linhas do que foi feito.",
  ].join("\n");
}
