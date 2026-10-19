"use client";

import React from "react";
import { Globe, Link as LinkIcon, Loader2, PenLine, Search, Sparkles } from "lucide-react";
import { CAREER_STAGE_LABELS, requiresCouncilId, requiresRqe } from "@/lib/profile";
import { Button } from "@/components/ui";
import { useStudio } from "./StudioProvider";

/** Barra de criação: identificação do autor + tema (ou link) + gerar. Usada nas telas de criação. */
export function Composer() {
  const { profile, setProfileOpen, topic, setTopic, generate, isLoading, suggestedTopics } = useStudio();
  const trimmed = topic.trim();
  const isUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://");

  const missingCrm = requiresCouncilId(profile) && !profile.crm.trim();
  const missingRqe = requiresRqe(profile) && !profile.rqe.trim();

  return (
    <section className="rounded-3xl border border-[var(--border-subtle)] bg-white p-5 sm:p-6 dark:bg-[#132D29]">
      {/* Identificação que vai no rodapé dos posts */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-tinta dark:text-marfim">{profile.name.trim() || "Seu nome"}</span>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-marfim/10 dark:text-lima">
            {CAREER_STAGE_LABELS[profile.careerStage]}
          </span>
          {profile.crm && <span className="text-xs text-[var(--text-muted)]">{profile.crm}</span>}
          {profile.careerStage === "especialista" && profile.specialty && (
            <span className="text-xs text-[var(--text-muted)]">
              {profile.specialty}
              {profile.rqe ? ` · RQE ${profile.rqe}` : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-lima cursor-pointer"
        >
          <PenLine className="h-3.5 w-3.5" aria-hidden />
          Editar identificação
        </button>
      </div>

      {(missingCrm || missingRqe) && (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {missingCrm
            ? "Informe seu CRM/UF no perfil: ele entra no rodapé de identificação de cada post."
            : "Informe o RQE no perfil para anunciar a especialidade."}
        </p>
      )}

      {/* Tema ou link */}
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void generate();
        }}
      >
        <label className="relative flex-1">
          <span className="sr-only">Tema clínico ou link de notícia/artigo</span>
          {isUrl ? (
            <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-lima" aria-hidden />
          ) : (
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
          )}
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tema clínico (ex.: sinais de alerta do AVC) ou link de notícia/artigo"
            className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-main)] pl-10 pr-4 text-sm text-tinta placeholder:text-[var(--text-muted)] focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:bg-[#0C1F1C] dark:text-marfim"
          />
        </label>
        <Button type="submit" size="lg" disabled={isLoading || !trimmed} className="h-12">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
          {isLoading ? "Gerando…" : isUrl ? "Gerar a partir do link" : "Gerar conteúdo"}
        </Button>
      </form>

      {isUrl && (
        <p className="mt-3 flex items-start gap-2 text-xs text-teal-800 dark:text-lima">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Vamos ler o título e o resumo da página para servir de contexto e citar a publicação de origem.
        </p>
      )}

      {suggestedTopics.length > 0 && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Pautas sugeridas</span>
          {suggestedTopics.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setTopic(t.name)}
              className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-main)] px-3 py-1.5 text-xs text-tinta transition-colors hover:border-teal-600 hover:text-teal-800 dark:bg-[#0C1F1C] dark:text-marfim dark:hover:text-lima cursor-pointer"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
