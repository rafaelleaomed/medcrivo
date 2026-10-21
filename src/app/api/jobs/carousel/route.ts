import { NextRequest, NextResponse, after } from "next/server";
import { guardUser } from "@/lib/guard";
import { getStore, unauthorized } from "@/lib/store";
import { CarouselJobInputSchema } from "@/lib/store/types";
import { runCarouselJob } from "@/lib/jobs/carouselPipeline";

// A geração roda depois da resposta (after) e precisa de tempo para IA + busca + imagens.
export const maxDuration = 300;

/** Cria um job de carrossel e responde na hora com o id; o cliente acompanha por GET /api/jobs/:id. */
export async function POST(req: NextRequest) {
  const blocked = await guardUser("job", 5);
  if (blocked) return blocked;
  const store = await getStore();
  if (!store) return unauthorized();

  const parsed = CarouselJobInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Pedido inválido." }, { status: 400 });
  }

  const job = await store.createJob(parsed.data);
  after(() => runCarouselJob(store, job));

  return NextResponse.json({ success: true, jobId: job.id }, { status: 202 });
}
