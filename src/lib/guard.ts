import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getStore, unauthorized } from "@/lib/store";

type Bucket = { count: number; resetAt: number };
// Memória da instância: limita rajadas por usuário. Em serverless cada instância conta separado,
// então é um freio, não uma cota exata (a cota mensal por plano fica para a cobrança).
const buckets = new Map<string, Bucket>();

function hit(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  b.count += 1;
  return b.count > limit ? Math.ceil((b.resetAt - now) / 1000) : 0;
}

/** Exige login e aplica limite por usuário. Devolve a resposta de erro, ou null se pode seguir. */
export async function guardUser(scope: string, limit = 20, windowMs = 60_000): Promise<NextResponse | null> {
  let userId = "local";
  if (isSupabaseConfigured()) {
    const store = await getStore();
    if (!store) return unauthorized();
    const { data } = await (await createClient()).auth.getClaims();
    userId = data?.claims?.sub ?? "";
    if (!userId) return unauthorized();
  }
  const wait = hit(`${scope}:${userId}`, limit, windowMs);
  if (wait > 0) {
    return NextResponse.json(
      { success: false, error: "Muitas solicitações em pouco tempo. Aguarde um instante e tente de novo." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }
  return null;
}
