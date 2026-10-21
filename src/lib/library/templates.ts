import type { Framework, SlideTemplate } from "../content/schema";

/**
 * Biblioteca de modelos de carrossel por especialidade e por framework (Doctor Creator / CreatorMed).
 * Conteúdo estático e versionado: cada gancho passa pelo Crivo nos testes (tests/planning.test.mjs).
 * Regras: nada de estudo, número, porcentagem, DOI ou promessa de resultado. Os ganchos são enquadramentos;
 * o conteúdo de fato é gerado depois, com evidência real e nova passagem pelo Crivo.
 * Arquivo sem dependências de servidor (só tipos) para poder ser testado com `node --test`.
 */
export const LIBRARY_VERSION = "2026-10-19";

export type LibraryFramework = Exclude<Framework, "passo_a_passo">;

export interface SlidePlan {
  template: SlideTemplate;
  /** Papel do slide em até 4 palavras. */
  role: string;
}

export interface FrameworkGuide {
  id: LibraryFramework;
  label: string;
  /** Uma linha (≤ 12 palavras). */
  purpose: string;
  slides: SlidePlan[];
}

export const LIBRARY_FRAMEWORKS: FrameworkGuide[] = [
  {
    id: "mito_desfeito",
    label: "Mito desfeito",
    purpose: "Troca uma crença popular pelo que se sabe hoje.",
    slides: [
      { template: "capa_noticia", role: "O mito" },
      { template: "conteudo", role: "Por que se acredita" },
      { template: "conteudo", role: "O que se sabe hoje" },
      { template: "conteudo", role: "Exceções" },
      { template: "lista", role: "O que fazer" },
      { template: "frase", role: "Reflexão" },
      { template: "conteudo", role: "Quando procurar avaliação" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
  {
    id: "sintoma_silencioso",
    label: "Sintoma silencioso",
    purpose: "Mostra o que costuma passar despercebido e quando investigar.",
    slides: [
      { template: "capa_noticia", role: "O sinal discreto" },
      { template: "conteudo", role: "Por que passa batido" },
      { template: "lista", role: "Sinais para observar" },
      { template: "conteudo", role: "Quem deve ficar atento" },
      { template: "conteudo", role: "Como se investiga" },
      { template: "frase", role: "Reflexão" },
      { template: "conteudo", role: "Quando procurar avaliação" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
  {
    id: "erro_comum",
    label: "Erro comum",
    purpose: "Nomeia um hábito arriscado e mostra como corrigir.",
    slides: [
      { template: "capa_noticia", role: "O erro" },
      { template: "conteudo", role: "Por que acontece" },
      { template: "conteudo", role: "O risco" },
      { template: "passo", role: "Passo 1" },
      { template: "passo", role: "Passo 2" },
      { template: "passo", role: "Passo 3" },
      { template: "frase", role: "Reflexão" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
  {
    id: "checklist",
    label: "Checklist",
    purpose: "Lista prática para salvar e usar no dia a dia.",
    slides: [
      { template: "capa_noticia", role: "A promessa do guia" },
      { template: "conteudo", role: "Para quem é" },
      { template: "lista", role: "Checklist" },
      { template: "lista", role: "Sinais de alerta" },
      { template: "conteudo", role: "Como usar" },
      { template: "frase", role: "Reflexão" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
  {
    id: "caso_anonimizado",
    label: "Caso anonimizado",
    purpose: "Conta um caso sem identificar ninguém e tira a lição.",
    slides: [
      { template: "capa_noticia", role: "O caso" },
      { template: "conteudo", role: "Contexto" },
      { template: "conteudo", role: "O que chamou atenção" },
      { template: "conteudo", role: "O raciocínio" },
      { template: "conteudo", role: "Desfecho geral" },
      { template: "lista", role: "Lições" },
      { template: "frase", role: "Reflexão" },
      { template: "conteudo", role: "Aviso de anonimização" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
  {
    id: "norma_pode_nao_pode",
    label: "Pode / não pode",
    purpose: "A norma do conselho em exemplos de pode e não pode.",
    slides: [
      { template: "capa_noticia", role: "A pergunta" },
      { template: "conteudo", role: "O que diz a norma" },
      { template: "lista", role: "Pode" },
      { template: "lista", role: "Não pode" },
      { template: "conteudo", role: "Zona cinzenta" },
      { template: "conteudo", role: "Onde ler a norma" },
      { template: "frase", role: "Reflexão" },
      { template: "cta", role: "Comente a palavra" },
    ],
  },
];

export type LibrarySpecialtyId =
  | "clinico_geral"
  | "cardiologia"
  | "dermatologia"
  | "ginecologia_obstetricia"
  | "pediatria"
  | "psiquiatria"
  | "endocrinologia"
  | "ortopedia_esportiva"
  | "odontologia";

export interface LibrarySpecialty {
  id: LibrarySpecialtyId;
  label: string;
  profession: "medico" | "dentista";
  /** Trechos (sem acento, minúsculos) que identificam a especialidade no perfil. */
  keywords: string[];
}

export const LIBRARY_SPECIALTIES: LibrarySpecialty[] = [
  { id: "clinico_geral", label: "Clínica geral", profession: "medico", keywords: ["clinic", "familia", "medicina interna"] },
  { id: "cardiologia", label: "Cardiologia", profession: "medico", keywords: ["cardio"] },
  { id: "dermatologia", label: "Dermatologia", profession: "medico", keywords: ["dermato", "tricolog"] },
  { id: "ginecologia_obstetricia", label: "Ginecologia e obstetrícia", profession: "medico", keywords: ["gineco", "obstet"] },
  { id: "pediatria", label: "Pediatria", profession: "medico", keywords: ["pediat", "neonat"] },
  { id: "psiquiatria", label: "Psiquiatria", profession: "medico", keywords: ["psiq", "saude mental"] },
  { id: "endocrinologia", label: "Endocrinologia", profession: "medico", keywords: ["endocr", "metabol"] },
  { id: "ortopedia_esportiva", label: "Ortopedia", profession: "medico", keywords: ["ortop", "traumat", "esporte", "esportiva"] },
  { id: "odontologia", label: "Odontologia", profession: "dentista", keywords: ["odont", "dentist"] },
];

export interface LibraryModel {
  id: string;
  specialty: LibrarySpecialtyId;
  framework: LibraryFramework;
  /** Tema enviado ao carrossel. */
  topic: string;
  /** Exemplo de gancho para a capa (≤ 14 palavras). */
  hook: string;
}

type Row = [LibraryFramework, string, string];

const ROWS: Record<LibrarySpecialtyId, Row[]> = {
  clinico_geral: [
    ["mito_desfeito", "Só é preciso ir ao médico quando se sente alguma coisa", "Só vou ao médico quando sinto algo: por que essa ideia engana"],
    ["sintoma_silencioso", "Pressão alta que não dá sintoma", "A pressão pode estar alta sem você sentir nada"],
    ["erro_comum", "Tomar antibiótico por conta própria em gripe e resfriado", "Antibiótico para gripe e resfriado: um erro que se repete"],
    ["checklist", "O que levar e perguntar na consulta", "O que levar para a consulta e não esquecer nada"],
    ["caso_anonimizado", "Cansaço persistente que parecia apenas estresse", "O cansaço que parecia só estresse"],
    ["norma_pode_nao_pode", "Postar foto de paciente nas redes, segundo a Res. CFM 2.336/2023", "Foto de paciente no post: pode ou não pode?"],
  ],
  cardiologia: [
    ["mito_desfeito", "Colesterol alto só acontece em quem está acima do peso", "Colesterol alto não é só de quem está acima do peso"],
    ["sintoma_silencioso", "Hipertensão costuma não dar sintomas", "Pressão alta costuma ser silenciosa: por que medir mesmo sem sentir nada"],
    ["erro_comum", "Parar o remédio de pressão quando a pressão normaliza", "Sua pressão normalizou? Não pare o remédio por conta própria"],
    ["checklist", "Como medir a pressão em casa do jeito certo", "Como medir a pressão em casa sem errar a leitura"],
    ["caso_anonimizado", "Dor no peito ao esforço atribuída a falta de preparo físico", "A dor no peito na escada que parecia falta de preparo"],
    ["norma_pode_nao_pode", "Mostrar exame ou laudo de paciente nas redes", "Mostrar exame de paciente no post: pode ou não pode?"],
  ],
  dermatologia: [
    ["mito_desfeito", "Protetor solar só é necessário em dia de sol forte ou de praia", "Protetor solar não é só para dia de praia"],
    ["sintoma_silencioso", "Pinta que muda de forma, cor ou tamanho", "A pinta que mudou e quase ninguém percebe"],
    ["erro_comum", "Espremer cravos e espinhas", "Espremer espinhas: o erro que costuma piorar a pele"],
    ["checklist", "Autoexame da pele: o que observar nas pintas", "O que observar nas suas pintas no autoexame"],
    ["caso_anonimizado", "Mancha tratada como micose que precisava de outra avaliação", "A mancha que parecia micose"],
    ["norma_pode_nao_pode", "Divulgar imagens de procedimentos dermatológicos nas redes", "Imagem de procedimento no feed: o que a norma permite"],
  ],
  ginecologia_obstetricia: [
    ["mito_desfeito", "Quem não tem sintomas não precisa fazer o preventivo", "Sem sintomas, sem preventivo? Esse raciocínio engana"],
    ["sintoma_silencioso", "Infecções sexualmente transmissíveis que podem não dar sintomas", "Algumas ISTs não dão sinal nenhum"],
    ["erro_comum", "Fazer ducha vaginal na higiene íntima", "Ducha vaginal na higiene íntima: um erro comum"],
    ["checklist", "Primeira consulta de pré-natal: o que levar e perguntar", "O que levar e perguntar na primeira consulta do pré-natal"],
    ["caso_anonimizado", "Cólica intensa tratada como normal por anos", "A cólica que todos diziam ser normal"],
    ["norma_pode_nao_pode", "Publicar foto de parto ou de paciente gestante", "Foto de parto nas redes: pode ou não pode?"],
  ],
  pediatria: [
    ["mito_desfeito", "Quanto mais alta a febre, mais grave a doença", "Febre mais alta nem sempre quer dizer doença mais grave"],
    ["sintoma_silencioso", "Sinais de que a criança pode não estar enxergando bem", "Sinais discretos de que seu filho pode não enxergar bem"],
    ["erro_comum", "Oferecer mel a bebês antes de completar um ano", "Mel antes de um ano de idade: um erro comum"],
    ["checklist", "Segurança da casa para bebês que começam a engatinhar", "Casa segura para quem começou a engatinhar"],
    ["caso_anonimizado", "Tosse noturna persistente na criança", "A tosse que só aparecia à noite"],
    ["norma_pode_nao_pode", "Postar foto de paciente criança nas redes", "Foto de paciente criança no post: pode ou não pode?"],
  ],
  psiquiatria: [
    ["mito_desfeito", "Ansiedade é falta de força de vontade", "Ansiedade não é falta de força de vontade"],
    ["sintoma_silencioso", "Sinais discretos de depressão no dia a dia", "Depressão nem sempre parece tristeza"],
    ["erro_comum", "Parar o antidepressivo por conta própria quando melhora", "Melhorou e parou o remédio por conta própria? Cuidado"],
    ["checklist", "Higiene do sono: hábitos que ajudam e que atrapalham", "Rotina de sono: o que ajuda e o que atrapalha"],
    ["caso_anonimizado", "Insônia que escondia um quadro de ansiedade", "A insônia que não era só insônia"],
    ["norma_pode_nao_pode", "Responder dúvidas de pacientes pelo direct e pelo WhatsApp", "Responder paciente no direct: até onde pode ir"],
  ],
  endocrinologia: [
    ["mito_desfeito", "Quem tem diabetes não pode comer nenhuma fruta", "Quem tem diabetes pode comer fruta?"],
    ["sintoma_silencioso", "Pré-diabetes costuma não dar sintomas", "O pré-diabetes costuma passar sem sintomas"],
    ["erro_comum", "Usar remédio para emagrecer sem acompanhamento médico", "Remédio para emagrecer sem acompanhamento: o erro que se repete"],
    ["checklist", "Cuidado diário com os pés para quem tem diabetes", "Cuidado diário com os pés para quem tem diabetes"],
    ["caso_anonimizado", "Cansaço e queda de cabelo investigados na tireoide", "O cansaço que levou a olhar a tireoide"],
    ["norma_pode_nao_pode", "Falar de emagrecimento nas redes sem prometer resultado", "Emagrecimento nas redes: o que a norma permite falar"],
  ],
  ortopedia_esportiva: [
    ["mito_desfeito", "Estalar os dedos causa artrose", "Estalar os dedos causa artrose?"],
    ["sintoma_silencioso", "Osteoporose costuma não dar sintomas até a primeira fratura", "A osteoporose costuma ficar calada até a primeira fratura"],
    ["erro_comum", "Voltar a treinar ainda com dor depois de uma lesão", "Voltar a treinar ainda com dor: um erro comum"],
    ["checklist", "Ajustes de postura para quem trabalha sentado", "Postura no trabalho: ajustes simples para quem fica sentado"],
    ["caso_anonimizado", "Dor no joelho do corredor amador", "A dor no joelho que apareceu com a corrida"],
    ["norma_pode_nao_pode", "Postar vídeo de cirurgia nas redes", "Vídeo de cirurgia no feed: pode ou não pode?"],
  ],
  odontologia: [
    ["mito_desfeito", "Sangramento na gengiva ao escovar é normal", "Gengiva que sangra ao escovar não é normal"],
    ["sintoma_silencioso", "Cárie no início costuma não doer", "A cárie no começo costuma não doer"],
    ["erro_comum", "Escovar os dentes com força demais", "Escovar com força não limpa mais"],
    ["checklist", "Higiene bucal antes de dormir", "Higiene bucal antes de dormir: o que não pode faltar"],
    ["caso_anonimizado", "Sensibilidade nos dentes que vinha do bruxismo", "A sensibilidade que vinha do ranger de dentes"],
    ["norma_pode_nao_pode", "Selfies e imagens de tratamento segundo a Res. CFO-196/2019", "Selfie e foto de tratamento: o que o CFO permite"],
  ],
};

export const LIBRARY_MODELS: LibraryModel[] = (Object.entries(ROWS) as [LibrarySpecialtyId, Row[]][]).flatMap(([specialty, rows]) =>
  rows.map(([framework, topic, hook]) => ({ id: `${specialty}-${framework}`, specialty, framework, topic, hook })),
);

export function frameworkGuide(id: LibraryFramework): FrameworkGuide {
  return LIBRARY_FRAMEWORKS.find((f) => f.id === id) ?? LIBRARY_FRAMEWORKS[0];
}

export function specialtyById(id: LibrarySpecialtyId): LibrarySpecialty {
  return LIBRARY_SPECIALTIES.find((s) => s.id === id) ?? LIBRARY_SPECIALTIES[0];
}

/** Acentos separados pelo NFD (U+0300 a U+036F). */
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, "g");

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase();

/** Especialidade da biblioteca que corresponde ao perfil (dentista → Odontologia); null mostra todas. */
export function matchSpecialty(specialty: string, profession: "medico" | "dentista"): LibrarySpecialtyId | null {
  if (profession === "dentista") return "odontologia";
  const text = normalize(specialty);
  if (!text.trim()) return null;
  return LIBRARY_SPECIALTIES.find((s) => s.profession === profession && s.keywords.some((k) => text.includes(k)))?.id ?? null;
}

/** Tema enviado ao carrossel: framework + assunto, para a IA seguir a estrutura escolhida. */
export function topicFor(model: LibraryModel): string {
  return `${frameworkGuide(model.framework).label}: ${model.topic}`;
}

/** Texto completo do modelo, usado pelo Crivo. */
export function modelText(model: LibraryModel): string {
  return `${model.hook}\n${topicFor(model)}`;
}
