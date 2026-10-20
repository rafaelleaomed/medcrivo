"use client";

import React, { useState } from "react";
import { Loader2, MessageCircleQuestion, Smartphone } from "lucide-react";
import { Button, CrivoDisclaimer, EmptyState } from "@/components/ui";
import type { GeneratedBy } from "@/lib/creator/ai";
import type { StoriesResult } from "@/lib/creator/generate";
import { GOAL_LABELS, KIND_LABELS, type StoriesInput, type StoryFrame, type StoryGoal } from "@/lib/creator/stories";
import type { StudioItem } from "@/lib/store/items";
import { cn } from "@/lib/utils";
import { CopyButton, CrivoBadge, CrivoFindings, ErrorNote, RecentItems, Segmented, SectionLabel, SourceNote, ToolTitle, useSavedItems } from "./shared";

type StoriesPayload = { input: StoriesInput; plan: StoriesResult; generatedBy: GeneratedBy };

const GOAL_OPTIONS = (Object.keys(GOAL_LABELS) as StoryGoal[]).map((value) => ({ value, label: GOAL_LABELS[value] }));
const COUNT_OPTIONS = ["4", "5", "6"].map((value) => ({ value, label: value }));

/** Telas escuras (Pinho) nas pontas da sequência; conteúdo e interações no Marfim. */
const DARK_KINDS: StoryFrame["kind"][] = ["abertura", "cta"];

function Sticker({ frame, dark }: { frame: StoryFrame; dark: boolean }) {
  if (!frame.question) return null;
  return (
    <div className="w-full rounded-2xl bg-white p-3 text-center text-tinta shadow-sm">
      <p className="text-[13px] font-bold leading-snug">{frame.question}</p>
      {frame.kind === "caixa" ? (
        <div className="mt-2 rounded-lg bg-slate-100 px-2 py-2 text-[11px] text-[var(--text-muted)]">Digite algo…</div>
      ) : (
        <div className={cn("mt-2 grid gap-1.5", frame.options.length === 2 ? "grid-cols-2" : "grid-cols-1")}>
          {frame.options.map((o) => (
            <span
              key={o}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-[12px] font-semibold",
                dark ? "border-pinho/20" : "border-[var(--border-subtle)]",
              )}
            >
              {o}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryScreen({ frame, index, total, footer }: { frame: StoryFrame; index: number; total: number; footer: string }) {
  const dark = DARK_KINDS.includes(frame.kind);
  return (
    <figure className="flex w-[220px] shrink-0 snap-start flex-col gap-2">
      <div
        className={cn(
          "relative flex aspect-[9/16] flex-col overflow-hidden rounded-[22px] border p-4",
          dark ? "border-pinho bg-pinho text-marfim" : "border-[var(--border-subtle)] bg-marfim text-tinta",
        )}
      >
        {/* Barras de progresso do Instagram */}
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={cn("h-0.5 flex-1 rounded-full", i <= index ? (dark ? "bg-lima" : "bg-teal-700") : dark ? "bg-marfim/25" : "bg-tinta/15")} />
          ))}
        </div>
        <span className={cn("mt-3 font-mono text-[10px] uppercase tracking-[0.18em]", dark ? "text-lima" : "text-teal-700")}>
          {KIND_LABELS[frame.kind]}
        </span>
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className={cn("font-display text-[26px] font-black uppercase leading-[0.95]", dark ? "text-marfim" : "text-pinho")}>{frame.text}</p>
          {frame.detail && <p className={cn("text-[12px] leading-snug", dark ? "text-marfim/80" : "text-[var(--text-muted)]")}>{frame.detail}</p>}
          <Sticker frame={frame} dark={dark} />
        </div>
        <p className={cn("truncate text-[9px] font-semibold uppercase tracking-wider", dark ? "text-marfim/70" : "text-tinta/60")}>{footer}</p>
      </div>
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {String(index + 1).padStart(2, "0")} · {frame.visual}
      </figcaption>
    </figure>
  );
}

function scriptText(plan: StoriesResult): string {
  return plan.frames
    .map((f, i) =>
      [
        `${i + 1}. ${KIND_LABELS[f.kind]}: ${f.text}`,
        f.detail && `   ${f.detail}`,
        f.question && `   Adesivo: ${f.question}${f.options.length ? ` (${f.options.join(" / ")})` : ""}`,
        `   Visual: ${f.visual}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .concat(`\n${plan.footer}`)
    .join("\n");
}

export function StoriesView({ initialTopic = "" }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic);
  const [goal, setGoal] = useState<StoryGoal>("educar");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<StudioItem<StoriesPayload> | null>(null);
  const saved = useSavedItems<StoriesPayload>("/api/creator/stories", "stories");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (topic.trim().length < 3) {
      setError("Informe um tema com pelo menos 3 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/creator/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, goal, count: Number(count) }),
      });
      const data = await res.json().catch(() => null);
      if (!data?.success) throw new Error(data?.error ?? `Erro ${res.status}`);
      setCurrent(data.item);
      void saved.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar agora.");
    } finally {
      setLoading(false);
    }
  }

  async function openSaved(id: string) {
    const item = await saved.open(id);
    if (item) setCurrent(item);
  }

  const payload = current?.payload;

  return (
    <div className="space-y-6">
      <ToolTitle label="Criar · Stories" title="Sequência do dia" />

      <form onSubmit={generate} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Segmented label="Objetivo" value={goal} options={GOAL_OPTIONS} onChange={setGoal} />
          <Segmented label="Número de telas" value={count} options={COUNT_OPTIONS} onChange={setCount} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="stories-topic" className="sr-only">
            Tema
          </label>
          <input
            id="stories-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tema da sequência"
            maxLength={300}
            className="h-12 flex-1 rounded-full border border-[var(--border-subtle)] bg-white px-5 text-sm text-tinta outline-none placeholder:text-[var(--text-muted)] focus:border-teal-600 dark:bg-[#132D29] dark:text-marfim"
          />
          <Button type="submit" size="lg" disabled={loading} className="h-12">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Smartphone className="h-4 w-4" aria-hidden />}
            {loading ? "Gerando" : "Gerar stories"}
          </Button>
        </div>
        <RecentItems items={saved.items} activeId={current?.id} onOpen={openSaved} />
      </form>

      <ErrorNote message={error} />

      {payload ? (
        <section aria-live="polite" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <SectionLabel>{`${GOAL_LABELS[payload.input.goal]} · ${payload.plan.title}`}</SectionLabel>
              <CrivoBadge crivo={payload.plan.crivo} />
            </div>
            <div className="flex items-center gap-2">
              <SourceNote generatedBy={payload.generatedBy} />
              <CopyButton text={scriptText(payload.plan)} label="Copiar roteiro" />
            </div>
          </div>
          <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
            {payload.plan.frames.map((f, i) => (
              <StoryScreen key={i} frame={f} index={i} total={payload.plan.frames.length} footer={payload.plan.footer} />
            ))}
          </div>
          <CrivoFindings crivo={payload.plan.crivo} />
          <CrivoDisclaimer />
        </section>
      ) : (
        !loading && (
          <EmptyState icon={<MessageCircleQuestion className="h-6 w-6" aria-hidden />} title="Sua sequência aparece aqui" />
        )
      )}
    </div>
  );
}
