import { z } from "zod";
import type { DoctorProfile } from "../profile";

/**
 * Ideias (módulo "Ideias" do CreatorMed: pautas, notícias e artigos → roteiro).
 * Arquivo sem dependências de servidor para poder ser testado com `node --test`.
 */
export const IDEA_SOURCES = ["pauta", "noticia", "artigo"] as const;
export type IdeaSource = (typeof IDEA_SOURCES)[number];

export const IDEA_FORMATS = ["carrossel", "reels", "stories"] as const;
export type IdeaFormat = (typeof IDEA_FORMATS)[number];

export const IDEA_PILLARS = ["educar", "desmistificar", "prevenir", "rotina", "norma"] as const;
export type IdeaPillar = (typeof IDEA_PILLARS)[number];

export const IdeasInputSchema = z.object({
  theme: z.string().trim().max(300).default(""),
  source: z.enum(IDEA_SOURCES).default("pauta"),
  /** Título, resumo e fonte extraídos do link (opcional). */
  sourceContext: z.string().max(4000).optional(),
  count: z.number().int().min(3).max(8).default(6),
});
export type IdeasInput = z.infer<typeof IdeasInputSchema>;

export const IdeaSchema = z.object({
  title: z.string().describe("Pauta em tom de manchete, até 12 palavras."),
  hook: z.string().describe("Primeira frase do post ou do vídeo, até 18 palavras."),
  angle: z.string().describe("Por que esse ângulo funciona para o público, uma frase curta."),
  format: z.enum(IDEA_FORMATS).describe("Formato mais indicado."),
  pillar: z.enum(IDEA_PILLARS),
  evidenceQuery: z.string().describe("Consulta em inglês para buscar evidência real depois."),
});
export type Idea = z.infer<typeof IdeaSchema>;

export const IdeasOutputSchema = z.object({
  ideas: z.array(IdeaSchema).describe("Pautas distintas entre si, sem repetir ângulo."),
});

export const SOURCE_LABELS: Record<IdeaSource, string> = { pauta: "Pautas", noticia: "Notícias", artigo: "Artigos" };
export const FORMAT_LABELS: Record<IdeaFormat, string> = { carrossel: "Carrossel", reels: "Reels", stories: "Stories" };
export const PILLAR_LABELS: Record<IdeaPillar, string> = {
  educar: "Educar",
  desmistificar: "Mito",
  prevenir: "Prevenção",
  rotina: "Rotina",
  norma: "Norma",
};

/** Tema base quando o usuário não digita nada: interesses do perfil, depois a área. */
export function defaultTheme(profile: Pick<DoctorProfile, "interests" | "specialty">): string {
  return profile.interests.find((i) => i.trim())?.trim() || profile.specialty.trim() || "saúde preventiva";
}

function shorten(text: string, max = 60): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 3).trimEnd()}...` : t;
}

/** Rascunho determinístico usado sem IA. Não inventa notícia, estudo nem número. */
export function heuristicIdeas(input: IdeasInput, profile: Pick<DoctorProfile, "interests" | "specialty">): Idea[] {
  const theme = shorten(input.theme || defaultTheme(profile));
  const query = theme;
  const fromSource =
    input.source === "noticia"
      ? [
          {
            title: `O que a notícia sobre ${theme} muda para você`,
            hook: "Saiu uma notícia sobre isso. Vamos separar o que é fato do que é exagero.",
            angle: "Traduz a manchete para a rotina do paciente, sem alarme.",
            format: "reels",
            pillar: "educar",
          },
          {
            title: `${theme}: 3 perguntas que a manchete não respondeu`,
            hook: "Antes de compartilhar essa notícia, veja o que ela deixou de fora.",
            angle: "Ensina o público a ler notícia de saúde com senso crítico.",
            format: "carrossel",
            pillar: "desmistificar",
          },
        ]
      : input.source === "artigo"
        ? [
            {
              title: `O que a ciência já sabe sobre ${theme}`,
              hook: "Traduzi o que os estudos dizem em linguagem de consultório.",
              angle: "Mostra cuidado com evidência e gera confiança.",
              format: "carrossel",
              pillar: "educar",
            },
            {
              title: `${theme}: o que ainda não tem resposta`,
              hook: "Nem tudo sobre isso está definido. E tudo bem dizer isso.",
              angle: "Honestidade sobre limites da evidência diferencia o perfil.",
              format: "reels",
              pillar: "desmistificar",
            },
          ]
        : [];

  const base: Omit<Idea, "evidenceQuery">[] = [
    ...(fromSource as Omit<Idea, "evidenceQuery">[]),
    {
      title: `O mito sobre ${theme} que ainda circula`,
      hook: "Você provavelmente já ouviu isso. E não é bem assim.",
      angle: "Desfazer um mito comum gera salvamentos e compartilhamentos.",
      format: "carrossel",
      pillar: "desmistificar",
    },
    {
      title: `Sinais de ${theme} que merecem atenção`,
      hook: "Alguns sinais parecem pequenos, mas pedem avaliação.",
      angle: "Checklist prático que o seguidor salva para consultar depois.",
      format: "carrossel",
      pillar: "prevenir",
    },
    {
      title: `O erro mais comum com ${theme}`,
      hook: "Esse erro é mais frequente do que parece no consultório.",
      angle: "Aponta um comportamento sem culpar o paciente.",
      format: "reels",
      pillar: "educar",
    },
    {
      title: `${theme}: enquete do que o seu público sabe`,
      hook: "Verdade ou mito? Responda antes de ver a explicação.",
      angle: "Interação em stories mostra as dúvidas reais do público.",
      format: "stories",
      pillar: "rotina",
    },
    {
      title: `Como se preparar para a consulta sobre ${theme}`,
      hook: "Leve estas anotações e aproveite melhor a sua consulta.",
      angle: "Passo a passo útil que aproxima o público do consultório.",
      format: "carrossel",
      pillar: "prevenir",
    },
    {
      title: `O que pode e o que não pode ao falar de ${theme}`,
      hook: "Nem tudo que se vê nas redes sobre isso respeita as normas.",
      angle: "Mostra cuidado ético e posiciona o perfil como referência.",
      format: "reels",
      pillar: "norma",
    },
  ];
  return base.slice(0, input.count).map((idea) => ({ ...idea, evidenceQuery: query }));
}

/** Texto único de uma pauta, usado no Crivo. */
export function ideaText(idea: Pick<Idea, "title" | "hook" | "angle">): string {
  return `${idea.title}\n${idea.hook}\n${idea.angle}`;
}
