import { NextResponse } from "next/server";
import { authorizedUserId } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { createLocalStore } from "./local";
import { createSupabaseStore } from "./supabase";
import type { Store } from "./types";

export type { Store } from "./types";

/**
 * Store do usuário da requisição atual.
 * - Supabase configurado: exige sessão válida (retorna null se não houver).
 * - Sem Supabase: usuário local único, só para desenvolvimento.
 */
export async function getStore(): Promise<Store | null> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Supabase é obrigatório em produção: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
    }
    return createLocalStore();
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = authorizedUserId(data?.claims);
  if (!userId) return null;
  return createSupabaseStore(supabase, userId);
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: "Acesso não autorizado." }, { status: 401 });
}
