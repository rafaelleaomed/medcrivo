import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type DashboardSummary = {
  /** null = sem como medir (ex.: modo local). Nunca preencher com estimativa. */
  posts: number | null;
  approved: number | null;
  ideas: number | null;
  stories: number | null;
};

const EMPTY: DashboardSummary = { posts: null, approved: null, ideas: null, stories: null };

/** Contagens reais do usuário para o painel. RLS garante que só as linhas dele entram na conta. */
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ success: true, summary: EMPTY });

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return NextResponse.json({ success: false, error: "Sessão expirada. Entre novamente." }, { status: 401 });
  }

  const count = async (table: "posts" | "studio_items", filter?: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => {
    const q = filter ? filter(base(table)) : base(table);
    const { count: n, error } = await q;
    return error ? null : (n ?? 0);
  };
  function base(table: "posts" | "studio_items") {
    return supabase.from(table).select("id", { count: "exact", head: true });
  }

  const [posts, approved, ideas, stories] = await Promise.all([
    count("posts"),
    count("posts", (q) => q.eq("compliance->>isApproved", "true")),
    count("studio_items", (q) => q.eq("kind", "ideas")),
    count("studio_items", (q) => q.eq("kind", "stories")),
  ]);

  return NextResponse.json({ success: true, summary: { posts, approved, ideas, stories } satisfies DashboardSummary });
}
