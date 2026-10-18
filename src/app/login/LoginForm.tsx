"use client";

import { useState, type ReactNode } from "react";
import { login, signup } from "./actions";

type Mode = "entrar" | "criar";

const INPUT = "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

/** Abas separadas para login e cadastro: cada uma com um único botão e instruções próprias. */
export function LoginForm({ status }: { status: ReactNode }) {
  const [mode, setMode] = useState<Mode>("entrar");
  const isSignup = mode === "criar";

  return (
    <div className="mt-6">
      <div role="tablist" aria-label="Acesso" className="grid grid-cols-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-sm font-semibold">
        {(["entrar", "criar"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md py-1.5 transition-colors ${mode === m ? "bg-white dark:bg-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            {m === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form action={isSignup ? signup : login} className="mt-4 space-y-3">
        {status}
        {isSignup && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Informe seu e-mail e crie uma senha. Você receberá um link de confirmação por e-mail.
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={INPUT} />
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
          {isSignup ? "Crie uma senha" : "Senha"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          required
          aria-describedby="password-hint"
          className={INPUT}
        />
        <p id="password-hint" className="text-xs text-slate-500">
          Mínimo de 8 caracteres.
        </p>
        <button type="submit" className="w-full rounded-lg bg-[#123C36] hover:bg-[#0F4F48] dark:bg-[#D6EF72] dark:hover:bg-[#c7e35f] px-3 py-2 text-sm font-semibold text-white dark:text-[#123C36] transition-colors">
          {isSignup ? "Criar minha conta" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
