"use client";

import React, { useState } from "react";
import { Clapperboard, Loader2, ScrollText } from "lucide-react";
import { Button, CrivoDisclaimer, EmptyState } from "@/components/ui";
import type { GeneratedBy } from "@/lib/creator/ai";
import type { ReelOptionWithCrivo } from "@/lib/creator/generate";
import {
  buildMotionPrompt,
  editNotes,
  GOAL_LABELS,
  MODE_LABELS,
  recordingScript,
  REEL_DURATIONS,
  REEL_GOALS,
  REEL_MODES,
  type ReelGoal,
  type ReelMode,
  type ReelsInput,
} from "@/lib/creator/reels";
import type { StudioItem } from "@/lib/store/items";
import { cn } from "@/lib/utils";
import { CopyButton, CrivoBadge, CrivoFindings, ErrorNote, RecentItems, Segmented, SectionLabel, SourceNote, ToolTitle, useSavedItems } from "./shared";

type ReelsPayload = { input: ReelsInput; options: ReelOptionWithCrivo[]; footer: string; generatedBy: GeneratedBy };

const MODE_OPTIONS = REEL_MODES.map((value) => ({ value, label: MODE_LABELS[value] }));
const GOAL_OPTIONS = REEL_GOALS.map((value) => ({ value, label: GOAL_LABELS[value] }));
const DURATION_OPTIONS = REEL_DURATIONS.map((d) => ({ value: String(d), label: `${d} s` }));

export function ReelsView({ initialTopic = "" }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic);
  const [mode, setMode] = useState<ReelMode>("gravar");
  const [goal, setGoal] = useState<ReelGoal>("educar");
  const [duration, setDuration] = useState("45");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<StudioItem<ReelsPayload> | null>(null);
  const [selected, setSelected] = useState(0);
  const saved = useSavedItems<ReelsPayload>("/api/creator/reels", "reels");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (topic.trim().length < 3) {
      setError("Informe um tema com pelo menos 3 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/creator/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, mode, goal, duration: Number(duration) }),
      });
      const data = await res.json().catch(() => null);
      if (!data?.success) throw new Error(data?.error ?? `Erro ${res.status}`);
      setCurrent(data.item);
      setSelected(0);
      void saved.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar agora.");
    } finally {
      setLoading(false);
    }
  }

  async function openSaved(id: string) {
    const item = await saved.open(id);
    if (item) {
      setCurrent(item);
      setSelected(0);
    }
  }

  const payload = current?.payload;
  const option = payload?.options[Math.min(selected, (payload?.options.length ?? 1) - 1)];
  const dur = payload?.input.duration ?? 45;

  return (
    <div className="space-y-6">
      <ToolTitle label="Criar · Roteiros" title="Roteiro de Reels em 3 opções" />

      <form onSubmit={generate} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Segmented label="Como vai ser feito" value={mode} options={MODE_OPTIONS} onChange={setMode} />
          <Segmented label="Objetivo" value={goal} options={GOAL_OPTIONS} onChange={setGoal} />
          <Segmented label="Duração" value={duration} options={DURATION_OPTIONS} onChange={setDuration} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="reels-topic" className="sr-only">
            Tema
          </label>
          <input
            id="reels-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tema do vídeo"
            maxLength={300}
            className="h-12 flex-1 rounded-full border border-[var(--border-subtle)] bg-white px-5 text-sm text-tinta outline-none placeholder:text-[var(--text-muted)] focus:border-teal-600 dark:bg-[#132D29] dark:text-marfim"
          />
          <Button type="submit" size="lg" disabled={loading} className="h-12">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Clapperboard className="h-4 w-4" aria-hidden />}
            {loading ? "Gerando" : "Gerar 3 roteiros"}
          </Button>
        </div>
        <RecentItems items={saved.items} activeId={current?.id} onOpen={openSaved} />
      </form>

      <ErrorNote message={error} />

      {payload && option ? (
        <section aria-live="polite" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <SectionLabel>{`${MODE_LABELS[payload.input.mode]} · ${GOAL_LABELS[payload.input.goal]} · ${dur} s`}</SectionLabel>
            <SourceNote generatedBy={payload.generatedBy} />
          </div>

          <div role="tablist" aria-label="Opções de roteiro" className="grid gap-2 sm:grid-cols-3">
            {payload.options.map((o, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === selected}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-2xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-600",
                  i === selected
                    ? "border-pinho bg-pinho text-marfim dark:border-lima"
                    : "border-[var(--border-subtle)] hover:border-teal-600",
                )}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">
                  Opção {i + 1} · {o.angle}
                </span>
                <span className="mt-1 block text-sm font-bold leading-snug">{o.hook}</span>
              </button>
            ))}
          </div>

          <article className="space-y-4 rounded-2xl border border-[var(--border-subtle)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CrivoBadge crivo={option.crivo} />
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton text={recordingScript(option, dur)} label="Copiar roteiro" />
                {payload.input.mode === "motion" && (
                  <CopyButton
                    text={buildMotionPrompt(option, { identification: payload.footer, topic: payload.input.topic, duration: dur })}
                    label="Copiar prompt do vídeo"
                  />
                )}
              </div>
            </div>

            <ol className="space-y-3">
              <li className="rounded-xl bg-pinho p-3 text-marfim">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lima">Gancho</span>
                <p className="mt-1 font-display text-lg font-black leading-tight">{option.hook}</p>
              </li>
              {option.beats.map((b, i) => (
                <li key={i} className="rounded-xl border border-[var(--border-subtle)] p-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Bloco {i + 1}</span>
                  <p className="mt-1 text-sm">{b.speech}</p>
                  {b.onScreen && <p className="mt-1 text-xs font-semibold text-teal-700">Tela: {b.onScreen}</p>}
                  <p className="text-xs text-[var(--text-muted)]">Visual: {b.visual}</p>
                </li>
              ))}
              <li className="rounded-xl bg-[var(--surface-muted,#f5f2e9)] p-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Chamada</span>
                <p className="mt-1 text-sm font-semibold">{option.cta}</p>
              </li>
            </ol>

            {payload.input.mode === "gravar" ? (
              <div>
                <SectionLabel>Como editar depois de gravar</SectionLabel>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {editNotes(option, dur).map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Cole o prompt no seu Claude Code (com o HyperFrames instalado) para criar o vídeo no seu computador, sem gastar a
                chave de API do estúdio.
              </p>
            )}

            <CrivoFindings crivo={option.crivo} />
          </article>
          <CrivoDisclaimer />
        </section>
      ) : (
        !loading && <EmptyState icon={<ScrollText className="h-6 w-6" aria-hidden />} title="Seus 3 roteiros aparecem aqui" />
      )}
    </div>
  );
}
