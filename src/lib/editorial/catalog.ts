import e1 from "../../../assets/posts/e1-static/manifest.json";
import c1 from "../../../assets/posts/c1-carousel/manifest.json";
import c2 from "../../../assets/posts/c2-carousel/manifest.json";
import e2 from "../../../assets/posts/e2-static/manifest.json";
import c3 from "../../../assets/posts/c3-carousel/manifest.json";
import type { ApprovalStatus } from "./approval";
import { privateEditorialImages } from "./assets";

export type EditorialFormat = "Carrossel" | "Reel" | "Estático" | "Stories";

export type EditorialItem = {
  id: string;
  projectId: string;
  title: string;
  eyebrow: string;
  format: EditorialFormat;
  scheduledAt: string;
  thesis: string;
  body: string;
  caption: string;
  images: string[];
  dependencies: string[];
  defaultStatus: ApprovalStatus;
};

export type EditorialProject = {
  id: string;
  title: string;
  period: string;
  description: string;
  tone: "pinho" | "lima" | "marfim";
};

type Manifest = {
  slot_id: string;
  title: string;
  series: string;
  type: "static" | "carousel";
  scheduled_at: string;
  caption: string;
  image_url?: string;
  image_urls?: string[];
  notes: string;
};

function publishedItem(manifest: Manifest): EditorialItem {
  const sourceImages = manifest.image_urls ?? (manifest.image_url ? [manifest.image_url] : []);
  return {
    id: manifest.slot_id,
    projectId: "lote-01",
    title: manifest.title,
    eyebrow: manifest.series,
    format: manifest.type === "carousel" ? "Carrossel" : "Estático",
    scheduledAt: manifest.scheduled_at,
    thesis: manifest.notes,
    body: manifest.caption.split("\n\n")[0],
    caption: manifest.caption,
    images: privateEditorialImages(manifest.slot_id, sourceImages),
    dependencies: ["Arte final aprovada", "Crivo editorial concluído", "Publicação agendada"],
    defaultStatus: "scheduled",
  };
}

const drafts: EditorialItem[] = [
  {
    id: "draft-2026-10-26-reel",
    projectId: "semana-26-10",
    title: "Médico bom, perfil genérico",
    eyebrow: "Segunda · Reel",
    format: "Reel",
    scheduledAt: "2026-10-26T18:00:00-03:00",
    thesis: "Publicar assuntos úteis sem um fio claro dificulta entender pelo que o médico quer ser lembrado.",
    body: "Você publica conteúdo correto. Mesmo assim, seu nome não fica ligado a nenhum assunto.",
    caption: "Um post pode ser útil e ainda parecer solto no perfil. Quando cada publicação aponta para um lugar diferente, fica difícil entender como você pensa e quais assuntos você costuma explicar. Antes de buscar outra pauta, escolha o fio que deve unir as próximas.",
    images: [],
    dependencies: ["Aprovar texto", "Gravar Rafael", "Editar em 9:16", "Passar arquivo final pelo Crivo"],
    defaultStatus: "pending",
  },
  {
    id: "draft-2026-10-27-carousel",
    projectId: "semana-26-10",
    title: "Antes do “pode ou não pode”",
    eyebrow: "Terça · Carrossel",
    format: "Carrossel",
    scheduledAt: "2026-10-27T12:00:00-03:00",
    thesis: "Na publicidade médica, a resposta depende do contexto; listas soltas escondem condições importantes.",
    body: "A pergunta não é só: “pode postar?”",
    caption: "“Pode ou não pode?” é uma boa pergunta. Mas raramente é a última. Na publicidade médica, contexto muda a análise: quem publica, o que foi afirmado, qual imagem foi usada e quais condições ficaram claras.",
    images: [],
    dependencies: ["Testar entrega do checklist CRIVO", "Diagramar 7 slides", "Revisar legibilidade", "Crivo final"],
    defaultStatus: "pending",
  },
  {
    id: "draft-2026-10-28-reel",
    projectId: "semana-26-10",
    title: "Do consultório ao carrossel",
    eyebrow: "Quarta · Reel",
    format: "Reel",
    scheduledAt: "2026-10-28T19:00:00-03:00",
    thesis: "Uma pergunta recorrente pode originar formatos diferentes sem expor uma consulta.",
    body: "Uma dúvida que vive aparecendo não precisa morrer no consultório.",
    caption: "A rotina clínica pode mostrar quais dúvidas merecem uma explicação melhor. Isso não exige contar a história de ninguém. O ponto de partida pode ser uma pergunta genérica, sem contexto, imagem ou dado de paciente.",
    images: [],
    dependencies: ["Aprovar roteiro", "Gravar Rafael", "Usar interface fictícia", "Crivo final"],
    defaultStatus: "pending",
  },
  {
    id: "draft-2026-10-29-static",
    projectId: "semana-26-10",
    title: "Manifesto: texto também precisa de crivo",
    eyebrow: "Quinta · Estático",
    format: "Estático",
    scheduledAt: "2026-10-29T18:00:00-03:00",
    thesis: "O cuidado aplicado à conduta médica também precisa existir na comunicação digital.",
    body: "A gente aprendeu a revisar conduta. No digital, o texto também precisa de crivo.",
    caption: "Publicar não é só escrever e apertar um botão. É conferir se a mensagem está clara, se a evidência sustenta o que foi dito e se a forma de apresentar respeita quem lê.",
    images: [],
    dependencies: ["Aprovar formulação", "Criar arte 1:1", "Adaptar para 9:16", "Crivo final"],
    defaultStatus: "pending",
  },
  {
    id: "draft-2026-10-30-stories",
    projectId: "semana-26-10",
    title: "Uma pauta, três caminhos",
    eyebrow: "Sexta · Stories",
    format: "Stories",
    scheduledAt: "2026-10-30T12:00:00-03:00",
    thesis: "O formato deve mudar conforme a função da mensagem, não apenas repetir o mesmo texto.",
    body: "Repetir a mesma legenda em três formatos não é reaproveitar conteúdo.",
    caption: "Carrossel para explicar etapas. Reel para uma tese direta. Stories para perguntar antes de explicar.",
    images: [],
    dependencies: ["Aprovar sequência", "Gravar ou aprovar fotografia real", "Criar 4 telas", "Crivo final"],
    defaultStatus: "pending",
  },
];

export const EDITORIAL_PROJECTS: EditorialProject[] = [
  {
    id: "semana-26-10",
    title: "Semana 26–30/10",
    period: "5 rascunhos · aguardando decisão",
    description: "Dois Reels, um carrossel, um estático e um pacote de Stories preparados pela automação.",
    tone: "lima",
  },
  {
    id: "lote-01",
    title: "Lote editorial 01",
    period: "5 peças · agendadas",
    description: "Peças finais com arte, legenda, Crivo editorial e datas de publicação confirmadas.",
    tone: "pinho",
  },
  {
    id: "ciclo-30-dias",
    title: "Ciclo editorial de 30 dias",
    period: "26/10–24/11",
    description: "Planejamento de posicionamento, educação e produto para a MedCrivo.",
    tone: "marfim",
  },
];

export const EDITORIAL_ITEMS: EditorialItem[] = [
  ...drafts,
  publishedItem(c1 as Manifest),
  publishedItem(e1 as Manifest),
  publishedItem(c2 as Manifest),
  publishedItem(e2 as Manifest),
  publishedItem(c3 as Manifest),
];
