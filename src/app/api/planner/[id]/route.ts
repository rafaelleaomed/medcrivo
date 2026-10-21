import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStore, unauthorized } from "@/lib/store";
import { PlannerItemPatchSchema } from "@/lib/planner/planner";
import { badRequest, failure, notFound, readJson } from "@/lib/planner/http";
import { syncPostStatus } from "@/lib/planner/sync";

type Params = { params: Promise<{ id: string }> };

const IdSchema = z.uuid();

/** Muda data/hora (arrastar), título, formato, nota, vínculo com post ou status. */
export async function PATCH(req: NextRequest, { params }: Params) {
  const store = await getStore();
  if (!store) return unauthorized();
  const id = IdSchema.safeParse((await params).id);
  if (!id.success) return notFound();
  const patch = PlannerItemPatchSchema.safeParse(await readJson(req));
  if (!patch.success) return badRequest(patch.error);

  try {
    const item = await store.updatePlannerItem(id.data, patch.data);
    if (!item) return notFound();
    if (patch.data.status || patch.data.postId) await syncPostStatus(store, item);
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return failure("Atualizar agendamento", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const store = await getStore();
  if (!store) return unauthorized();
  const id = IdSchema.safeParse((await params).id);
  if (!id.success) return notFound();

  try {
    const removed = await store.deletePlannerItem(id.data);
    if (!removed) return notFound();
    await syncPostStatus(store, removed, true);
    return NextResponse.json({ success: true });
  } catch (err) {
    return failure("Remover agendamento", err);
  }
}
