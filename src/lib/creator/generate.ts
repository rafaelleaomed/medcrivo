import { identificationLine, type DoctorProfile } from "@/lib/profile";
import { askClaudeStructured, crivo, describeProfessional, EDITORIAL_RULES, summarize, withFallback, type CrivoSummary } from "./ai";
import {
  AssistantReplySchema,
  heuristicReply,
  MAX_HISTORY,
  type AssistantTurn,
  type ChatMessage,
} from "./assistant";
import { heuristicIdeas, ideaText, IdeasOutputSchema, type Idea, type IdeasInput } from "./ideas";
import { heuristicReels, normalizeReels, reelText, ReelsOutputSchema, type ReelOption, type ReelsInput } from "./reels";
import { heuristicStories, normalizeStories, StoriesOutputSchema, storiesText, type StoriesInput, type StoriesPlan } from "./stories";

/* ---------------------------------- Ideias --------------------------------- */

const IDEAS_SYSTEM = `Você é editor de pautas para profissionais de saúde no Instagram brasileiro.
Você propõe pautas que educam o paciente e geram autoridade, cada uma com gancho forte e formato indicado.

Método:
- Pautas distintas entre si: misture mito desfeito, sinal de atenção, erro comum, checklist, passo a passo e "pode e não pode".
- Gancho = a primeira frase do post ou do vídeo, que faz parar a rolagem sem sensacionalismo.
- Formato: carrossel para conteúdo de salvar; reels para opinião e explicação rápida; stories para enquete e dúvidas.
- Fonte "noticia": comente a notícia do contexto, sem acrescentar fatos que não estejam nele. Sem contexto, proponha pautas no formato de notícia sobre temas recorrentes, sem afirmar fatos datados.
- Fonte "artigo": traduza o artigo do contexto para a linguagem do paciente, sem números que não estejam nele.

${EDITORIAL_RULES}`;

export type IdeaWithCrivo = Idea & { crivo: CrivoSummary };

export async function generateIdeas(input: IdeasInput, profile: DoctorProfile) {
  const result = await withFallback(
    "Ideias",
    async () => {
      const { data, usage } = await askClaudeStructured({
        schema: IdeasOutputSchema,
        system: IDEAS_SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              `Fonte: ${input.source}`,
              `Tema: ${input.theme || "livre, a partir do perfil"}`,
              input.sourceContext ? `Contexto do link:\n${input.sourceContext}` : null,
              describeProfessional(profile),
              profile.interests.length ? `Interesses: ${profile.interests.join("; ")}.` : null,
              `Quantidade: exatamente ${input.count} pautas.`,
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
      });
      const ideas = data.ideas.filter((i) => i.title.trim()).slice(0, input.count);
      if (ideas.length === 0) throw new Error("A IA não retornou pautas.");
      return { data: ideas, usage };
    },
    () => heuristicIdeas(input, profile),
  );
  const ideas: IdeaWithCrivo[] = result.data.map((idea) => ({
    ...idea,
    crivo: summarize(crivo(ideaText(idea), profile, { requireIdentification: false })),
  }));
  return { ...result, data: ideas };
}

/* --------------------------------- Stories --------------------------------- */

const GOAL_BRIEF: Record<StoriesInput["goal"], string> = {
  educar: "educar: explicar o tema em passos curtos e terminar pedindo para salvar ou compartilhar",
  engajar: "engajar: usar enquete e quiz e terminar com caixa de perguntas",
  converter:
    "converter: terminar com convite para responder UMA palavra-chave no direct e receber um material educativo (nunca preço, promoção ou promessa)",
};

const STORIES_SYSTEM = `Você é roteirista de stories para profissionais de saúde no Instagram brasileiro.
Você escreve sequências de 4 a 6 telas 9:16, uma ideia por tela, para quem grava falando para a câmera ou posta texto sobre fundo da marca.

Método:
- Tela 1 (abertura): gancho que faz o seguidor tocar para avançar.
- Meio: conteúdo curto e pelo menos uma interação (enquete com 2 opções, quiz com 3 opções ou caixa de perguntas).
- Última tela: chamada (cta) ou caixa de perguntas, conforme o objetivo.
- Texto curto: até 18 palavras na tela; o resto é fala, não legenda.

${EDITORIAL_RULES}`;

export type StoriesResult = StoriesPlan & { crivo: CrivoSummary; footer: string };

export async function generateStories(input: StoriesInput, profile: DoctorProfile) {
  const result = await withFallback(
    "Stories",
    async () => {
      const { data, usage } = await askClaudeStructured({
        schema: StoriesOutputSchema,
        system: STORIES_SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              `Tema: ${input.topic}`,
              `Objetivo: ${GOAL_BRIEF[input.goal]}.`,
              describeProfessional(profile),
              `Quantidade de telas: exatamente ${input.count}.`,
            ].join("\n"),
          },
        ],
      });
      return { data: normalizeStories(data, input.count), usage };
    },
    () => heuristicStories(input),
  );
  // A identificação vai no rodapé de cada tela; o Crivo avalia a sequência com ela.
  const footer = identificationLine(profile);
  const audit = crivo(`${storiesText(result.data)}\n\n${footer}`, profile);
  const plan: StoriesResult = { ...result.data, crivo: summarize(audit), footer };
  return { ...result, data: plan };
}

/* ---------------------------------- Roteiros ------------------------------- */

const REELS_SYSTEM = `Você é roteirista de Reels e TikTok para profissionais de saúde no Instagram brasileiro.
Você escreve 3 roteiros alternativos para o mesmo tema, cada um com um ângulo diferente.

Método:
- Gancho: a primeira frase, até 14 palavras, que faz parar a rolagem sem sensacionalismo e sem número.
- Desenvolvimento: 3 a 5 blocos curtos; uma ideia por bloco; fala em frases curtas, como quem conversa.
- Texto na tela: até 8 palavras, só quando ajuda.
- Chamada final: salvar, compartilhar ou perguntar, conforme o objetivo (nunca preço, promoção ou promessa).
- Os 3 ângulos devem ser diferentes (mito, erro comum, sinal de atenção, passo a passo, pergunta).
- Se houver contexto de link ou PDF, use só o que está nele.

${EDITORIAL_RULES}`;

const REELS_GOAL_BRIEF: Record<ReelsInput["goal"], string> = {
  educar: "educar: explicar o tema em passos curtos e pedir para salvar ou compartilhar",
  engajar: "engajar: provocar uma resposta e pedir que comentem a dúvida",
  converter: "converter: convidar a comentar UMA palavra-chave para receber um material educativo no direct",
};

export type ReelOptionWithCrivo = ReelOption & { crivo: CrivoSummary };

export async function generateReels(input: ReelsInput, profile: DoctorProfile) {
  const result = await withFallback(
    "Roteiros",
    async () => {
      const { data, usage } = await askClaudeStructured({
        schema: ReelsOutputSchema,
        system: REELS_SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              `Tema: ${input.topic}`,
              `Objetivo: ${REELS_GOAL_BRIEF[input.goal]}.`,
              `Duração: cerca de ${input.duration} segundos.`,
              input.mode === "gravar"
                ? "Formato: o profissional grava falando para a câmera."
                : "Formato: motion graphics com locução, sem o profissional aparecer.",
              input.context ? `Contexto (use só o que está aqui):
${input.context}` : null,
              describeProfessional(profile),
            ]
              .filter(Boolean)
              .join("\n"),
          },
        ],
      });
      return { data: normalizeReels(data), usage };
    },
    () => heuristicReels(input),
  );
  const footer = identificationLine(profile);
  const options: ReelOptionWithCrivo[] = result.data.options.map((o) => ({
    ...o,
    crivo: summarize(crivo(`${reelText(o)}\n\n${footer}`, profile)),
  }));
  return { ...result, data: { options, footer } };
}

/* -------------------------------- Assistente ------------------------------- */

const ASSISTANT_SYSTEM = `Você é o assistente do MedCrivo, estúdio de conteúdo para médicos, dentistas e estudantes de medicina no Instagram.
Você ajuda com pautas, carrosséis, stories, reels, legendas, bio e dúvidas sobre as normas de publicidade do CFM e do CFO.

Como responder:
- Direto e curto, em português do Brasil. Listas quando ajudarem.
- Quando o pedido se resolve numa ferramenta do estúdio, preencha action: carrossel (post de slides), stories (sequência), ideias (pautas) ou crivo (revisar um texto). Caso contrário, action = null.
- Normas: explique o que diz a regra e recomende passar o texto no Crivo. Não dê parecer jurídico.
- Saúde: conteúdo educativo; não faça diagnóstico nem prescrição para casos individuais.
- Se não souber, diga que não sabe.

${EDITORIAL_RULES}`;

export async function replyAssistant(history: ChatMessage[], profile: DoctorProfile) {
  const recent = history.slice(-MAX_HISTORY);
  // A API exige que a conversa comece pelo usuário.
  const firstUser = recent.findIndex((m) => m.role === "user");
  const messages = firstUser > 0 ? recent.slice(firstUser) : recent;
  const last = messages[messages.length - 1]?.content ?? "";
  const result = await withFallback(
    "Assistente",
    () =>
      askClaudeStructured({
        schema: AssistantReplySchema,
        system: `${ASSISTANT_SYSTEM}\n\n${describeProfessional(profile)}`,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        maxTokens: 4000,
      }),
    () => heuristicReply(last),
  );
  const turn: AssistantTurn = {
    ...result.data,
    suggestions: result.data.suggestions.slice(0, 3),
    crivo: summarize(crivo(result.data.reply, profile, { requireIdentification: false })),
  };
  return { ...result, data: turn };
}
