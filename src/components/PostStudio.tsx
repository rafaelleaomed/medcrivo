"use client";

import React, { useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Copy, Loader2, MessageCircle, ShieldAlert, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { BRAND } from "@/config/brand";
import type { PostDraft } from "@/lib/content/schema";
import { councilLabel, type DoctorProfile } from "@/lib/profile";
import { SlideCanvas } from "./slides/SlideTemplates";

export interface JobProgress {
  status: "queued" | "running" | "done" | "failed";
  progress: number;
  step: string;
  error: string | null;
}

const FRAMEWORK_LABELS: Record<PostDraft["framework"], string> = {
  mito_desfeito: "Mito desfeito",
  sintoma_silencioso: "Sintoma silencioso",
  erro_comum: "Erro que muitos cometem",
  checklist: "Checklist / guia prático",
  caso_anonimizado: "Caso anonimizado",
  norma_pode_nao_pode: "Norma: pode e não pode",
  passo_a_passo: "Passo a passo",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 border border-[var(--border-subtle)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-[var(--bg-card-subtle)] cursor-pointer"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export function GenerationProgress({ job }: { job: JobProgress }) {
  const failed = job.status === "failed";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`border p-4 ${failed ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"}`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        {failed ? <TriangleAlert className="h-4 w-4 text-rose-600" /> : <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-lima" />}
        {failed ? `Não foi possível gerar: ${job.error ?? "erro desconhecido"}` : job.step}
        {!failed && <span className="ml-auto font-mono text-[11px] text-[var(--text-muted)]">{Math.round(job.progress)}%</span>}
      </div>
      {!failed && (
        <div className="mt-3 h-1 w-full overflow-hidden bg-[var(--bg-card-subtle)]">
          <div className="h-full bg-teal-600 transition-all duration-500 dark:bg-lima" style={{ width: `${Math.max(job.progress, 4)}%` }} />
        </div>
      )}
    </div>
  );
}

/** Bloco do painel lateral: célula com rótulo mono e ação opcional à direita. */
function Panel({ label, action, children, tone }: { label: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; tone?: "ok" | "warn" }) {
  return (
    <div className={`mc-cell p-5 ${tone === "ok" ? "bg-teal-50/60 dark:bg-marfim/5" : tone === "warn" ? "bg-amber-50/70 dark:bg-amber-950/20" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="mc-kicker">{label}</h3>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function PostStudio({ draft, profile }: { draft: PostDraft; profile: DoctorProfile }) {
  const [index, setIndex] = useState(0);
  const slide = draft.slides[index];
  const total = draft.slides.length;
  const { audit } = draft;
  const council = councilLabel(profile);

  return (
    <section aria-labelledby="post-studio-title" className="-mx-4 sm:mx-0">
      <header className="mc-grid grid-cols-1 sm:grid-cols-12">
        <div className="mc-cell p-5 sm:col-span-9">
          <p className="mc-kicker">{FRAMEWORK_LABELS[draft.framework]}</p>
          <h2 id="post-studio-title" className="mt-2 text-lg font-bold">
            {draft.topic}
          </h2>
        </div>
        <div className="mc-cell flex items-center gap-2 p-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:col-span-3 sm:justify-end">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {draft.generatedBy.source === "claude" ? (draft.generatedBy.model ?? "Claude") : "Sem IA (reserva)"}
        </div>
      </header>

      <div className="mc-grid grid-cols-1 border-t-0 lg:grid-cols-[minmax(0,440px)_1fr]">
        {/* Slides */}
        <div className="mc-cell p-5">
          <SlideCanvas slide={slide} total={total} profile={profile} className="shadow-lg" />
          <div className="mt-3 flex items-center justify-between">
            <button type="button" aria-label="Slide anterior" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className="p-2 hover:bg-[var(--bg-card-subtle)] disabled:opacity-30">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button type="button" aria-label="Próximo slide" disabled={index === total - 1} onClick={() => setIndex((i) => i + 1)} className="p-2 hover:bg-[var(--bg-card-subtle)] disabled:opacity-30">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {draft.slides.map((s, i) => (
              <button
                key={s.number}
                type="button"
                aria-label={`Ir para o slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`overflow-hidden ring-2 ${i === index ? "ring-teal-600 dark:ring-lima" : "ring-transparent"}`}
              >
                <SlideCanvas slide={s} total={total} profile={profile} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid content-start">
          {/* Crivo */}
          <Panel
            tone={audit.isApproved ? "ok" : "warn"}
            label={
              <span className="inline-flex items-center gap-1.5">
                {audit.isApproved ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-700 dark:text-lima" aria-hidden />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" aria-hidden />
                )}
                {BRAND.auditorName} · {audit.isApproved ? "sem bloqueios" : "revisar"}
              </span>
            }
            action={
              <span className="mc-display text-3xl">
                {audit.score}
                <span className="mc-accent text-lg">/100</span>
              </span>
            }
          >
            {audit.infractions.length > 0 && (
              <ul className="space-y-2 text-sm">
                {audit.infractions.map((inf, i) => (
                  <li key={i} className="border-l-2 border-amber-500 bg-[var(--bg-card)] p-2">
                    <span className="font-semibold">{inf.severity === "CRITICAL" ? "Crítico" : inf.severity === "WARNING" ? "Atenção" : "Info"}:</span> “
                    {inf.detectedText}” — {inf.reason}
                    <div className="text-xs text-[var(--text-muted)]">
                      {inf.legalReference}
                      {inf.sourceUrl && (
                        <>
                          {" · "}
                          <a href={inf.sourceUrl} target="_blank" rel="noreferrer" className="font-medium underline">
                            Fonte oficial
                          </a>
                        </>
                      )}
                      {" · Sugestão: "}
                      {inf.suggestion}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!profile.crm && profile.careerStage !== "estudante" && <p className="mt-2 text-xs">Falta o {council} no perfil: a identificação é obrigatória.</p>}
            <p className="mt-2 text-[11px] text-[var(--text-muted)]">Triagem automática; não é parecer do conselho.</p>
          </Panel>

          {/* Legenda */}
          <Panel label="Legenda" action={<CopyButton text={draft.caption} label="Copiar" />}>
            <p className="whitespace-pre-line text-sm">{draft.caption}</p>
          </Panel>

          {/* Funil Comente PALAVRA */}
          <Panel
            label={
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Comente {draft.cta.keyword}
              </span>
            }
            action={<CopyButton text={draft.cta.dmMessage} label="Copiar DM" />}
          >
            <p className="text-sm font-semibold">{draft.cta.leadMagnetTitle}</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-[var(--text-muted)]">
              {draft.cta.leadMagnetOutline.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <p className="mt-3 border-l-2 border-teal-600 pl-3 text-sm dark:border-lima">{draft.cta.dmMessage}</p>
          </Panel>

          {/* Evidências */}
          <Panel
            label={
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" aria-hidden /> Evidências
              </span>
            }
          >
            {draft.evidence.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">Nenhuma encontrada. O post não cita estudos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {draft.evidence.map((p, i) => (
                  <li key={i}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="font-medium underline">
                        {p.title}
                      </a>
                    ) : (
                      <span className="font-medium">{p.title}</span>
                    )}
                    <div className="text-xs text-[var(--text-muted)]">{p.citationAbnt}</div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </section>
  );
}
