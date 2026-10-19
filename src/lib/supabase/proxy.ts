import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./config";

/** Só o estúdio e o onboarding exigem login; o site (landing, Crivo grátis, checklist, planos, termos) é público. */
const PROTECTED_PREFIX = "/app";
const PROTECTED_PREFIXES = [PROTECTED_PREFIX, "/onboarding"];

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  // Modo local (sem Supabase): nada a renovar nem proteger.
  if (!env) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  // Não colocar código entre createServerClient e getClaims (renovação de sessão).
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // APIs respondem 401 sozinhas; o estúdio redireciona para o login.
  if (!isAuthenticated && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  // Quem já entrou e abre o login vai direto para o estúdio.
  if (isAuthenticated && pathname === "/login") {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = PROTECTED_PREFIX;
    appUrl.search = "";
    return NextResponse.redirect(appUrl);
  }

  return supabaseResponse;
}
