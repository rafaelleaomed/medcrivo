import { z } from "zod";
import type { AuditResult } from "@/lib/compliance";
import type { ScientificPaper } from "@/lib/consensus";

/**
 * Templates visuais extraídos do @doctorcreators (ver rea_plano-proximos-passos.md §2):
 * capa_noticia (foto + manchete condensada com destaques), conteudo (fundo claro, título + imagem + texto),
 * passo (PASSO N + texto), frase (fundo escuro, serifada), lista (número gigante + itens) e cta (Comente PALAVRA).
 */
export const SLIDE_TEMPLATES = ["capa_noticia", "conteudo", "passo", "frase", "lista", "cta"] as const;
export type SlideTemplate = (typeof SLIDE_TEMPLATES)[number];

export const FRAMEWORKS = [
  "mito_desfeito",
  "sintoma_silencioso",
  "erro_comum",
  "checklist",
  "caso_anonimizado",
  "norma_pode_nao_pode",
  "passo_a_passo",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

/** Estrutura que o modelo devolve (saída estruturada). Campos sempre presentes; vazio quando não se aplica. */
export const GeneratedSlideSchema = z.object({
  template: z.enum(SLIDE_TEMPLATES),
  kicker: z.string().describe("Rótulo curto acima do título, em caixa alta. Vazio se não houver."),
  headline: z.string().describe("Título do slide. Na capa: até 14 palavras, tom de manchete."),
  highlight: z.array(z.string()).describe("Palavras exatas do headline que recebem a cor de destaque."),
  body: z.string().describe("Texto de apoio do slide, até 40 palavras. Vazio na capa se o subtítulo bastar."),
  items: z.array(z.string()).describe("Itens do template lista (3 a 7). Vazio nos outros templates."),
  imagePrompt: z
    .string()
    .describe("Prompt em inglês para imagem editorial sem texto, sem pacientes identificáveis. Vazio em frase, passo e lista."),
});
export type GeneratedSlide = z.infer<typeof GeneratedSlideSchema>;

export const GeneratedPostSchema = z.object({
  framework: z.enum(FRAMEWORKS),
  angle: z.string().describe("Ângulo editorial escolhido em uma frase."),
  slides: z.array(GeneratedSlideSchema).describe("Entre 7 e 10 slides; o primeiro é capa_noticia e o último é cta."),
  caption: z.string().describe("Legenda curta (até 300 caracteres) terminando com o CTA de comentário."),
  cta: z.object({
    keyword: z.string().describe("Palavra única em CAIXA ALTA que o seguidor comenta, ex.: GUIA."),
    promise: z.string().describe("O que a pessoa recebe no direct ao comentar."),
    leadMagnetTitle: z.string(),
    leadMagnetOutline: z.array(z.string()).describe("Tópicos da isca (guia/checklist), 4 a 7."),
    dmMessage: z.string().describe("Mensagem enviada no direct a quem comentar a palavra."),
  }),
  evidenceQuery: z.string().describe("Consulta em inglês para buscar meta-análises/ECRs que sustentem o conteúdo."),
});
export type GeneratedPost = z.infer<typeof GeneratedPostSchema>;

export interface PostSlide extends GeneratedSlide {
  number: number;
  imageUrl?: string;
}

/** Rascunho final entregue ao estúdio: saída do modelo + imagens + Crivo + evidências reais. */
export interface PostDraft {
  topic: string;
  framework: Framework;
  angle: string;
  slides: PostSlide[];
  caption: string;
  cta: GeneratedPost["cta"];
  audit: AuditResult;
  /** Apenas referências retornadas pela busca real; lista vazia quando nada foi encontrado. */
  evidence: ScientificPaper[];
  generatedBy: { source: "claude" | "gemini" | "heuristica"; model?: string };
}
