"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

type Step = { id: string; label: string; title: string; subtitle: string };

/**
 * Casca do onboarding no padrão do wizard do CreatorMed: topo fixo com logo, brilho radial,
 * stepper com linha de progresso, título + uma linha de apoio, cartão e rodapé fixo com Voltar/Continuar.
 */
export function WizardShell({
  steps,
  current,
  done,
  children,
  onBack,
  onNext,
  nextLabel = "Continuar",
  busy = false,
  error,
}: {
  steps: readonly Step[];
  current: number;
  done: boolean;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  busy?: boolean;
  error?: string | null;
}) {
  const step = steps[Math.min(current, steps.length - 1)];
  const progress = done ? 100 : (current / (steps.length - 1)) * 100;

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* brilho radial do topo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-80"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(22,121,111,0.14) 0%, transparent 70%)" }}
      />

      <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <BrandMark size={26} className="text-base" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {done ? "Pronto" : `${current + 1} / ${steps.length}`}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl space-y-8 px-6 pb-36 pt-10">
        {/* stepper */}
        <ol className="relative flex items-start" aria-label="Etapas">
          <div aria-hidden className="absolute left-[12%] right-[12%] top-[18px] h-0.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #16796F, #D6EF72)" }}
            />
          </div>
          {steps.map((s, i) => {
            const isDone = done || i < current;
            const isCurrent = !done && i === current;
            return (
              <li key={s.id} className="relative flex flex-1 flex-col items-center" aria-current={isCurrent ? "step" : undefined}>
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-bold ring-4 transition-all duration-300",
                    isDone && "bg-teal-600 text-marfim ring-teal-600/15 dark:bg-lima dark:text-pinho",
                    isCurrent && "scale-110 bg-pinho text-lima shadow-lg shadow-teal-900/25 ring-teal-600/20 dark:bg-lima dark:text-pinho",
                    !isDone && !isCurrent && "bg-[var(--bg-card)] text-[var(--text-muted)] ring-transparent border border-[var(--border-subtle)]",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "mt-2 text-center text-[11px] font-semibold",
                    isCurrent || isDone ? "text-[var(--text-main)]" : "text-[var(--text-muted)]",
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {!done && (
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{step.title}</h1>
            <p className="mx-auto max-w-md text-sm text-[var(--text-muted)]">{step.subtitle}</p>
          </div>
        )}

        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          {children}
        </section>
      </main>

      {/* rodapé fixo */}
      <div className="fixed inset-x-0 bottom-0 z-20">
        <div aria-hidden className="h-10 bg-gradient-to-t from-[var(--bg-main)] to-transparent" />
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
              </button>
            ) : (
              <span />
            )}
            <p role="alert" className="flex-1 text-right text-xs font-semibold text-rose-700 dark:text-rose-300">
              {error}
            </p>
            <button
              type="button"
              onClick={onNext}
              disabled={busy}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-pinho px-6 text-sm font-bold text-marfim transition-colors hover:bg-teal-800 disabled:opacity-60 dark:bg-lima dark:text-pinho cursor-pointer"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {nextLabel}
              {!busy && <ArrowRight className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
