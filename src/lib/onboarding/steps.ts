import { requiresCouncilId, requiresRqe, councilLabel, type DoctorProfile } from "@/lib/profile";

/** Etapas do onboarding (estrutura do wizard do CreatorMed, adaptada ao MedCrivo). */
export const STEPS = [
  { id: "voce", label: "Você", title: "Quem é você", subtitle: "Isso define o rodapé ético de todo post." },
  { id: "instagram", label: "Instagram", title: "Seu Instagram", subtitle: "Opcional. Só o @, nunca a senha." },
  { id: "publico", label: "Público", title: "Para quem você fala", subtitle: "Até 3 dores do seu paciente." },
  { id: "marca", label: "Marca", title: "Suas cores", subtitle: "Aplicadas em todos os slides." },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const STEP_STORAGE_KEY = "medcrivo:onboarding-step";

/** Máximo de dores do público (o perfil aceita até 5; o onboarding pede foco em 3). */
export const PAINS_MAX = 3;

/** Mensagem do primeiro problema que impede avançar, ou null. */
export function validateStep(step: StepId, p: DoctorProfile): string | null {
  if (step === "voce") {
    if (!p.name.trim()) return "Informe seu nome.";
    if (requiresCouncilId(p) && !p.crm.trim()) return `Informe seu ${councilLabel(p)} com a UF.`;
    if (requiresRqe(p) && p.profession === "medico" && !p.rqe.trim()) return "Especialista precisa do RQE.";
    if (requiresRqe(p) && !p.specialty.trim()) return "Escolha sua especialidade.";
  }
  if (step === "instagram" && p.instagram && !/^@?[a-z0-9._]{1,30}$/i.test(p.instagram.trim())) {
    return "Use só letras, números, ponto e sublinhado.";
  }
  return null;
}

export const PAIN_SUGGESTIONS: Record<DoctorProfile["profession"], string[]> = {
  medico: [
    "Medo de exames e diagnósticos",
    "Informação confusa na internet",
    "Dificuldade de mudar hábitos",
    "Sintomas que não melhoram",
    "Falta de tempo para se cuidar",
    "Dúvidas sobre remédios",
  ],
  dentista: [
    "Medo de dentista",
    "Dor e sensibilidade",
    "Insegurança com o sorriso",
    "Custo do tratamento",
    "Mau hálito",
    "Cuidados com as crianças",
  ],
};

export const TONE_OPTIONS: { id: DoctorProfile["tone"]; label: string; hint: string }[] = [
  { id: "didatico", label: "Didático", hint: "Analogias e frases curtas" },
  { id: "consultorio", label: "Consultório", hint: "Próximo e acolhedor" },
  { id: "academico", label: "Técnico", hint: "Preciso, sem jargão à toa" },
];

/** Paletas prontas (principal escura + destaque claro, para contraste nos slides). */
export const PALETTES: { id: string; label: string; primary: string; accent: string }[] = [
  { id: "medcrivo", label: "MedCrivo", primary: "#123C36", accent: "#D6EF72" },
  { id: "oceano", label: "Oceano", primary: "#14324F", accent: "#8FD3F4" },
  { id: "terracota", label: "Terracota", primary: "#4A2318", accent: "#F2B48A" },
  { id: "grafite", label: "Grafite", primary: "#1F2328", accent: "#E8E3D6" },
  { id: "vinho", label: "Vinho", primary: "#3D1626", accent: "#F4BFD0" },
];
