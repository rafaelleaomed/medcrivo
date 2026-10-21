import { NextRequest, NextResponse } from "next/server";
import { getStore, unauthorized } from "@/lib/store";
import { PlannerItemInputSchema, PlannerRangeSchema } from "@/lib/planner/planner";
import { badRequest, failure, readJson } from "@/lib/planner/http";
import { syncPostStatus } from "@/lib/planner/sync";

/** Agendamentos no intervalo visível do calendário: `?from=&to=` (ISO). */
export async function GET(req: NextRequest) {
  const store = await getStore();
  if (!store) return unauthorized();
  const range = PlannerRangeSchema.safeParse({
    from: req.nextUrl.searchParams.get("from"),
    to: req.nextUrl.searchParams.get("to"),
  });
  if (!range.success) return badRequest(range.error);

  try {
    const items = await store.listPlannerItems(range.data.from, range.data.to);
    return NextResponse.json({ success: true, items });
  } catch (err) {
    return failure("Listar planner", err);
  }
}

/** Agenda um post salvo (`postId`) ou um item livre. Não publica no Instagram. */
export async function POST(req: NextRequest) {
  const store = await getStore();
  if (!store) return unauthorized();
  const input = PlannerItemInputSchema.safeParse(await readJson(req));
  if (!input.success) return badRequest(input.error);

  try {
    const item = await store.createPlannerItem(input.data);
    await syncPostStatus(store, item);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err) {
    return failure("Criar agendamento", err);
  }
}
