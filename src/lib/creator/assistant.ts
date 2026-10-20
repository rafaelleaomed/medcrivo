import { z } from "zod";
import type { CrivoSummary, GeneratedBy } from "./ai";

/**
 * Assistente (módulo "CreatorGPT" do CreatorMed): conversa com a memória do perfil.
 * Arquivo sem dependências de servidor para poder ser testado com `node --test`.
 */
export const ASSISTANT_TOOLS = ["carrossel", "stories", "ideias", "crivo"] as const;
export type AssistantTool = (typeof ASSISTANT_TOOLS)[number];

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/** Limite de mensagens enviadas ao modelo por conversa (as mais recentes). */
export const MAX_HISTORY = 20;

export const AssistantInputSchema = z.object({
  /** Conversa salva; ausente na primeira mensagem. */
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(4000),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export const AssistantReplySchema = z.object({
  reply: z.string().describe("Resposta em português do Brasil, direta, até 180 palavras. Markdown simples (listas e negrito)."),
  suggestions: z.array(z.string()).describe("Até 3 próximas perguntas curtas que o usuário pode fazer, até 8 palavras cada."),
  action: z
    .object({
      tool: z.enum(ASSISTANT_TOOLS),
      topic: z.string().describe("Tema para abrir a ferramenta, até 12 palavras."),
    })
    .nullable()
    .describe("Ferramenta do estúdio que resolve o pedido, ou null."),
});
export type AssistantReply = z.infer<typeof AssistantReplySchema>;

/** Resposta do assistente já passada pelo Crivo. */
export type AssistantTurn = AssistantReply & { crivo: CrivoSummary };

/** Mensagem salva: as do assistente guardam sugestões, ação e Crivo para reabrir a conversa igual. */
export type StoredMessage = ChatMessage & { turn?: Omit<AssistantTurn, "reply">; generatedBy?: GeneratedBy; at: string };
export type ConversationPayload = { messages: StoredMessage[] };

export const TOOL_LABELS: Record<AssistantTool, string> = {
  carrossel: "Criar carrossel",
  stories: "Criar stories",
  ideias: "Ver ideias",
  crivo: "Revisar no Crivo",
};

export const STARTER_PROMPTS = [
  "Me dê 5 pautas para esta semana",
  "Posso mostrar antes e depois?",
  "Reescreva minha bio do Instagram",
];

function normalize(text: string): string {
  return text.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Extrai um tema curto da mensagem para abrir a ferramenta. */
export function topicFrom(message: string): string {
  const cleaned = message
    .replace(/^(crie|cria|fa[cç]a|faz|gere|gera|monte|escreva|quero|preciso de|me d[eê]|me ajude a criar)\s+/i, "")
    .replace(/^(um|uma|uns|umas)?\s*(carrossel|post|stories|story|sequ[eê]ncia de stories|ideias|pautas)\s+(sobre|de|para)\s+/i, "")
    .replace(/[?.!]+$/, "")
    .trim();
  const words = cleaned.split(/\s+/).slice(0, 12).join(" ");
  return words || message.trim().slice(0, 80);
}

const NORM_ANSWERS: { test: RegExp; reply: string }[] = [
  {
    test: /antes e depois|antes\/depois/,
    reply:
      "Não é liberado sem condições. Para médicos, a **Resolução CFM 2.336/2023** admite a imagem com finalidade educativa, autorização do paciente, identidade preservada e sem promessa de resultado. Para dentistas, a **Resolução CFO 196/2019** condiciona as imagens ao tratamento feito pelo próprio profissional, com nome e CRO.\n\nNa dúvida, passe o texto no Crivo antes de publicar.",
  },
  {
    test: /preco|valor|promocao|desconto|sorteio/,
    reply:
      "Informar o valor da consulta é permitido pela **Resolução CFM 2.336/2023**. Continuam vedados promoção, desconto, combo de procedimentos, sorteio e qualquer mercantilização agressiva.",
  },
  {
    test: /paciente|caso clinico|exame|foto de paciente/,
    reply:
      "Casos e exames só podem aparecer sem nenhum dado que identifique o paciente (rosto, nome, data, prontuário, metadados da imagem) e com autorização por escrito. A LGPD trata dado de saúde como sensível. Prefira explicar o tema sem expor um caso real.",
  },
  {
    test: /crm|rqe|identificacao|rodape|especialista/,
    reply:
      "Toda peça precisa de **nome, a palavra MÉDICO e o CRM/UF**. Especialidade só aparece com RQE registrado. Estudante não se apresenta como médico. O rodapé dos slides do MedCrivo já segue essa regra a partir do seu perfil.",
  },
];

/** Resposta determinística usada sem IA: orienta e leva para a ferramenta certa. Não inventa dados. */
export function heuristicReply(message: string): AssistantReply {
  const text = normalize(message);

  const norm = NORM_ANSWERS.find((n) => n.test.test(text));
  if (norm) {
    return {
      reply: norm.reply,
      suggestions: ["Como escrever sem promessa de resultado?", "O que vai no rodapé do post?"],
      action: { tool: "crivo", topic: "" },
    };
  }

  if (/stories|story/.test(text)) {
    return {
      reply: "Monto uma sequência de 4 a 6 stories com abertura, conteúdo, uma interação (enquete ou quiz) e chamada final.",
      suggestions: ["Qual interação engaja mais?", "Quantos stories por dia?"],
      action: { tool: "stories", topic: topicFrom(message) },
    };
  }

  if (/carrossel|post|slide/.test(text)) {
    return {
      reply: "Abro o Carrossel com esse tema: capa em tom de manchete, um ponto por slide, legenda e chamada para comentar uma palavra-chave.",
      suggestions: ["Qual tema rende mais salvamentos?", "Como escrever uma boa capa?"],
      action: { tool: "carrossel", topic: topicFrom(message) },
    };
  }

  if (/ideia|pauta|tema|sobre o que|calendario|semana/.test(text)) {
    return {
      reply: "Gero pautas a partir do seu perfil, de um tema ou de um link de notícia ou artigo. Cada uma já vem com gancho, formato e passagem pelo Crivo.",
      suggestions: ["Pautas sobre prevenção", "Ideias a partir de uma notícia"],
      action: { tool: "ideias", topic: topicFrom(message) },
    };
  }

  if (/bio|legenda|reescrev|melhor/.test(text)) {
    return {
      reply:
        "Uma bio clara tem três linhas:\n- **Quem você é**: nome, MÉDICO e CRM/UF (ou situação de estudante).\n- **Para quem fala**: o público e o tema principal.\n- **Próximo passo**: onde a pessoa encontra você.\n\nSem promessa de resultado nem \"o melhor\". Cole sua versão aqui e eu reviso.",
      suggestions: ["Revise minha bio atual", "O que não pode na bio?"],
      action: null,
    };
  }

  return {
    reply:
      "Posso ajudar com pautas, carrosséis, stories, legendas e dúvidas sobre as normas de publicidade do CFM e do CFO. Diga o tema ou cole o texto que você quer melhorar.",
    suggestions: STARTER_PROMPTS,
    action: null,
  };
}

/** Título da conversa a partir da primeira mensagem. */
export function conversationTitle(message: string): string {
  const t = message.trim().replace(/\s+/g, " ");
  return t.length > 48 ? `${t.slice(0, 45).trimEnd()}...` : t;
}
