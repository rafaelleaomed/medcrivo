import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unauthorized } from "@/lib/store";
import { getItemStore } from "@/lib/store/items";

const StatusSchema = z.enum(["pending", "approved", "changes"]);
const PayloadSchema = z.object({
  decisions: z.record(z.string().min(1), StatusSchema),
  feedback: z.record(z.string().min(1), z.string().max(2000)).default({}),
});

type ApprovalPayload = z.infer<typeof PayloadSchema>;
const TITLE = "Central editorial";

async function current() {
  const store = await getItemStore();
  if (!store) return null;
  const [summary] = await store.list("approvals", 1);
  const item = summary ? await store.get<ApprovalPayload>(summary.id, "approvals") : null;
  return { store, item };
}

export async function GET() {
  try {
    const ctx = await current();
    if (!ctx) return unauthorized();
    return NextResponse.json({ success: true, approvals: ctx.item?.payload ?? { decisions: {}, feedback: {} } });
  } catch (error) {
    console.error("[editorial-approvals:get]", error);
    return NextResponse.json({ success: false, error: "Não foi possível carregar as aprovações." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ctx = await current();
    if (!ctx) return unauthorized();
    const parsed = PayloadSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ success: false, error: "Decisão inválida." }, { status: 400 });
    const item = ctx.item
      ? await ctx.store.update(ctx.item.id, { title: TITLE, payload: parsed.data })
      : await ctx.store.create("approvals", TITLE, parsed.data);
    return NextResponse.json({ success: true, approvals: item?.payload ?? parsed.data });
  } catch (error) {
    console.error("[editorial-approvals:patch]", error);
    return NextResponse.json({ success: false, error: "Não foi possível salvar a decisão." }, { status: 500 });
  }
}
