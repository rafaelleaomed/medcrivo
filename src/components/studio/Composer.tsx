"use client";

import React from "react";
import { Globe, Link as LinkIcon, Loader2, PenLine, Search, Sparkles } from "lucide-react";
import { CAREER_STAGE_LABELS, requiresCouncilId, requiresRqe } from "@/lib/profile";
import { useStudio } from "./StudioProvider";

/** Barra de criação: identificação do autor + tema (ou link) + gerar. Usada nas telas de criação. */
export function Composer() {
  const { profile, setProfileOpen, topic, setTopic, generate, isLoading, suggestedTopics } = useStudio();
  const trimmed = topic.trim();
  const isUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://");

  const missingCrm = requiresCouncilId(profile) && !profile.crm.trim();
  const missingRqe = requiresRqe(profile) && !profile.rqe.trim();

  return (
    <section className="mc-grid -mx-4 grid-cols-1 border-t-0 sm:mx-0">
      <div className="mc-cell space-y-4 p-5 sm:p-6">
        {/* Identificação que vai no rodapé dos posts */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mc-kicker">
            {[profile.name.trim() || "Seu nome", CAREER_STAGE_LABELS[profile.careerStage], profile.crm, profile.careerStage === "especialista" && profile.rqe ? `RQE ${profile.rqe}` : ""]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-lima cursor-pointer"
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden />
            Editar
          </button>
        </div>

        {(missingCrm || missingRqe) && (
          <p className="border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {missingCrm ? "Falta o CRM/UF no perfil (vai no rodapé)." : "Falta o RQE para citar a especialidade."}
          </p>
        )}

        {/* Tema ou link */}
        <form
          className="flex border border-[var(--border-subtle)] bg-[var(--bg-card)] focus-within:border-teal-600 dark:focus-within:border-lima"
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">Tema clínico ou link de notícia/artigo</span>
            {isUrl ? (
              <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-lima" aria-hidden />
            ) : (
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
            )}
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tema ou link de notícia"
              className="h-14 w-full bg-transparent pl-11 pr-4 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading || !trimmed}
            className="inline-flex items-center gap-2 bg-pinho px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-marfim transition-colors hover:bg-teal-800 disabled:opacity-40 dark:bg-lima dark:text-pinho dark:hover:bg-[#c9e35f] cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
            {isLoading ? "Gerando" : "Gerar"}
          </button>
        </form>

        {isUrl && (
          <p className="flex items-center gap-2 text-xs text-teal-800 dark:text-lima">
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Usamos o título e o resumo da página como contexto.
          </p>
        )}

        {suggestedTopics.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestedTopics.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTopic(t.name)}
                className="shrink-0 border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-main)] transition-colors hover:border-teal-600 dark:hover:border-lima cursor-pointer"
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
