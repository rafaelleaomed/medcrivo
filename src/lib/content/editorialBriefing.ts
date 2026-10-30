import { z } from "zod";

export const EditorialBriefingSchema = z.object({
  title: z.string().trim().min(3).max(500),
  hook: z.string().trim().min(3).max(500),
  angle: z.string().trim().min(3).max(700),
  whyNow: z.string().trim().min(3).max(700),
  format: z.enum(["carrossel", "reel", "stories", "post"]),
  goal: z.enum(["educar", "engajar", "converter", "autoridade"]),
  source: z.enum(["google_trends", "perfil"]),
  trendTitle: z.string().trim().max(300).optional(),
  score: z.number().int().min(0).max(100),
});
export type EditorialBriefing = z.infer<typeof EditorialBriefingSchema>;

export type CarouselTone = "didatico" | "academico" | "consultorio";

export type CarouselGenerationInput = {
  topic: string;
  sourceContext?: string;
  editorialBriefing?: EditorialBriefing;
  tone: CarouselTone;
  slideCount: number;
};

type NarrativeSlide = {
  template: "capa_noticia" | "conteudo" | "passo" | "frase" | "lista" | "cta";
  kicker: string;
  headline: string;
  highlight: string[];
  body: string;
  items: string[];
  imagePrompt: string;
};

type NarrativePost = {
  framework: "mito_desfeito" | "sintoma_silencioso" | "erro_comum" | "checklist" | "caso_anonimizado" | "norma_pode_nao_pode" | "passo_a_passo";
  angle: string;
  slides: NarrativeSlide[];
  caption: string;
  cta: {
    action?: "comment" | "save" | "share" | "follow" | "none";
    keyword: string;
    promise: string;
    leadMagnetTitle: string;
    leadMagnetOutline: string[];
    dmMessage: string;
  };
  evidenceQuery: string;
};

export function buildCarouselJobInput(
  topicOrBriefing: string | EditorialBriefing,
  tone: CarouselTone,
  slideCount = 9,
): CarouselGenerationInput {
  if (typeof topicOrBriefing === "string") {
    return { topic: topicOrBriefing.trim(), tone, slideCount };
  }
  const briefing = EditorialBriefingSchema.parse(topicOrBriefing);
  return {
    topic: briefing.title,
    editorialBriefing: briefing,
    tone,
    slideCount,
  };
}

function words(text: string, limit: number): string {
  const parts = text.replace(/\s+/g, " ").trim().split(" ");
  return parts.length <= limit ? parts.join(" ") : `${parts.slice(0, limit).join(" ")}…`;
}

function cleanSentence(text: string): string {
  return text.replace(/^["“”']+|["“”']+$/g, "").trim();
}

function angleAsCopy(angle: string): string {
  const clean = cleanSentence(angle)
    .replace(/^mostrar como\s+/i, "A pauta mostra como ")
    .replace(/^mostrar\s+/i, "A pauta aborda ")
    .replace(/^explicar como\s+/i, "A pauta explica como ")
    .replace(/^contrastar\s+/i, "A pauta contrasta ")
    .replace(/^separar\s+/i, "A pauta separa ")
    .replace(/^organizar\s+/i, "A pauta organiza ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function focusFromTitle(title: string): string {
  const afterColon = title.split(":").at(-1)?.trim() || title.trim();
  return words(afterColon, 7).replace(/[.!?…]+$/g, "");
}

function fallbackBriefing(input: CarouselGenerationInput): EditorialBriefing {
  return {
    title: input.topic,
    hook: `Uma dúvida concreta sobre ${focusFromTitle(input.topic)} merece uma resposta sem atalhos.`,
    angle: `Separar o que a pessoa percebe, o que ainda precisa ser investigado e como chegar mais preparada à consulta.`,
    whyNow: "A dúvida apareceu entre os temas recentes do público.",
    format: "carrossel",
    goal: "educar",
    source: "perfil",
    score: 60,
  };
}

function slide(
  template: NarrativeSlide["template"],
  kicker: string,
  headline: string,
  body = "",
  items: string[] = [],
  imagePrompt = "",
): NarrativeSlide {
  return { template, kicker, headline, highlight: [], body, items, imagePrompt };
}

/**
 * Reserva editorial sem alegações clínicas inventadas. Ela usa o briefing inteiro,
 * muda a progressão conforme a origem/objetivo e deixa a apuração médica explícita.
 */
export function buildHeuristicNarrative(
  input: CarouselGenerationInput,
  profile: { specialty?: string },
): NarrativePost {
  const briefing = input.editorialBriefing ?? fallbackBriefing(input);
  const focus = focusFromTitle(briefing.title);
  const hook = words(cleanSentence(briefing.hook), 14);
  const angleCopy = angleAsCopy(briefing.angle);
  const specialty = profile.specialty?.trim() || "saúde";
  const trendDriven = briefing.source === "google_trends";
  const fearOrExam = /medo|ansiedad|exame|diagn[oó]stic|procedimento/i.test(`${briefing.title} ${briefing.hook} ${briefing.angle}`);
  const profileFrameworks: NarrativePost["framework"][] = ["erro_comum", "checklist", "passo_a_passo", "sintoma_silencioso"];
  const framework: NarrativePost["framework"] = trendDriven
    ? "mito_desfeito"
    : profileFrameworks[[...briefing.title].reduce((sum, char) => sum + char.charCodeAt(0), 0) % profileFrameworks.length];

  const commonStart = [
    slide(
      "capa_noticia",
      trendDriven ? "ASSUNTO EM ALTA" : specialty.toUpperCase(),
      hook,
      words(briefing.whyNow, 28),
      [],
      `editorial healthcare concept about ${focus}, Brazilian context, natural light, no text, no identifiable patient`,
    ),
  ];

  const trendSequence: NarrativeSlide[] = [
    slide("conteudo", "POR QUE AGORA", "O assunto cresceu. A explicação precisa acompanhar.", words(briefing.whyNow, 34)),
    slide("conteudo", "O RECORTE", `A pergunta útil não é tão ampla quanto “${focus}”`, words(briefing.angle, 38)),
    slide("lista", "SEPARE AS CAMADAS", "Antes de concluir, diferencie três coisas", "", ["O que a pessoa percebe", "O que pode ter mais de uma explicação", "O que depende de avaliação profissional"]),
    slide("conteudo", "SEM ATALHO", "Popularidade não transforma hipótese em diagnóstico", "Um tema em alta pode abrir uma boa conversa. Ele não substitui história clínica, exame e contexto individual."),
    slide("conteudo", "CONFIRA A FONTE", "A manchete chama atenção. A origem define quanto ela vale.", "Procure saber se a informação veio de orientação oficial, estudo revisado ou apenas repetição nas redes."),
    slide("passo", "PRÓXIMO PASSO", "Leve uma pergunta melhor para a consulta", `Anote quando a situação começou, o que mudou e qual é a dúvida central sobre ${focus}.`),
    slide("conteudo", "NA PRÁTICA", "A mesma informação pode ter pesos diferentes em pessoas diferentes", "Idade, histórico, sintomas e outros achados mudam a interpretação. Conteúdo geral não fecha essa conta."),
    slide("frase", "", "Boa informação reduz ruído. A avaliação é que define o caminho.", ""),
  ];

  const fearSequence: NarrativeSlide[] = [
    slide("conteudo", "A CENA REAL", "Duas pessoas podem chegar com o mesmo medo e precisar de conversas diferentes", words(angleCopy, 38)),
    slide("lista", "COMO ISSO APARECE", "Observe a reação antes de tentar tranquilizar", "", ["Evitar marcar ou adiar o exame", "Buscar garantias que ninguém pode dar", "Chegar à consulta sem conseguir formular a principal dúvida"]),
    slide("conteudo", "O ERRO", "Responder rápido demais pode aumentar a insegurança", "Dizer apenas que vai ficar tudo bem não esclarece o que será investigado nem quais são os próximos passos."),
    slide("passo", "NA CONVERSA", "Primeiro, descubra qual parte assusta", `O receio pode estar no procedimento, no resultado ou no que acontece depois. Essa diferença muda a orientação.`),
    slide("passo", "ANTES DO EXAME", "Transforme medo difuso em perguntas concretas", `O que o exame procura? Como ele é feito? Quando o resultado sai? Quem explica o que vier depois?`),
    slide("conteudo", "DEPOIS DO RESULTADO", "Combine quem vai explicar e qual será o próximo passo", "A espera pesa menos quando a pessoa sabe quando receberá o resultado e com quem poderá conversar sobre ele."),
    slide("conteudo", "O LIMITE", "Nenhum post consegue antecipar o resultado de um exame", "O papel do conteúdo é organizar a conversa, não prometer tranquilidade nem substituir a avaliação do caso."),
    slide("frase", "", "Entender o próximo passo não elimina toda a ansiedade, mas devolve algum controle.", ""),
  ];

  const generalSequence: NarrativeSlide[] = [
    slide("conteudo", "O RECORTE", "A pauta fica útil quando a pergunta ganha contorno", words(angleCopy, 38)),
    slide("conteudo", "POR QUE AGORA", "O contexto explica por que esta conversa voltou", `Este é o sinal de atualidade: ${words(briefing.whyNow, 30)}`),
    slide("lista", "ANTES DE CONCLUIR", `Organize o que já se sabe sobre ${focus}`, "", ["O que mudou e quando", "O que já foi tentado ou revisto", "Qual dúvida ainda precisa de resposta profissional"]),
    slide("conteudo", "O RISCO DO ATALHO", "Uma lista solta não resolve uma decisão individual", "O conteúdo pode ajudar a preparar a conversa. Mudanças de tratamento ou conduta dependem do contexto clínico."),
    slide("passo", "NA PRÁTICA", "Leve a informação de forma organizada", `Use este recorte na conversa: ${words(angleCopy, 28)}`),
    slide("passo", "PERGUNTA ÚTIL", `Pergunte o que precisa ser revisto antes de decidir sobre ${focus}`, "Peça que o profissional explique opções, limites e sinais que mudariam a conduta."),
    slide("conteudo", "O LIMITE", "Informação geral não substitui uma revisão do caso", "Histórico, exames, outros tratamentos e prioridades pessoais podem mudar a orientação."),
    slide("frase", "", "Uma boa decisão começa com uma pergunta bem organizada.", ""),
  ];

  const closing = slide(
    "cta",
    briefing.goal === "engajar" ? "PARA COMPARTILHAR" : "PARA SALVAR",
    trendDriven
      ? "Guarde estas perguntas para separar atenção de alarme"
      : fearOrExam
        ? "Salve para organizar a conversa antes do próximo exame"
        : `Salve para organizar a próxima conversa sobre ${focus}`,
    "Conteúdo educativo. Dúvidas individuais precisam de avaliação profissional.",
  );

  const slides = [...commonStart, ...(trendDriven ? trendSequence : fearOrExam ? fearSequence : generalSequence), closing].slice(0, input.slideCount);
  if (slides.at(-1)?.template !== "cta") slides[slides.length - 1] = closing;

  const keyword = trendDriven ? "CONTEXTO" : "PERGUNTAS";
  const action: NarrativePost["cta"]["action"] = briefing.goal === "engajar"
    ? "share"
    : briefing.goal === "converter"
      ? "comment"
      : briefing.goal === "autoridade"
        ? "follow"
        : "save";
  const actionPromise = action === "share"
    ? "Compartilhe com alguém que esteja tentando separar informação de alarme."
    : action === "follow"
      ? "Acompanhe para ver outros recortes clínicos explicados sem atalhos."
      : action === "comment"
        ? "um roteiro de perguntas para levar à consulta"
        : "Salve para usar estas perguntas antes da próxima consulta.";
  return {
    framework,
    angle: briefing.angle,
    slides,
    caption: `${words(briefing.hook, 22)} Neste carrossel, o foco é organizar a dúvida sem transformar conteúdo em diagnóstico.`,
    cta: {
      action,
      keyword,
      promise: actionPromise,
      leadMagnetTitle: `Perguntas sobre ${focus}`,
      leadMagnetOutline: ["O que observar", "O que anotar", "O que perguntar", "Quando procurar avaliação"],
      dmMessage: `Aqui está o roteiro de perguntas sobre ${focus}. Use como apoio para conversar com um profissional que conheça seu caso.`,
    },
    evidenceQuery: `${focus} clinical review patient communication`,
  };
}

function normalized(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function narrativeQualityIssues(post: NarrativePost, topic: string): string[] {
  const issues: string[] = [];
  const normalizedTopic = normalized(topic);
  const headlines = post.slides.map((item) => normalized(item.headline)).filter(Boolean);
  const bodies = post.slides.map((item) => normalized(item.body)).filter(Boolean);

  if (headlines.some((headline) => headline === normalizedTopic)) {
    issues.push("A capa ou outro slide copia literalmente a pauta.");
  }
  if (new Set(headlines).size !== headlines.length || new Set(bodies).size !== bodies.length) {
    issues.push("Há títulos ou textos repetidos entre os slides.");
  }
  const genericPattern = /o que pouca gente entende|por que isso importa|este tema afeta mais pessoas|o erro mais comum|fique atento a/i;
  if (post.slides.some((item) => genericPattern.test(`${item.headline} ${item.body}`))) {
    issues.push("O roteiro ainda usa um padrão genérico de reserva.");
  }
  if (post.slides.length < 7) issues.push("O roteiro não tem slides suficientes para desenvolver a narrativa.");
  return issues;
}
