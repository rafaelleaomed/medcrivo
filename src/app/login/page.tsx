import { Suspense } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { login, signup } from "./actions";

const MESSAGES: Record<string, string> = {
  dados: "Informe um e-mail válido e uma senha com pelo menos 8 caracteres.",
  credenciais: "E-mail ou senha incorretos.",
  cadastro: "Não foi possível criar a conta. Tente outro e-mail.",
  "confirme-email": "Enviamos um link de confirmação para o seu e-mail.",
  confirmacao: "O link de confirmação é inválido ou expirou.",
};

type LoginSearchParams = Promise<{ erro?: string; aviso?: string }>;

/** Mensagem de erro/aviso vinda da URL; isolada em Suspense para o resto da página ser pré-renderizado. */
async function StatusMessage({ searchParams }: { searchParams: LoginSearchParams }) {
  const { erro, aviso } = await searchParams;
  if (!erro && !aviso) return null;
  return (
    <p
      role="status"
      className={`rounded-lg p-3 text-sm ${erro ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200" : "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"}`}
    >
      {MESSAGES[erro ?? aviso ?? ""] ?? "Algo deu errado. Tente novamente."}
    </p>
  );
}

export default function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
  const configured = isSupabaseConfigured();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#090D15]">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1420] p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{BRAND.product}</h1>
        <p className="mt-1 text-sm text-slate-500">Entre para criar conteúdo médico revisado pelo {BRAND.auditorName}.</p>

        {!configured ? (
          <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-900 dark:text-amber-200">
            Autenticação desativada: o app está em <strong>modo local</strong> (Supabase não configurado).{" "}
            <Link href="/" className="underline font-medium">
              Ir para o estúdio
            </Link>
          </div>
        ) : (
          <form className="mt-6 space-y-3">
            <Suspense fallback={null}>
              <StatusMessage searchParams={searchParams} />
            </Suspense>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              E-mail
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm" />
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
              Senha
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm" />
            <div className="flex gap-2 pt-2">
              <button formAction={login} className="flex-1 rounded-lg bg-slate-900 dark:bg-white px-3 py-2 text-sm font-semibold text-white dark:text-slate-900">
                Entrar
              </button>
              <button formAction={signup} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-semibold">
                Criar conta
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
