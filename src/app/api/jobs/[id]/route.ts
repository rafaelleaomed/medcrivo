import { NextRequest, NextResponse } from "next/server";
import { getStore, unauthorized } from "@/lib/store";

/** Estado do job; quando concluído, inclui o rascunho do post. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const store = await getStore();
  if (!store) return unauthorized();

  const { id } = await params;
  const job = await store.getJob(id);
  if (!job) return NextResponse.json({ success: false, error: "Job não encontrado." }, { status: 404 });

  const post = job.status === "done" && job.postId ? await store.getPost(job.postId) : null;
  return NextResponse.json({
    success: true,
    job: { id: job.id, status: job.status, progress: job.progress, step: job.step, error: job.error },
    post,
  });
}
