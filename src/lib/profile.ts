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
