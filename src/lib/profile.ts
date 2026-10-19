import { z } from "zod";

/** Identidade visual aplicada aos templates de slide. */
export const BrandKitSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#123C36"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#D6EF72"),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#F5F2E9"),
});
export type BrandKit = z.infer<typeof BrandKitSchema>;

export const DEFAULT_BRAND: BrandKit = { primary: "#123C36", accent: "#D6EF72", background: "#F5F2E9" };

export const DoctorProfileSchema = z.object({
  name: z.string().max(120).default(""),
  profession: z.enum(["medico", "dentista"]).default("medico"),
  /**
   * Situação profissional. "medico": tem CRM, sem RQE (inclui residentes). "especialista": CRM + RQE.
   * "estudante": sem CRM; não pode se apresentar como médico(a) nem como especialista.
   */
  careerStage: z.enum(["medico", "especialista", "estudante"]).default("medico"),
  specialty: z.string().max(120).default(""),
  /** CRM/UF ou CRO/UF. Mantém o nome `crm` por compatibilidade com os componentes existentes. */
  crm: z.string().max(40).default(""),
  rqe: z.string().max(20).default(""),
  instagram: z.string().max(80).default(""),
  tiktok: z.string().max(80).default(""),
  youtube: z.string().max(200).default(""),
  bookingLink: z.string().max(300).default(""),
  interests: z.array(z.string().max(120)).max(20).default([]),
  audiencePains: z.array(z.string().max(200)).max(5).default([]),
  tone: z.enum(["didatico", "academico", "consultorio"]).default("didatico"),
  brand: BrandKitSchema.default(DEFAULT_BRAND),
  onboarded: z.boolean().default(false),
});
export type DoctorProfile = z.infer<typeof DoctorProfileSchema>;

export const EMPTY_PROFILE: DoctorProfile = DoctorProfileSchema.parse({});

export function councilLabel(profile: Pick<DoctorProfile, "profession">): "CRM" | "CRO" {
  return profile.profession === "dentista" ? "CRO" : "CRM";
}

export const CAREER_STAGE_LABELS: Record<DoctorProfile["careerStage"], string> = {
  medico: "Médico(a)",
  especialista: "Médico(a) especialista (RQE)",
  estudante: "Estudante de medicina",
};

export const CAREER_STAGE_HINTS: Record<DoctorProfile["careerStage"], string> = {
  medico: "Tem CRM, ainda sem RQE. Vale também para residentes.",
  especialista: "Tem CRM e RQE registrado no conselho.",
  estudante: "Ainda sem CRM. O app não cobra o número nem escreve MÉDICO no rodapé.",
};

/** Só o especialista pode anunciar especialidade, sempre com o RQE. */
export function requiresRqe(profile: Pick<DoctorProfile, "careerStage">): boolean {
  return profile.careerStage === "especialista";
}

/** Estudante ainda não tem CRM: o app não cobra o número nem escreve "MÉDICO" no rodapé. */
export function requiresCouncilId(profile: Pick<DoctorProfile, "careerStage">): boolean {
  return profile.careerStage !== "estudante";
}

/** Especialidade só aparece para quem tem RQE (Res. CFM 2.336/2023); para dentistas, segue o CRO. */
export function showsSpecialty(profile: Pick<DoctorProfile, "profession" | "careerStage" | "rqe">): boolean {
  return profile.profession === "dentista" || (profile.careerStage === "especialista" && Boolean(profile.rqe.trim()));
}

/**
 * Linha de identificação do rodapé dos posts, conforme a situação profissional:
 * estudante (sem CRM, nunca "Médico"), médico (CRM, sem RQE) e especialista (CRM + RQE).
 */
export function identificationLine(profile: Pick<DoctorProfile, "name" | "profession" | "careerStage" | "crm" | "rqe">): string {
  const name = profile.name.trim() || "Seu nome";
  if (profile.profession !== "dentista" && profile.careerStage === "estudante") return `${name} · Estudante de medicina`;
  const role = profile.profession === "dentista" ? "Cirurgião-dentista" : "Médico";
  const council = profile.crm.trim() || `${councilLabel(profile)} não informado`;
  const rqe = showsSpecialty(profile) && profile.rqe.trim() ? ` · RQE ${profile.rqe.trim()}` : "";
  return `${name} · ${role} · ${council}${rqe}`;
}

/** Primeiro nome sem pronome de tratamento ("Dra. Ana Lima" -> "Ana"). */
export function firstName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const titles = /^(dr|dra|dr\(a\)|prof|profa)\.?$/i;
  return words.find((w) => !titles.test(w)) ?? "";
}

/** Saudação/assinatura curta: estudante sem "Dr(a).". */
export function greetingName(profile: Pick<DoctorProfile, "name" | "careerStage">): string {
  const first = firstName(profile.name);
  if (!first) return "";
  return profile.careerStage === "estudante" ? first : `Dr(a). ${first}`;
}
