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
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export function GenerationProgress({ job }: { job: JobProgress }) {
  const failed = job.status === "failed";
  return (
    <div role="status" aria-live="polite" className={`rounded-2xl border p-4 ${failed ? "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0E1420]"}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        {failed ? <TriangleAlert className="h-4 w-4 text-rose-600" /> : <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
        {failed ? `Não foi possível gerar: ${job.error ?? "erro desconhecido"}` : job.step}
      </div>
      {!failed && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${Math.max(job.progress, 4)}%` }} />
        </div>
      )}
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
    <section aria-labelledby="post-studio-title" className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="post-studio-title" className="text-lg font-bold">
            {draft.topic}
          </h2>
          <p className="text-xs text-slate-500">
            {FRAMEWORK_LABELS[draft.framework]} · {draft.angle}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          {draft.generatedBy.source === "claude" ? `Gerado por ${draft.generatedBy.model ?? "Claude"}` : "Modelo de contingência (sem IA)"}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* Slides */}
        <div>
          <SlideCanvas slide={slide} total={total} profile={profile} className="rounded-2xl shadow-lg" />
          <div className="mt-3 flex items-center justify-between">
            <button type="button" aria-label="Slide anterior" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-slate-500">
              {index + 1} de {total}
            </span>
            <button type="button" aria-label="Próximo slide" disabled={index === total - 1} onClick={() => setIndex((i) => i + 1)} className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {draft.slides.map((s, i) => (
              <button key={s.number} type="button" aria-label={`Ir para o slide ${i + 1}`} onClick={() => setIndex(i)} className={`overflow-hidden rounded-md ring-2 ${i === index ? "ring-teal-500" : "ring-transparent"}`}>
                <SlideCanvas slide={s} total={total} profile={profile} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Crivo */}
          <div className={`rounded-2xl border p-4 ${audit.isApproved ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"}`}>
            <div className="flex items-center gap-2 text-sm font-bold">
              {audit.isApproved ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
              {BRAND.auditorName}: {audit.score}/100 · {audit.isApproved ? "sem bloqueios automáticos" : "revise antes de publicar"}
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Triagem automática por regras gerais e {profile.profession === "dentista" ? "CFO" : "CFM"}; não substitui avaliação profissional nem assegura conformidade jurídica.
            </p>
            {audit.infractions.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm">
                {audit.infractions.map((inf, i) => (
                  <li key={i} className="rounded-lg bg-white/70 dark:bg-black/20 p-2">
                    <span className="font-semibold">{inf.severity === "CRITICAL" ? "Crítico" : inf.severity === "WARNING" ? "Atenção" : "Info"}:</span> “{inf.detectedText}” — {inf.reason}
                    <div className="text-xs text-slate-500">
                      {inf.legalReference}
                      {inf.sourceUrl && (
                        <> · <a href={inf.sourceUrl} target="_blank" rel="noreferrer" className="font-medium underline">Fonte oficial</a></>
                      )}
                      {" · Sugestão: "}{inf.suggestion}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!profile.crm && (
              <p className="mt-2 text-xs">
                Cadastre seu {council} no perfil
                {profile.profession === "dentista"
                  ? ": nome e CRO devem acompanhar divulgações com imagens de diagnóstico ou resultado final."
                  : ": a identificação é obrigatória em toda peça médica."}
              </p>
            )}
          </div>

          {/* Legenda */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Legenda</h3>
              <CopyButton text={draft.caption} label="Copiar legenda" />
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{draft.caption}</p>
          </div>

          {/* Funil Comente PALAVRA */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <MessageCircle className="h-4 w-4" /> Funil “Comente {draft.cta.keyword}”
            </h3>
            <p className="mt-1 text-sm">
              Quem comentar <strong>{draft.cta.keyword}</strong> recebe {draft.cta.promise}.
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Isca: {draft.cta.leadMagnetTitle}</p>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {draft.cta.leadMagnetOutline.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Mensagem do direct:</span> {draft.cta.dmMessage}
              </p>
              <CopyButton text={draft.cta.dmMessage} label="Copiar DM" />
            </div>
          </div>

          {/* Evidências */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <BookOpen className="h-4 w-4" /> Evidências verificadas
            </h3>
            {draft.evidence.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Nenhuma evidência encontrada na busca. O post não cita estudos; confira a literatura antes de afirmar dados.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {draft.evidence.map((p, i) => (
                  <li key={i}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="font-medium underline">
                        {p.title}
                      </a>
                    ) : (
                      <span className="font-medium">{p.title}</span>
                    )}
                    <div className="text-xs text-slate-500">{p.citationAbnt}</div>
                    {p.takeaway && <div className="text-xs">{p.takeaway}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
