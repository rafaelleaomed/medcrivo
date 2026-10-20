"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { CAREER_STAGE_LABELS, firstName } from "@/lib/profile";
import { Seal } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { STUDIO_TOOLS } from "@/config/tools";
import { ToolFolders } from "@/components/dashboard/ToolFolders";
import type { DashboardSummary } from "@/app/api/dashboard/summary/route";
import { STUDIO_ROUTES } from "./routes";
import { useStudio } from "./StudioProvider";

/** Contagens reais do usuário; null vira "—" (nunca um número estimado). */
function useSummary(): DashboardSummary | null {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((d) => live && d?.success && setSummary(d.summary))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  return summary;
}

function Metric({ label, value, suffix }: { label: string; value: number | null | undefined; suffix?: string }) {
  return (
    <div className="mc-cell flex min-h-36 flex-col justify-between p-5 sm:p-6">
      <span className="mc-kicker">{label}</span>
      <span className="mc-display text-5xl sm:text-6xl">
        {value === null || value === undefined ? "—" : value}
        {suffix && value !== null && value !== undefined && <span className="mc-accent">{suffix}</span>}
      </span>
    </div>
  );
}

export function StudioHome() {
  const { profile, topic, setTopic, generate, isLoading, suggestedTopics, startFromTopic, postDraft, audit } = useStudio();
  const summary = useSummary();
  const name = firstName(profile.name);
  const isStudent = profile.careerStage === "estudante";
  const readyTools = STUDIO_TOOLS.filter((t) => t.status === "pronto").length;

  return (
    <div className="-mx-4 sm:mx-0">
      {/* Abertura */}
      <section className="mc-grid grid-cols-1 lg:grid-cols-12" aria-labelledby="home-title">
        <div className="mc-cell p-6 sm:p-10 lg:col-span-8">
          <p className="mc-kicker">
            {BRAND.product} · {CAREER_STAGE_LABELS[profile.careerStage]}
          </p>
          <h1 id="home-title" className="mc-display mt-6 text-6xl sm:text-8xl">
            Olá,
            <br />
            <span className="mc-accent">{name ? `${isStudent ? "" : "Dr(a). "}${name}` : "bem-vindo(a)"}</span>
          </h1>

          <form
            className="mt-10 flex border border-[var(--border-subtle)] bg-[var(--bg-card)] focus-within:border-teal-600 dark:focus-within:border-lima"
            onSubmit={(e) => {
              e.preventDefault();
              void generate();
            }}
          >
            <label htmlFor="home-topic" className="sr-only">
              Tema ou link de notícia
            </label>
            <input
              id="home-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema ou link de notícia"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="inline-flex items-center gap-2 bg-pinho px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-marfim transition-colors hover:bg-teal-800 disabled:opacity-40 dark:bg-lima dark:text-pinho dark:hover:bg-[#c9e35f] cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Criar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>

        <div className="mc-cell relative flex min-h-56 flex-col justify-between overflow-hidden bg-pinho p-6 text-marfim sm:p-8 lg:col-span-4">
          <div aria-hidden className="mc-dots pointer-events-none absolute inset-0 text-marfim opacity-[0.12]" />
          <p className="mc-kicker relative !text-marfim/70 before:!bg-lima">Crivo</p>
          <div className="relative space-y-4">
            <Seal />
            <p className="font-serif text-2xl italic leading-snug">{BRAND.tagline}</p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section aria-label="Números" className="mc-grid grid-cols-2 border-t-0 lg:grid-cols-4">
        <Metric label="Posts" value={summary?.posts} />
        <Metric label="Aprovados" value={summary?.approved} />
        <Metric label="Pautas" value={summary?.ideas} />
        <Metric label="Stories" value={summary?.stories} />
      </section>

      {/* Ferramentas */}
      <section aria-labelledby="tools-title">
        <div className="mc-grid grid-cols-12 border-t-0">
          <h2 id="tools-title" className="mc-cell mc-display col-span-8 p-6 text-5xl sm:p-8 sm:text-6xl">
            Ferramentas
          </h2>
          <div className="mc-cell col-span-4 flex flex-col items-end justify-end p-6 sm:p-8">
            <span className="mc-kicker">Prontas</span>
            <span className="mc-display mt-2 text-5xl">
              {readyTools}
              <span className="mc-accent">/{STUDIO_TOOLS.length}</span>
            </span>
          </div>
        </div>
        <ToolFolders />
      </section>

      {/* Último post */}
      {postDraft && (
        <section aria-label="Último post" className="mc-grid grid-cols-1 border-t-0 sm:grid-cols-12">
          <div className="mc-cell p-6 sm:col-span-9">
            <p className="mc-kicker">Último post</p>
            <p className="mt-3 text-lg font-bold">{postDraft.slides[0]?.headline ?? postDraft.topic}</p>
          </div>
          <Link
            href={STUDIO_ROUTES.carousel}
            className="mc-cell flex items-center justify-between gap-3 p-6 transition-colors hover:bg-[var(--bg-card-subtle)] sm:col-span-3"
          >
            <span className="mc-display text-4xl">
              {audit ? audit.score : "—"}
              <span className="mc-accent text-2xl">/100</span>
            </span>
            <ArrowUpRight className="h-5 w-5" aria-hidden />
            <span className="sr-only">Abrir o último post</span>
          </Link>
        </section>
      )}

      {/* Pautas sugeridas */}
      {suggestedTopics.length > 0 && (
        <section aria-labelledby="topics-title">
          <div className="mc-grid grid-cols-1 border-t-0">
            <h2 id="topics-title" className="mc-cell mc-display p-6 text-5xl sm:p-8 sm:text-6xl">
              Pautas
            </h2>
          </div>
          <ul className="mc-grid grid-cols-1 border-t-0 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedTopics.map((t) => (
              <li key={t.name} className="mc-cell">
                <button
                  type="button"
                  onClick={() => startFromTopic(t.name)}
                  className="group flex h-full w-full flex-col gap-4 p-6 text-left transition-colors hover:bg-[var(--bg-card-subtle)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600 cursor-pointer"
                >
                  <span className="mc-kicker">{t.category}</span>
                  <span className="flex items-start justify-between gap-4 font-semibold">
                    {t.name}
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
