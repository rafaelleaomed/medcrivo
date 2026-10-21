import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";
import { z } from "zod";
import { generatePost } from "@/lib/content/generate";
import type { CarouselSlide } from "@/lib/carouselEngine";
import { DoctorProfileSchema } from "@/lib/profile";

/**
 * Geração síncrona usada pelos layouts clássicos do CarouselStudio (troca de tom/meta).
 * O fluxo principal é assíncrono: POST /api/jobs/carousel.
 */
const BodySchema = z.object({
  topic: z.string().trim().min(3).max(500),
  specialty: z.string().max(120).optional(),
  doctorName: z.string().max(120).optional(),
  crm: z.string().max(40).optional(),
  rqe: z.string().max(20).optional(),
  tone: z.enum(["didatico", "academico", "consultorio"]).default("didatico"),
  goal: z.enum(["saves", "shares", "comments", "follows"]).default("saves"),
});

const TEMPLATE_LABELS: Record<string, string> = {
  capa_noticia: "Capa / Gancho",
  conteudo: "Conteúdo",
  passo: "Passo a passo",
  frase: "Reflexão",
  lista: "Checklist",
  cta: "Conclusão & CTA",
};

export async function POST(req: NextRequest) {
  const blocked = await guardUser("carousel", 10);
  if (blocked) return blocked;
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Tema é obrigatório." }, { status: 400 });
  }
  const { topic, specialty, doctorName, crm, rqe, tone, goal } = parsed.data;
  const profile = DoctorProfileSchema.parse({ name: doctorName, specialty, crm, rqe, tone });

  try {
    const { post, source } = await generatePost({ topic, tone, slideCount: 7 }, profile);
    const slides: CarouselSlide[] = post.slides.map((s, i) => ({
      number: i + 1,
      type: TEMPLATE_LABELS[s.template] ?? s.template,
      badge: s.kicker || (specialty ?? "").toUpperCase(),
      headline: s.headline,
      subtext: s.body,
      bullets: s.items.length ? s.items : undefined,
      imagePrompt: s.imagePrompt || undefined,
    }));
    return NextResponse.json({ success: true, slides, topic, tone, goal, source });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro ao gerar carrossel" },
      { status: 500 },
    );
  }
}
