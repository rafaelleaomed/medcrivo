import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { guardUser } from "@/lib/guard";
import { EMPTY_PROFILE } from "@/lib/profile";
import { getStore, unauthorized } from "@/lib/store";
import { generateRadar } from "@/lib/radar/generate";
import { fetchGoogleTrends, RadarResponseSchema, type GoogleTrend } from "@/lib/radar/radar";

export const maxDuration = 120;

const RequestSchema = z.object({
  exclude: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
});

function toIsoOrNull(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("radar", 12, 60_000);
  if (blocked) return blocked;

  const store = await getStore();
  if (!store) return unauthorized();
  const input = RequestSchema.safeParse(await req.json().catch(() => ({})));
  if (!input.success) return NextResponse.json({ success: false, error: "Histórico de pautas inválido." }, { status: 400 });

  const profile = (await store.getProfile()) ?? EMPTY_PROFILE;
  let trends: GoogleTrend[] = [];
  let trendsError = "";
  try {
    trends = await fetchGoogleTrends();
  } catch (error) {
    trendsError = error instanceof Error ? error.message : "Google Trends indisponível";
    console.warn("Radar: falha ao consultar Google Trends:", trendsError);
  }

  const now = new Date().toISOString();
  const radar = await generateRadar(profile, trends, input.data.exclude, now);
  const payload = RadarResponseSchema.parse({
    opportunities: radar.opportunities,
    generatedAt: now,
    trendsUpdatedAt: toIsoOrNull(trends[0]?.publishedAt),
    trendCount: trends.length,
    mode: radar.mode,
    note: trendsError ? "Google Trends indisponível nesta atualização; usamos o perfil para não inventar uma tendência." : radar.note,
  });
  return NextResponse.json({ success: true, radar: payload });
}
