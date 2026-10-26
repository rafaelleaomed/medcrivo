import type { ReactNode } from "react";
import Link from "next/link";
import { login } from "./actions";

const INPUT = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

/** Entrada privada: não existe cadastro público. */
export function LoginForm({ status }: { status: ReactNode }) {
  return (
    <div className="mt-6">
      <form action={login} className="space-y-3">
        {status}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={INPUT} />
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          aria-describedby="password-hint"
          className={INPUT}
        />
        <p id="password-hint" className="text-xs text-slate-500">
          Mínimo de 8 caracteres.
        </p>
        <p className="text-right text-xs">
          <Link href="/esqueci-senha" className="text-teal-700 underline dark:text-lima">
            Esqueci minha senha
          </Link>
        </p>
        <button type="submit" className="w-full rounded-lg bg-[#123C36] hover:bg-[#0F4F48] dark:bg-[#D6EF72] dark:hover:bg-[#c7e35f] px-3 py-2 text-sm font-semibold text-white dark:text-[#123C36] transition-colors">
          Entrar
        </button>
      </form>
    </div>
  );
}
