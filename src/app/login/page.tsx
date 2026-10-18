import { Suspense } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

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
        <p className="mt-1 text-sm text-slate-500">Entre ou crie sua conta para gerar conteúdo médico revisado pelo {BRAND.auditorName}.</p>

        {!configured ? (
          <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-900 dark:text-amber-200">
            Autenticação desativada: o app está em <strong>modo local</strong> (Supabase não configurado).{" "}
            <Link href="/" className="underline font-medium">
              Ir para o estúdio
            </Link>
          </div>
        ) : (
          <LoginForm
            status={
              <Suspense fallback={null}>
                <StatusMessage searchParams={searchParams} />
              </Suspense>
            }
          />
        )}
      </div>
    </main>
  );
}
