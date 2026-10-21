import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStore, unauthorized } from "@/lib/store";
import { PostStatusSchema } from "@/lib/planner/planner";
import { badRequest, failure, notFound, readJson } from "@/lib/planner/http";

type Params = { params: Promise<{ id: string }> };

const IdSchema = z.uuid();
const PatchSchema = z.object({ status: PostStatusSchema });

/** Rascunho completo do post (reabrir depois de recarregar a página). */
export async function GET(_req: NextRequest, { params }: Params) {
  const store = await getStore();
  if (!store) return unauthorized();
  const id = IdSchema.safeParse((await params).id);
  if (!id.success) return notFound();

  try {
    const post = await store.getPost(id.data);
    return post ? NextResponse.json({ success: true, post }) : notFound();
  } catch (err) {
    return failure("Abrir post", err);
  }
}

/** Muda o status (rascunho, aprovado, agendado, publicado). */
export async function PATCH(req: NextRequest, { params }: Params) {
  const store = await getStore();
  if (!store) return unauthorized();
  const id = IdSchema.safeParse((await params).id);
  if (!id.success) return notFound();
  const body = PatchSchema.safeParse(await readJson(req));
  if (!body.success) return badRequest(body.error);

  try {
    const post = await store.updatePostStatus(id.data, body.data.status);
    return post ? NextResponse.json({ success: true, post }) : notFound();
  } catch (err) {
    return failure("Atualizar post", err);
  }
}
