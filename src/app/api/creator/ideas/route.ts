import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";
import { generateIdeas } from "@/lib/creator/generate";
import { defaultTheme, IdeasInputSchema, SOURCE_LABELS } from "@/lib/creator/ideas";
import { badRequest, creatorContext, failure, listOrGet, logUsage } from "@/lib/creator/route";

export const maxDuration = 120;

export function GET(req: NextRequest) {
  return listOrGet(req, "ideas");
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("ideas", 10);
  if (blocked) return blocked;
  const parsed = IdeasInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error);
  const ctx = await creatorContext();
  if (!ctx.ok) return ctx.response;

  try {
    const input = parsed.data;
    const { data: ideas, generatedBy, usage } = await generateIdeas(input, ctx.profile);
    await logUsage(ctx.store, usage);
    const theme = input.theme || defaultTheme(ctx.profile);
    const payload = { input: { ...input, theme }, ideas, generatedBy };
    const item = await ctx.items.create("ideas", `${SOURCE_LABELS[input.source]}: ${theme}`.slice(0, 120), payload);
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return failure("Ideias", err);
  }
}
