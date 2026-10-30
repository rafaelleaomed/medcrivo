import { HealthcareComplianceEngine } from "@/lib/compliance";
import { ConsensusScientificEngine } from "@/lib/consensus";
import { generatePost } from "@/lib/content/generate";
import type { GeneratedSlide, PostDraft, PostSlide } from "@/lib/content/schema";
import { councilLabel, EMPTY_PROFILE, type DoctorProfile } from "@/lib/profile";
import type { JobRecord, Store } from "@/lib/store/types";

/**
 * Imagem 4:5 (1080x1350) para os templates que usam foto. Opcional: sem SLIDE_IMAGE_PROVIDER=pollinations,
 * capa e CTA usam o fundo gerado com as cores da marca (o plano gratuito do Pollinations devolve um selo de limite).
 */
function imageUrlFor(prompt: string, seed: number): string | undefined {
  if (process.env.SLIDE_IMAGE_PROVIDER !== "pollinations") return undefined;
  const enriched = `${prompt}, professional editorial photography, soft natural light, photorealistic, no text, no watermark, no syringe, no blood`;
  const token = process.env.POLLINATIONS_TOKEN ? `&token=${encodeURIComponent(process.env.POLLINATIONS_TOKEN)}` : "";
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(enriched)}?width=1080&height=1350&seed=${seed}&nologo=true&model=flux${token}`;
}

function seedFrom(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 900_000) + 100_000;
}

/** Texto completo do post como será publicado (slides + legenda + assinatura exibida no rodapé dos slides). */
function publishedText(draft: { slides: GeneratedSlide[]; caption: string }, profile: DoctorProfile): string {
  const slideText = draft.slides.map((s) => [s.kicker, s.headline, s.body, ...s.items].filter(Boolean).join("\n"));
  const signature = profile.crm ? `${profile.name} — ${profile.profession === "dentista" ? "CIRURGIÃO-DENTISTA" : "MÉDICO"} — ${profile.crm}` : "";
  return [...slideText, draft.caption, signature].filter(Boolean).join("\n\n");
}

/**
 * Pipeline: roteiro (IA) -> Crivo CFM/CFO -> evidências reais -> imagens -> post salvo.
 * Atualiza o progresso do job a cada etapa para o polling da interface.
 */
export async function runCarouselJob(store: Store, job: JobRecord): Promise<void> {
  const step = (progress: number, label: string) =>
    store.updateJob(job.id, { status: "running", progress, step: label });

  try {
    const profile = (await store.getProfile()) ?? EMPTY_PROFILE;

    await step(10, "Escrevendo o roteiro do carrossel");
    const generation = await generatePost(job.input, profile);
    if (generation.usage && generation.model) {
      await store.logUsage({ jobId: job.id, model: generation.model, ...generation.usage });
    }
    const { post } = generation;

    await step(60, `Revisando no Crivo (${councilLabel(profile)})`);
    const audit = HealthcareComplianceEngine.audit(publishedText(post, profile), {
      profession: profile.profession,
      doctorName: profile.name,
      crm: profile.crm,
      hasRqe: Boolean(profile.rqe),
    });

    await step(72, "Buscando evidências científicas");
    const evidence = (await ConsensusScientificEngine.searchEvidence(post.evidenceQuery || job.input.topic)).slice(0, 3);

    await step(86, "Preparando imagens");
    const slides: PostSlide[] = post.slides.map((s, i) => ({
      ...s,
      number: i + 1,
      imageUrl: s.imagePrompt ? imageUrlFor(s.imagePrompt, seedFrom(`${job.id}-${i}`)) : undefined,
    }));

    const draft: PostDraft = {
      topic: job.input.topic,
      framework: post.framework,
      angle: post.angle,
      slides,
      caption: post.caption,
      cta: post.cta,
      audit,
      evidence,
      generatedBy: { source: generation.source, model: generation.model, fallbackReason: generation.fallbackReason },
    };

    const saved = await store.createPost(job.input.topic, draft);
    const note = generation.source === "heuristica" ? ` (modelo de contingência: ${generation.fallbackReason})` : "";
    await store.updateJob(job.id, { status: "done", progress: 100, step: `Pronto${note}`, postId: saved.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha inesperada na geração.";
    console.error(`Job ${job.id} falhou:`, err);
    await store.updateJob(job.id, { status: "failed", step: "Falhou", error: message }).catch(() => undefined);
  }
}
