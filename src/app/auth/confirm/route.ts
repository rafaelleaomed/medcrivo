import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino do link de confirmação de e-mail.
 * - `?code=` : fluxo PKCE (padrão do @supabase/ssr com o template de e-mail padrão).
 * - `?token_hash=&type=` : template de e-mail customizado com {{ .TokenHash }}.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Redireciona sem o código/token na URL.
  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  const supabase = await createClient();
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  // Só destinos internos conhecidos: evita redirecionar para um endereço escolhido por terceiros.
  const next = searchParams.get("next");
  const destination = next === "/redefinir-senha" ? next : "/app";

  if (ok) {
    redirectTo.pathname = destination;
    return NextResponse.redirect(redirectTo);
  }
  redirectTo.pathname = "/login";
  redirectTo.searchParams.set("erro", "confirmacao");
  return NextResponse.redirect(redirectTo);
}
