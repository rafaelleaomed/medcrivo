import { NextRequest, NextResponse } from "next/server";
import { AssistantInputSchema, conversationTitle, type ConversationPayload, type StoredMessage } from "@/lib/creator/assistant";
import { replyAssistant } from "@/lib/creator/generate";
import { badRequest, creatorContext, failure, listOrGet, logUsage, notFound } from "@/lib/creator/route";
import { getItemStore } from "@/lib/store/items";
import { unauthorized } from "@/lib/store";

export const maxDuration = 120;

/** Conversas longas ficam com as mensagens mais recentes. */
const MAX_STORED = 80;

export function GET(req: NextRequest) {
  return listOrGet(req, "chat");
}

export async function POST(req: NextRequest) {
  const parsed = AssistantInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error);
  const ctx = await creatorContext();
  if (!ctx.ok) return ctx.response;

  try {
    const { conversationId, message } = parsed.data;
    const existing = conversationId ? await ctx.items.get<ConversationPayload>(conversationId, "chat") : null;
    if (conversationId && !existing) return notFound();

    const now = new Date().toISOString();
    const history: StoredMessage[] = [...(existing?.payload.messages ?? []), { role: "user", content: message, at: now }];
    const { data: turn, generatedBy, usage } = await replyAssistant(
      history.map(({ role, content }) => ({ role, content })),
      ctx.profile,
    );
    await logUsage(ctx.store, usage);

    const { reply, ...rest } = turn;
    const messages = [...history, { role: "assistant" as const, content: reply, turn: rest, generatedBy, at: new Date().toISOString() }].slice(
      -MAX_STORED,
    );
    const item = existing
      ? await ctx.items.update<ConversationPayload>(existing.id, { payload: { messages } })
      : await ctx.items.create<ConversationPayload>("chat", conversationTitle(message), { messages });
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return failure("Assistente", err);
  }
}

export async function DELETE(req: NextRequest) {
  const items = await getItemStore();
  if (!items) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return badRequest("Informe a conversa.");
  await items.remove(id, "chat");
  return NextResponse.json({ success: true });
}
