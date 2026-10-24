import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";
import { generateReels } from "@/lib/creator/generate";
import { badRequest, creatorContext, failure, listOrGet, logUsage } from "@/lib/creator/route";
import { ReelsInputSchema } from "@/lib/creator/reels";

export const maxDuration = 120;

export function GET(req: NextRequest) {
  return listOrGet(req, "reels");
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("reels", 10);
  if (blocked) return blocked;
  const parsed = ReelsInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error);
  const ctx = await creatorContext();
  if (!ctx.ok) return ctx.response;

  try {
    const { data, generatedBy, usage } = await generateReels(parsed.data, ctx.profile);
    await logUsage(ctx.store, usage);
    const item = await ctx.items.create("reels", `Roteiros: ${parsed.data.topic}`.slice(0, 120), {
      input: parsed.data,
      options: data.options,
      footer: data.footer,
      generatedBy,
    });
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return failure("Roteiros", err);
  }
}
