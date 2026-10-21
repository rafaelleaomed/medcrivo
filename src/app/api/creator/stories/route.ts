import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";
import { generateStories } from "@/lib/creator/generate";
import { badRequest, creatorContext, failure, listOrGet, logUsage } from "@/lib/creator/route";
import { StoriesInputSchema } from "@/lib/creator/stories";

export const maxDuration = 120;

export function GET(req: NextRequest) {
  return listOrGet(req, "stories");
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("stories", 10);
  if (blocked) return blocked;
  const parsed = StoriesInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error);
  const ctx = await creatorContext();
  if (!ctx.ok) return ctx.response;

  try {
    const { data: plan, generatedBy, usage } = await generateStories(parsed.data, ctx.profile);
    await logUsage(ctx.store, usage);
    const item = await ctx.items.create("stories", plan.title.slice(0, 120), { input: parsed.data, plan, generatedBy });
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return failure("Stories", err);
  }
}
