import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { updatePassword } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false, follow: false } };

const INPUT = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

type SearchParams = Promise<{ erro?: string }>;

/** Só quem chegou pelo link do e-mail (sessão de recuperação aberta) vê o formulário. */
async function Form({ searchParams }: { searchParams: SearchParams }) {
  const { data } = await (await createClient()).auth.getClaims();
  if (!data?.claims?.sub) redirect("/login?erro=confirmacao");
  const { erro } = await searchParams;
  return (
    <form action={updatePassword} className="mt-4 space-y-3">
      {erro && (
        <p role="status" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
          {erro === "dados" ? "As senhas precisam ser iguais e ter pelo menos 8 caracteres." : "Não foi possível salvar a nova senha. Peça um novo link."}
        </p>
      )}
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
        Nova senha
      </label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={INPUT} />
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirm">
        Repita a nova senha
      </label>
      <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={INPUT} />
      <p className="text-xs text-slate-500">Mínimo de 8 caracteres.</p>
      <button type="submit" className="w-full rounded-lg bg-[#123C36] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F4F48] dark:bg-[#D6EF72] dark:text-[#123C36] dark:hover:bg-[#c7e35f]">
        Salvar nova senha
      </button>
    </form>
  );
}

export default function RedefinirSenhaPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F2E9] px-4 dark:bg-[#0C1F1C]">
      <div className="w-full max-w-sm rounded-2xl border border-[#E2DDD0] bg-white p-6 shadow-sm dark:border-[#23463F] dark:bg-[#132D29]">
        <h1 className="text-2xl">
          <BrandMark size={34} />
        </h1>
        <h2 className="mt-4 text-lg font-bold">Crie uma nova senha</h2>
        <Suspense fallback={null}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
