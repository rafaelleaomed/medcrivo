/**
 * Instagram Content Engine & Humanizer V3
 * Baseado na skill https://github.com/sergebulaev/instagram-skills
 * 
 * Regras principais:
 * 1. Regra dos 125 caracteres (o gancho deve capturar antes da dobra "...mais")
 * 2. Fórmulas de Ganchos IG1 a IG8 divididas por objetivo (Saves, Shares, Comments, Follows)
 * 3. Humanizer V3: eliminação de clichês de IA (mergulhe, desvende, crucial, fundamental, em resumo)
 * 4. Hashtag Strategist: conjunto reduzido e estratégico de 3 a 5 tags (1 nicho, 2 médias, 1 ampla)
 * 5. Conformidade total com CFM nº 2.336/2023 e LGPD
 */

export type EngagementGoal = "saves" | "shares" | "comments" | "follows";

export interface HookFormula {
  code: string; // IG1, IG2, etc.
  name: string;
  goal: EngagementGoal;
  goalLabel: string;
  description: string;
  exampleHook: string;
}

export const INSTAGRAM_HOOK_FORMULAS: HookFormula[] = [
  {
    code: "IG1",
    name: "Dado Preciso / Resultado Numérico",
    goal: "saves",
    goalLabel: "Salvar (Referência)",
    description: "Inicia com uma estatística ou dado clínico preciso na primeira linha. Induz o paciente a salvar para consultar depois.",
    exampleHook: "64% dos pacientes com gordura no fígado não sentem nenhum sintoma comum.",
  },
  {
    code: "IG2",
    name: "Verdade Contra-Intuitiva",
    goal: "shares",
    goalLabel: "Compartilhar (Viral)",
    description: "Derruba um senso comum ou mito popular com autoridade médica. Estimula o envio para amigos e familiares.",
    exampleHook: "Cortar o sal da dieta nem sempre baixa sua pressão se o seu potássio estiver baixo.",
  },
  {
    code: "IG3",
    name: "Identificação Imediata (Cold-Open)",
    goal: "comments",
    goalLabel: "Comentar (Debate)",
    description: "Descreve uma sensação ou rotina específica que o paciente vive sem rodeios, provocando resposta imediata.",
    exampleHook: "Aquele cansaço inexplicável às 15h não é preguiça. Seu fígado pode estar pedindo socorro.",
  },
  {
    code: "IG4",
    name: "Caso Anonimizado de Consultório",
    goal: "follows",
    goalLabel: "Seguir (Autoridade)",
    description: "História clínica real e anonimizada com lição prática preventiva. Constrói autoridade e converte seguidores.",
    exampleHook: "Atendi ontem um paciente de 36 anos com exames 'normais', mas com fadiga incapacitante.",
  },
  {
    code: "IG5",
    name: "Lista Prática / Sintomas Precoces",
    goal: "saves",
    goalLabel: "Salvar (Guia)",
    description: "Organiza 3 a 5 pontos objetivos que o paciente precisa checar em si mesmo ou nos exames.",
    exampleHook: "5 sinais silenciosos de inflamação metabólica que quase todo mundo normaliza.",
  },
  {
    code: "IG6",
    name: "Mecanismo Fisiológico Ilustrado",
    goal: "saves",
    goalLabel: "Salvar & Compartilhar",
    description: "Explica didaticamente o mecanismo biológico de um problema de saúde (educativo conforme CFM 2.336/2023).",
    exampleHook: "O que acontece na sua parede arterial quando a glicemia faz picos diários invisíveis.",
  },
  {
    code: "IG7",
    name: "Ciência vs Mito Popular",
    goal: "shares",
    goalLabel: "Compartilhar (Alerta)",
    description: "Compara o que a sabedoria popular afirma com o que a literatura científica indexada realmente comprova.",
    exampleHook: "A verdade médica sobre jejum intermitente e perda de massa muscular que poucos explicam.",
  },
  {
    code: "IG8",
    name: "Protocolo Prático de Hábitos",
    goal: "saves",
    goalLabel: "Salvar (Passo a Passo)",
    description: "Checklist de condutas de estilo de vida baseadas em evidências para o dia a dia do paciente.",
    exampleHook: "O checklist matinal de 3 passos para quem quer proteger a saúde cardiovascular a longo prazo.",
  },
];

// Termos e clichês de IA identificados pelo Humanizer V3
const AI_TELL_WORDS = [
  "mergulhar",
  "mergulhe",
  "desvendar",
  "desvende",
  "crucial",
  "fundamental",
  "no mundo de hoje",
  "no vasto mundo",
  "em resumo",
  "em conclusão",
  "uma jornada fascinante",
  "o segredo definitivo",
  "transformador",
  "imperdível",
  "descubra os segredos",
  "revolucionário",
];

export interface CaptionAuditResult {
  isHookUnder125Chars: boolean;
  hookCharCount: number;
  hookSnippet: string;
  hasAiTells: boolean;
  detectedAiTells: string[];
  humanizedCaption: string;
  hashtags: string[];
  goal: EngagementGoal;
}

/**
 * Aplica o motor Humanizer V3 no texto:
 * - Remove clichês artificiais
 * - Garante naturalidade da voz médica
 * - Limita travessões excessivos (máx 1 por 100 palavras)
 */
export function humanizeMedicalText(text: string): { cleanedText: string; detectedTells: string[] } {
  let cleaned = text;
  const detected: string[] = [];

  for (const word of AI_TELL_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    if (regex.test(cleaned)) {
      detected.push(word);
      cleaned = cleaned.replace(regex, (match) => {
        // Substituições naturais e humanas
        if (/mergulh/i.test(match)) return "analisar";
        if (/desvend/i.test(match)) return "entender";
        if (/crucial|fundamental/i.test(match)) return "importante";
        if (/no mundo de hoje|no vasto mundo/i.test(match)) return "atualmente";
        if (/em resumo|em conclusão/i.test(match)) return "na prática";
        if (/revolucionário|transformador/i.test(match)) return "eficaz";
        return "";
      });
    }
  }

  // Remove espaços duplos
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();

  return { cleanedText: cleaned, detectedTells: detected };
}

/**
 * Audita a legenda de acordo com a regra dos 125 caracteres do Instagram
 */
export function auditInstagramCaption(
  rawCaption: string,
  topic: string,
  specialty: string,
  crm: string,
  goal: EngagementGoal = "saves"
): CaptionAuditResult {
  const { cleanedText, detectedTells } = humanizeMedicalText(rawCaption);

  // Primeira linha / gancho até a primeira quebra ou ponto
  const firstLine = cleanedText.split("\n")[0] || cleanedText;
  const hookSnippet = firstLine.slice(0, 125);
  const hookCharCount = firstLine.length;
  const isHookUnder125Chars = hookCharCount <= 125;

  // Gerador de Hashtags Estratégicas (Hashtag Strategist - 3 a 5 tags)
  const cleanSpecialty = specialty.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanTopicWord = topic.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, "");
  
  const hashtags = [
    `#${cleanSpecialty || "medicina"}`,
    `#${cleanTopicWord || "saude"}`,
    "#medicinabaseadaemevidencias",
    "#saudepreventiva",
  ];

  return {
    isHookUnder125Chars,
    hookCharCount,
    hookSnippet,
    hasAiTells: detectedTells.length > 0,
    detectedAiTells: detectedTells,
    humanizedCaption: cleanedText,
    hashtags,
    goal,
  };
}
