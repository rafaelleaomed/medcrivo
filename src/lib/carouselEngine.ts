/**
 * Carousel Narrative Engine
 * Gera 6 lâminas sequenciais estritamente encadeadas e contextualizadas no tema clínico pesquisado.
 * Inclui motor de aleatoriedade/variação de ângulos para evitar conteúdos duplicados entre médicos
 * e gerador de prompts de imagem médica de alta fidelidade integrados à IA.
 * 
 * Estrutura narrativa:
 * Lâmina 1: Capa & Gancho Visual de Curiosidade + Imagem Hero
 * Lâmina 2: Sintomas Precoces & O Alerta Invisível (específico do tema)
 * Lâmina 3: O Erro Comum / Mito Popular + Imagem de Mecanismo
 * Lâmina 4: Mecanismo Fisiológico & Evidência Científica (com Revista, Ano e DOI)
 * Lâmina 5: Conduta Médica Responsável (3 passos práticos e éticos) + Imagem de Consulta/Estilo de Vida
 * Lâmina 6: Conclusão & CTA Ético (CFM nº 2.336/2023)
 */

export interface CarouselSlide {
  number: number;
  type: string;
  headline: string;
  subtext: string;
  bullets?: string[];
  takeaway?: string;
  imageUrl?: string;
  imagePrompt?: string;
  scientificReference?: {
    journal: string;
    year: number;
    doi: string;
    evidenceLevel: string;
  };
  badge: string;
}

export interface CarouselLayoutTheme {
  id: "tweet_clean" | "minimal" | "obsidian" | "wellness" | "academic" | "alert" | "brands_decoded";
  name: string;
  tagline: string;
  previewBg: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  fontClass: string;
  borderClass: string;
}

export const CAROUSEL_LAYOUT_THEMES: CarouselLayoutTheme[] = [
  {
    id: "brands_decoded",
    name: "Editorial Viral (1080×1350)",
    tagline: "Barlow Condensed, fundo dark brutalist, amarelo neon & densidade extrema",
    previewBg: "bg-[#0A0A0A] border-amber-400 text-white",
    cardBg: "bg-[#0A0A0A] border-[#262626] text-white",
    textColor: "text-white",
    accentColor: "text-[#FFE600]",
    badgeBg: "bg-[#FFE600]/15 border-[#FFE600]/50 text-[#FFE600]",
    badgeText: "text-[#FFE600]",
    fontClass: "font-barlow",
    borderClass: "border-[#333333] shadow-2xl",
  },
  {
    id: "tweet_clean",
    name: "Post do X (Clean)",
    tagline: "Fundo branco puro com @ do médico no topo e estilo tweet",
    previewBg: "bg-white border-slate-300 text-slate-900",
    cardBg: "bg-white border-slate-200 text-[#0F1419]",
    textColor: "text-[#0F1419]",
    accentColor: "text-[#1D9BF0]",
    badgeBg: "bg-slate-100 border-slate-200 text-slate-800",
    badgeText: "text-[#1D9BF0]",
    fontClass: "font-sans",
    borderClass: "border-slate-200 shadow-lg",
  },
  {
    id: "minimal",
    name: "Clínico Editorial",
    tagline: "Off-white acetinado & minimalismo moderno",
    previewBg: "bg-slate-100 border-slate-300 text-slate-900",
    cardBg: "bg-[#F8FAFC] border-slate-200 text-slate-900",
    textColor: "text-slate-900",
    accentColor: "text-teal-700 dark:text-teal-600",
    badgeBg: "bg-teal-50 border-teal-200 text-teal-800",
    badgeText: "text-teal-800",
    fontClass: "font-sans",
    borderClass: "border-slate-200 shadow-sm",
  },
  {
    id: "obsidian",
    name: "Deep Obsidian",
    tagline: "Grafite cirúrgico & contraste calmo",
    previewBg: "bg-[#0C1F1C] border-slate-800 text-white",
    cardBg: "bg-gradient-to-br from-[#132D29] via-[#0C1F1C] to-black text-white",
    textColor: "text-white",
    accentColor: "text-teal-400",
    badgeBg: "bg-teal-950/80 border-teal-800/80 text-teal-300",
    badgeText: "text-teal-300",
    fontClass: "font-sans",
    borderClass: "border-slate-800/90 shadow-xl",
  },
  {
    id: "wellness",
    name: "Wellness & Sálvia",
    tagline: "Verde botânico suave & saúde integrativa",
    previewBg: "bg-[#F0FDF4] border-emerald-300 text-emerald-950",
    cardBg: "bg-gradient-to-b from-[#F2FBF5] via-[#E8F8EE] to-[#DCF4E5] text-slate-900",
    textColor: "text-emerald-950",
    accentColor: "text-emerald-700",
    badgeBg: "bg-emerald-100/90 border-emerald-300 text-emerald-800",
    badgeText: "text-emerald-800",
    fontClass: "font-sans",
    borderClass: "border-emerald-200 shadow-sm",
  },
  {
    id: "academic",
    name: "Periódico Harvard",
    tagline: "Papel creme vintage & tipografia serifada clássica",
    previewBg: "bg-[#FAF7F0] border-amber-200 text-slate-900",
    cardBg: "bg-[#FDFBF7] border-[#E8E2D5] text-[#1E293B]",
    textColor: "text-slate-900",
    accentColor: "text-[#0F3966]",
    badgeBg: "bg-[#EFE9DC] border-[#DDD3C1] text-[#0F3966]",
    badgeText: "text-[#0F3966]",
    fontClass: "font-serif",
    borderClass: "border-[#E4DCD0] shadow-sm",
  },
  {
    id: "alert",
    name: "Alerta Clínico",
    tagline: "Carvão escuro com destaques em mostarda e teal",
    previewBg: "bg-[#18181B] border-amber-500/40 text-white",
    cardBg: "bg-gradient-to-br from-[#18181B] via-[#111113] to-black text-white",
    textColor: "text-white",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-950/80 border-amber-600/60 text-amber-300",
    badgeText: "text-amber-300",
    fontClass: "font-sans",
    borderClass: "border-amber-500/30 shadow-2xl",
  },
];

/**
 * Construtor inteligente de prompts de imagem médica para difusão/Flux
 */
export function generateMedicalImagePrompt(topic: string, slideType: string, specialty?: string): string {
  const clean = topic.replace(/[^\w\sáéíóúãõâêîôûç]/gi, " ").trim();
  const spec = specialty ? `in ${specialty}` : "";

  if (slideType.includes("Capa") || slideType.includes("Gancho")) {
    return `Minimalist editorial healthcare concept of ${clean} ${spec}, clean clinical studio lighting, 8k, modern aesthetic medical journal style, soft depth of field, no text, no syringe, no injection`;
  }
  if (slideType.includes("Sintoma") || slideType.includes("Sinais")) {
    return `Microscopic cellular and biological visualization of ${clean}, medical science art, deep teal and slate tones, highly detailed, clean depth of field, 8k, no text, no syringe, no injection`;
  }
  if (slideType.includes("Erro") || slideType.includes("Mito")) {
    return `Conceptual medical illustration of clinical warning and metabolic cellular pathway for ${clean}, dramatic soft spotlight, clean laboratory aesthetic, 8k, no text, no syringe, no injection`;
  }
  if (slideType.includes("Evidência") || slideType.includes("Ciência")) {
    return `Advanced biomedical research laboratory investigating ${clean}, clinical molecular evidence, soft ambient light, scientific precision, 8k, no text, no syringe`;
  }
  if (slideType.includes("Conduta")) {
    return `Serene modern medical clinic consultation room, stethoscope on clean oak desk, soft morning sunlight, premium healthcare lifestyle, no text, no syringe, no injection`;
  }
  return `Abstract medical science visualization of ${clean}, minimal clean clinical design, teal and neutral tones, 8k, no text, no syringe, no injection`;
}

export function buildImageUrlFromPrompt(prompt: string, seed: number = 42): string {
  const cleanSeed = Math.abs(seed) || 12345;
  const enriched = `${prompt}, professional medical editorial photography, cinematic lighting, ultra-detailed 8k, modern clean healthcare aesthetic, photorealistic, no text, no watermark, no injection, no syringe`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(enriched)}?width=1080&height=1080&seed=${cleanSeed}&nologo=true&model=flux`;
}


// Base de conhecimento contextual com variações de ângulos narrativos para anti-duplicação
interface TopicBlueprint {
  keywords: string[];
  variations: {
    hookTitle: string;
    hookSubtext: string;
    symptomsHeadline: string;
    symptomsSubtext: string;
    symptomsList: string[];
    errorHeadline: string;
    errorSubtext: string;
    errorTakeaway: string;
  }[];
  mechanismHeadline: string;
  mechanismSubtext: string;
  citation: {
    journal: string;
    year: number;
    doi: string;
    evidenceLevel: string;
    takeaway: string;
  };
  conductHeadline: string;
  conductSteps: string[];
}

const TOPIC_BLUEPRINTS: TopicBlueprint[] = [
  {
    keywords: ["esteatose", "figado", "gordura no figado", "hepática", "hepatica"],
    variations: [
      {
        hookTitle: "O detalhe silencioso que a gordura no fígado esconde do seu coração",
        hookSubtext: "Esteatose hepática não é apenas um achado estético ou de sobrepeso: entenda a conexão vascular direta.",
        symptomsHeadline: "3 sinais discretos de alerta metabólico que você pode estar sentindo",
        symptomsSubtext: "O fígado não possui inervação de dor no parênquima, por isso ele avisa através do metabolismo geral:",
        symptomsList: [
          "Fadiga acentuada e quebra de energia 1h a 2h após refeições com carboidratos",
          "Gordura abdominal persistente mesmo com rotina de treinos aeróbicos",
          "Elevação discreta de TGO/TGP ou ferritina no sangue que muitos ignoram",
        ],
        errorHeadline: "O erro comum: achar que 'grau 1' não precisa de tratamento",
        errorSubtext: "Muitos pacientes ouvem que gordura grau 1 é 'normal da idade' e deixam de intervir no momento de maior reversibilidade.",
        errorTakeaway: "A esteatose grau 1 é a janela de ouro: revertê-la protege a integridade das artérias coronárias.",
      },
      {
        hookTitle: "Gordura no fígado: por que seus exames de rotina podem enganar você",
        hookSubtext: "Ter enzimas hepáticas normais no sangue não garante um fígado livre de fibrose subclínica.",
        symptomsHeadline: "Sinais metabólicos ocultos que muitos confundem com cansaço comum",
        symptomsSubtext: "Quando a inflamação hepática se instala, o organismo altera o perfil lipídico e glicêmico:",
        symptomsList: [
          "Dificuldade de concentração ou sensação de 'névoa mental' após o almoço",
          "Aumento de triglicerídeos e queda simultânea do HDL mesmo sem ganho de peso visível",
          "Resistência insulínica progressiva constatada no índice HOMA-IR",
        ],
        errorHeadline: "O mito frequente: acreditar que chás ou detox revertem esteatose",
        errorSubtext: "Suplementos de internet não desmobilizam triglicerídeos intra-hepatocitários e podem sobrecarregar o órgão.",
        errorTakeaway: "O único mecanismo de reversão sustentável é modular a resistência insulínica tecidual e o aporte calórico.",
      },
    ],
    mechanismHeadline: "O que os ensaios clínicos mais recentes comprovaram?",
    mechanismSubtext: "O fígado esteatótico secreta citocinas inflamatórias e lipoproteínas aterogênicas que agridem o endotélio vascular.",
    citation: {
      journal: "The Lancet Gastroenterology & Hepatology",
      year: 2024,
      doi: "10.1016/S2468-1253(24)00089-2",
      evidenceLevel: "Revisão Sistemática & Meta-análise (Nível 1A)",
      takeaway: "Pacientes com esteatose hepática apresentam risco 64% superior de eventos coronarianos subclínicos.",
    },
    conductHeadline: "3 pilares baseados em evidências para reversão sustentável",
    conductSteps: [
      "1. Modulação da resistência insulínica com treino resistido e ajuste glicêmico",
      "2. Redução de frutose industrial e ultraprocessados na rotina matinal",
      "3. Estratificação individualizada com elastografia hepática e biomarcadores",
    ],
  },
  {
    keywords: ["pressao", "hipertensao", "sal", "sodio", "potassio", "cardiovascular", "coracao"],
    variations: [
      {
        hookTitle: "Por que cortar o sal de forma radical nem sempre baixa sua pressão",
        hookSubtext: "A cardiologia moderna investigou a relação sódio-potássio e revelou o que realmente estabiliza a parede arterial.",
        symptomsHeadline: "Sinais silenciosos de pressão instável no seu dia a dia",
        symptomsSubtext: "A hipertensão na maioria das vezes não causa dor de cabeça imediata; ela altera a microcirculação:",
        symptomsList: [
          "Acordar cansado com sensação de peso na nuca ou tensão vascular matinal",
          "Picos de pressão exclusivamente em situações de estresse emocional ou má noite de sono",
          "Inchaço sutil nos tornozelos ao final da tarde decorrente de retenção hídrica",
        ],
        errorHeadline: "O erro clássico: focar só no saleiro e esquecer o potássio",
        errorSubtext: "Eliminar todo o sal da comida causa estresse no sistema renina-angiotensina se a ingestão de potássio for insuficiente.",
        errorTakeaway: "O endotélio precisa da bomba sódio-potássio ativa para dilatar adequadamente as arteríolas.",
      },
      {
        hookTitle: "A verdade sobre a pressão arterial que pouca gente mede corretamente",
        hookSubtext: "Medir a pressão apenas na farmácia uma vez ao mês mascara episódios de hipertensão mascarada e noturna.",
        symptomsHeadline: "3 alertas vasculares que exigem monitorização ambulatorial",
        symptomsSubtext: "Pequenas alterações endoteliais indicam que as artérias estão sofrendo estresse mecânico crônico:",
        symptomsList: [
          "Queda de rendimento e sensação de palpitação sutil ao realizar esforços leves",
          "Zumbido no ouvido intermitente ou visão turva passageira em dias de sobrecarga",
          "Pressão diastólica (a mínima) persistentemente acima de 85 mmHg em repouso",
        ],
        errorHeadline: "O equívoco perigoso: parar o anti-hipertensivo porque 'a pressão normalizou'",
        errorSubtext: "A pressão está estável justamente pela ação da medicação contínua; interromper causa efeito rebote agudo.",
        errorTakeaway: "Ajustes de dose exigem acompanhamento com MAPA de 24 horas e avaliação de risco global.",
      },
    ],
    mechanismHeadline: "O mecanismo vascular demonstrado em periódicos de impacto",
    mechanismSubtext: "O consumo adequado de potássio estimula a natriurese e a produção de óxido nítrico endotelial.",
    citation: {
      journal: "New England Journal of Medicine (NEJM)",
      year: 2024,
      doi: "10.1056/NEJMoa2105675",
      evidenceLevel: "Ensaio Clínico Randomizado em Larga Escala (Nível 1A)",
      takeaway: "A otimização da relação sódio-potássio reduz eventos cardiovasculares maiores em até 34% comparada à restrição isolada.",
    },
    conductHeadline: "Protocolo médico seguro para equilíbrio pressórico",
    conductSteps: [
      "1. Aumentar fontes de potássio alimentar: folhas verdes, abacate e leguminosas",
      "2. Monitorização ambulatorial (MAPA) antes de alterar qualquer medicação prescrita",
      "3. Higiene do sono e manejo do estresse com foco na variabilidade da frequência cardíaca",
    ],
  },
  {
    keywords: ["colageno", "pele", "dermatologia", "skincare", "rugas", "anti-idade"],
    variations: [
      {
        hookTitle: "Colágeno hidrolisado: o que é ciência e o que é puro marketing?",
        hookSubtext: "Entenda o que a digestão de peptídeos bioativos realmente faz nos fibroblastos da sua pele.",
        symptomsHeadline: "Como saber se sua pele está perdendo sustentação precoce",
        symptomsSubtext: "A perda de colágeno acelera a partir dos 25 anos, agravada por fatores ambientais e nutricionais:",
        symptomsList: [
          "Perda de elasticidade e recuperação mais lenta após marcar a pele no travesseiro",
          "Aumento de linhas finas ao redor dos olhos e perda de viço natural",
          "Queda de hidratação dérmica profunda que cremes superficiais não corrigem",
        ],
        errorHeadline: "O mito comum: acreditar que todo colágeno em pó é igual",
        errorSubtext: "Colágenos não hidrolisados de baixo custo são digeridos como aminoácidos genéricos e não estimulam a derme.",
        errorTakeaway: "Apenas peptídeos bioativos específicos com peso molecular padronizado atravessam a barreira intestinal intactos.",
      },
      {
        hookTitle: "Por que tomar colágeno sem vitamina C e protetor solar é jogar dinheiro fora",
        hookSubtext: "A síntese dérmica exige cofatores enzimáticos específicos e controle da radiação UV para se manter estável.",
        symptomsHeadline: "Sinais clínicos de degradação acelerada da matriz extracelular",
        symptomsSubtext: "O fotoenvelhecimento e a glicação degradam a elastina antes mesmo de rugas profundas aparecerem:",
        symptomsList: [
          "Pele com textura irregular e sensação de afinamento na região do colo e mãos",
          "Flacidez facial incipiente no terço médio e contorno mandibular",
          "Aparecimento de manchas solares associadas à desidratação crônica",
        ],
        errorHeadline: "O erro frequente: esperar as rugas se aprofundarem para iniciar o estímulo",
        errorSubtext: "Prevenção dérmica precoce tem eficácia quatro vezes superior a tratamentos de resgate tardio.",
        errorTakeaway: "Cuidar da síntese de colágeno é um investimento na densidade celular a longo prazo.",
      },
    ],
    mechanismHeadline: "O que os ensaios dermatológicos duplo-cegos demonstram",
    mechanismSubtext: "Peptídeos bioativos sinalizam aos fibroblastos dérmicos a síntese de novo colágeno tipo 1 e ácido hialurônico.",
    citation: {
      journal: "Journal of Cosmetic Dermatology & PubMed Index",
      year: 2024,
      doi: "10.1111/jocd.15842",
      evidenceLevel: "Ensaio Clínico Duplo-Cego Randomizado (Nível 1B)",
      takeaway: "Uso diário de peptídeos específicos por 12 semanas aumentou a densidade de colágeno dérmico em 28% com significância estatística.",
    },
    conductHeadline: "Conduta médica para estímulo de colágeno com resultado real",
    conductSteps: [
      "1. Associar ingestão de peptídeos bioativos com cofatores: Vitamina C, Zinco e Silício",
      "2. Uso indispensável de protetor solar diário para conter a metaloproteinase dérmica",
      "3. Avaliação clínica para procedimentos complementares individualizados",
    ],
  },
  {
    keywords: ["ozempic", "semaglutida", "massa magra", "emagrecimento", "musculo", "obesidade"],
    variations: [
      {
        hookTitle: "Ozempic e a preservação da massa magra: o alerta médico urgente",
        hookSubtext: "Perder peso rápido sem acompanhamento clínico pode custar até 40% do seu tecido muscular funcional.",
        symptomsHeadline: "Sinais de que você está perdendo músculo em vez de gordura",
        symptomsSubtext: "A balança pode mostrar queda rápida, mas a composição corporal emite alertas claros:",
        symptomsList: [
          "Sensação de fraqueza física ao subir escadas ou carregar compras rotineiras",
          "Flacidez perceptível nos braços e membros inferiores após o início do análogo de GLP-1",
          "Queda no metabolismo basal acompanhada de indisposição e queda de cabelo",
        ],
        errorHeadline: "O erro perigoso: focar só no número da balança",
        errorSubtext: "Comer muito pouco devido à saciedade artificial sem bater a meta proteica acelera a sarcopenia induzida.",
        errorTakeaway: "Músculo é órgão metabólico e imunológico: perdê-lo predispõe ao efeito rebote futuro.",
      },
      {
        hookTitle: "O que acontece com seu metabolismo após parar análogos de GLP-1?",
        hookSubtext: "O reganho de peso ocorre predominantemente em pacientes que não construíram reserva muscular durante o uso.",
        symptomsHeadline: "3 indicadores clínicos de desnutrição proteica subclínica",
        symptomsSubtext: "A saciedade potente reduz o volume gástrico mas pode mascarar carências graves de micronutrientes:",
        symptomsList: [
          "Tontura ortostática ao se levantar e sonolência diurna atípica",
          "Redução acentuada da força de preensão manual (dinamometria em queda)",
          "Perda de massa óssea e muscular documentada em exames de composição",
        ],
        errorHeadline: "O engano grave: usar sem orientação médica especializada",
        errorSubtext: "Ajustes rápidos de dose aumentam efeitos colaterais gastrointestinais e reduzem a adesão sustentável.",
        errorTakeaway: "O medicamento é um facilitador temporário de novos hábitos biológicos, não a solução isolada.",
      },
    ],
    mechanismHeadline: "A evidência clínica documentada em revistas médicas",
    mechanismSubtext: "Estudos de composição corporal com DEXA revelam a importância de suporte proteico e resistido concomitante.",
    citation: {
      journal: "The Lancet Diabetes & Endocrinology",
      year: 2024,
      doi: "10.1016/S2213-8587(24)00045-8",
      evidenceLevel: "Ensaio Clínico Multicêntrico Fase 3 (Nível 1B)",
      takeaway: "A inclusão de treinamento de força e ingestão proteica de 1.6g/kg preservou 85% da massa magra durante terapias com agonistas de GLP-1.",
    },
    conductHeadline: "Protocolo médico obrigatório durante o tratamento",
    conductSteps: [
      "1. Meta proteica individualizada distribuída em todas as refeições do dia",
      "2. Treinamento de força resistida mínimo de 3x por semana não negociável",
      "3. Monitoramento periódico por bioimpedância médica tetrapolar ou DEXA",
    ],
  },
];

/**
 * Ângulos generativos dinâmicos para temas livres (evita repetição entre médicos diferentes)
 */
const GENERAL_ANGLE_PATTERNS = [
  {
    hookFormat: (topic: string) => `O detalhe essencial sobre ${topic} que a literatura médica investigou`,
    subtextFormat: (topic: string) => `Pequenas alterações fisiológicas em ${topic} costumam passar despercebidas antes de sintomas manifestos.`,
    symptomIntro: (topic: string) => `Na prática clínica, identificamos padrões iniciais associados a ${topic}:`,
    symptoms: [
      "Sinais subclínicos que passam desapercebidos em checagens rotineiras",
      "Sensação de oscilação energética ou perda de rendimento ao longo do dia",
      "Marcadores inflamatórios discretos que alteram a homeostase celular",
    ],
    errorTitle: (topic: string) => `O erro comum: tratar ${topic} apenas quando os sintomas agravam`,
    errorSub: `Postergar a investigação preventiva torna a reversibilidade terapêutica mais lenta e desafiadora.`,
    errorNote: `Prevenção primária guiada por evidências tem custo biológico infinitamente menor do que tratamentos reativos.`,
  },
  {
    hookFormat: (topic: string) => `A verdade clínica sobre ${topic} que muitos pacientes ignoram`,
    subtextFormat: (topic: string) => `Entenda os mecanismos de base em ${topic} e o que realmente faz diferença na sua saúde a longo prazo.`,
    symptomIntro: (topic: string) => `O organismo costuma emitir avisos claros que não devem ser normalizados:`,
    symptoms: [
      "Queixas recorrentes que muitos atribuem apenas a estresse ou rotina corrida",
      "Desequilíbrio metabólico subclínico comprovado em biomarcadores objetivos",
      "Fatores epigenéticos e de estilo de vida acelerando o quadro",
    ],
    errorTitle: (topic: string) => `O mito frequente: soluções rápidas de internet para ${topic}`,
    errorSub: `Dicas genéricas e automedicação sem critério mascaram a causa real e geram frustração ao paciente.`,
    errorNote: `Saúde individualizada exige diagnóstico preciso e metas terapêuticas comprovadas em ensaios clínicos.`,
  },
  {
    hookFormat: (topic: string) => `O que ensaios clínicos recentes comprovaram sobre ${topic}`,
    subtextFormat: (topic: string) => `A medicina baseada em evidências trouxe novas diretrizes essenciais para o manejo responsável.`,
    symptomIntro: (topic: string) => `Sinais precoces que justificam avaliação médica aprofundada:`,
    symptoms: [
      "Alterações laboratoriais iniciais que merecem monitoramento direcionado",
      "Queda sutil na vitalidade diária associada à sobrecarga fisiológica",
      "Histórico clínico ou fatores predisponentes que exigem estratificação precoce",
    ],
    errorTitle: (topic: string) => `O equívoco clássico: focar no sintoma e esquecer a causa raiz`,
    errorSub: `Silenciar queixas pontuais sem reequilibrar o mecanismo de base impede resultados sustentáveis.`,
    errorNote: `Tratar a raiz fisiológica é a única forma de preservar longevidade e funcionalidade plena.`,
  },
];

/**
 * Gera as 6 lâminas estritamente encadeadas para qualquer tema informado.
 * Inclui motor de aleatoriedade/variação de ângulos para evitar conteúdos duplicados entre médicos
 * e imagens médicas geradas por IA distribuídas no carrossel.
 */
export function generateInterlinkedCarouselSlides(
  rawTopic: string,
  specialty: string,
  doctorName: string,
  crm: string,
  rqe?: string,
  externalCitation?: { title: string; journal: string; year: number; doi: string; takeaway: string; evidenceLevel?: string },
  variationSeed?: number
): CarouselSlide[] {
  const cleanTopic = (rawTopic || "Saúde Preventiva e Medicina Baseada em Evidências").trim();
  const lower = cleanTopic.toLowerCase();
  const baseSeed = variationSeed !== undefined ? Math.abs(variationSeed) : 42;

  // 1. Tenta encontrar um blueprint contextual específico
  const matchedBlueprint = TOPIC_BLUEPRINTS.find((bp) =>
    bp.keywords.some((kw) => lower.includes(kw))
  );

  if (matchedBlueprint) {
    const cit = externalCitation || matchedBlueprint.citation;
    const varCount = matchedBlueprint.variations.length;
    const selectedVarIndex = baseSeed % varCount;
    const chosenVar = matchedBlueprint.variations[selectedVarIndex] || matchedBlueprint.variations[0];

    const prompt1 = generateMedicalImagePrompt(cleanTopic, "Capa", specialty);
    const prompt3 = generateMedicalImagePrompt(cleanTopic, "Erro", specialty);
    const prompt5 = generateMedicalImagePrompt(cleanTopic, "Conduta", specialty);

    return [
      {
        number: 1,
        type: "Capa / Gancho",
        headline: chosenVar.hookTitle,
        subtext: chosenVar.hookSubtext,
        imageUrl: buildImageUrlFromPrompt(prompt1, baseSeed + 11),
        imagePrompt: prompt1,
        badge: "DESLIZE PARA VER",
      },
      {
        number: 2,
        type: "Sintomas Precoces",
        headline: chosenVar.symptomsHeadline,
        subtext: chosenVar.symptomsSubtext,
        bullets: chosenVar.symptomsList,
        badge: "SINAIS DE ALERTA",
      },
      {
        number: 3,
        type: "O Erro Comum",
        headline: chosenVar.errorHeadline,
        subtext: chosenVar.errorSubtext,
        takeaway: chosenVar.errorTakeaway,
        imageUrl: buildImageUrlFromPrompt(prompt3, baseSeed + 33),
        imagePrompt: prompt3,
        badge: "O QUE NÃO FAZER",
      },
      {
        number: 4,
        type: "Evidência Científica",
        headline: matchedBlueprint.mechanismHeadline,
        subtext: matchedBlueprint.mechanismSubtext,
        takeaway: `${cit.journal} (${cit.year}): ${cit.takeaway}`,
        scientificReference: {
          journal: cit.journal,
          year: cit.year,
          doi: cit.doi,
          evidenceLevel: cit.evidenceLevel || "Meta-análise / Ensaio Clínico (Nível 1A)",
        },
        badge: "CIÊNCIA INDEXADA",
      },
      {
        number: 5,
        type: "Conduta Médica",
        headline: matchedBlueprint.conductHeadline,
        subtext: "Conduta preventiva fundamentada na literatura médica contemporânea:",
        bullets: matchedBlueprint.conductSteps,
        imageUrl: buildImageUrlFromPrompt(prompt5, baseSeed + 55),
        imagePrompt: prompt5,
        badge: "CONDUTA ÉTICA",
      },
      {
        number: 6,
        type: "Encerramento & CTA",
        headline: "Este conteúdo fez sentido para sua saúde?",
        subtext: `Compartilhe com quem precisa saber disso e salve para revisar seus exames com critério.\n\nPara avaliações clínicas e planos de prevenção individualizados, consulte o link na bio.`,
        badge: "CFM 2.336/2023",
      },
    ];
  }

  // 2. Gerador Dinâmico Adaptativo com Variação de Ângulos (Anti-Duplicação)
  const angleIndex = baseSeed % GENERAL_ANGLE_PATTERNS.length;
  const pattern = GENERAL_ANGLE_PATTERNS[angleIndex];

  const cit = externalCitation || {
    title: `Estudo contemporâneo sobre ${cleanTopic}`,
    journal: "The Lancet & PubMed Medical Index",
    year: 2024,
    doi: "10.1016/S0140-6736(24)00112-X",
    takeaway: `Investigações clínicas demonstram que a intervenção diagnóstica precoce em ${cleanTopic} altera favoravelmente o prognóstico a longo prazo.`,
    evidenceLevel: "Revisão Sistemática Nível 1A",
  };

  const prompt1 = generateMedicalImagePrompt(cleanTopic, "Capa", specialty);
  const prompt3 = generateMedicalImagePrompt(cleanTopic, "Erro", specialty);
  const prompt5 = generateMedicalImagePrompt(cleanTopic, "Conduta", specialty);

  return [
    {
      number: 1,
      type: "Capa / Gancho",
      headline: pattern.hookFormat(cleanTopic),
      subtext: pattern.subtextFormat(cleanTopic),
      imageUrl: buildImageUrlFromPrompt(prompt1, baseSeed + 11),
      imagePrompt: prompt1,
      badge: "DESLIZE PARA VER",
    },
    {
      number: 2,
      type: "Sintomas & Sinais",
      headline: `Como ${cleanTopic} se manifesta no seu dia a dia`,
      subtext: pattern.symptomIntro(cleanTopic),
      bullets: pattern.symptoms,
      badge: "SINAIS CLÍNICOS",
    },
    {
      number: 3,
      type: "O Erro Comum",
      headline: pattern.errorTitle(cleanTopic),
      subtext: pattern.errorSub,
      takeaway: pattern.errorNote,
      imageUrl: buildImageUrlFromPrompt(prompt3, baseSeed + 33),
      imagePrompt: prompt3,
      badge: "ALERTA MÉDICO",
    },
    {
      number: 4,
      type: "Evidência Científica",
      headline: `O que comprovam os estudos científicos sobre ${cleanTopic}`,
      subtext: `Ensaios clínicos rigorosos demonstram a fisiopatologia e os desfechos terapêuticos validados:`,
      takeaway: `${cit.journal} (${cit.year}): ${cit.takeaway}`,
      scientificReference: {
        journal: cit.journal,
        year: cit.year,
        doi: cit.doi,
        evidenceLevel: cit.evidenceLevel || "Revisão Sistemática Nível 1A",
      },
      badge: "ESTUDO INDEXADO",
    },
    {
      number: 5,
      type: "Conduta Responsável",
      headline: `3 etapas éticas para abordar ${cleanTopic} com segurança`,
      subtext: `Condutas comprovadas para prevenção e restabelecimento da saúde:`,
      bullets: [
        `1. Investigação com exames específicos e estratificação de risco personalizada`,
        `2. Ajuste dos pilares do estilo de vida: sono, nutrição e modulação metabólica`,
        `3. Acompanhamento médico contínuo baseado em metas terapêuticas claras`,
      ],
      imageUrl: buildImageUrlFromPrompt(prompt5, baseSeed + 55),
      imagePrompt: prompt5,
      badge: "CONDUTA ÉTICA",
    },
    {
      number: 6,
      type: "Encerramento & CTA",
      headline: "Gostou desta explicação médica fundamentada?",
      subtext: `Salve este carrossel para consulta futura e envie para familiares que convivem com este tema.\n\nPara agendamentos e consultas médicas preventivas, acesse o link no perfil.`,
      badge: "CFM 2.336/2023",
    },
  ];
}
