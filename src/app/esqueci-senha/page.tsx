import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { requestPasswordReset } from "@/app/login/actions";

export const metadata: Metadata = { title: "Esqueci minha senha", robots: { index: false, follow: false } };

const INPUT = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

type SearchParams = Promise<{ erro?: string; aviso?: string }>;

async function Status({ searchParams }: { searchParams: SearchParams }) {
  const { erro, aviso } = await searchParams;
  if (aviso === "enviado") {
    return (
      <p role="status" className="rounded-lg bg-teal-50 p-3 text-sm text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
        Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Confira também a caixa de spam.
      </p>
    );
  }
  if (erro) {
    return (
      <p role="status" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
        Informe um e-mail válido.
      </p>
    );
  }
  return null;
}

export default function EsqueciSenhaPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F2E9] px-4 dark:bg-[#0C1F1C]">
      <div className="w-full max-w-sm rounded-2xl border border-[#E2DDD0] bg-white p-6 shadow-sm dark:border-[#23463F] dark:bg-[#132D29]">
        <h1 className="text-2xl">
          <BrandMark size={34} />
        </h1>
        <h2 className="mt-4 text-lg font-bold">Esqueci minha senha</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.</p>
        <form action={requestPasswordReset} className="mt-4 space-y-3">
          <Suspense fallback={null}>
            <Status searchParams={searchParams} />
          </Suspense>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
            E-mail
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className={INPUT} />
          <button type="submit" className="w-full rounded-lg bg-[#123C36] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F4F48] dark:bg-[#D6EF72] dark:text-[#123C36] dark:hover:bg-[#c7e35f]">
            Enviar link
          </button>
        </form>
        <p className="mt-4 text-center text-xs">
          <Link href="/login" className="text-teal-700 underline dark:text-lima">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
