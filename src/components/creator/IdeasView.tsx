"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Lightbulb, Loader2, Smartphone } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { useStudio } from "@/components/studio/StudioProvider";
import type { GeneratedBy } from "@/lib/creator/ai";
import type { IdeaWithCrivo } from "@/lib/creator/generate";
import { FORMAT_LABELS, PILLAR_LABELS, SOURCE_LABELS, type IdeasInput, type IdeaSource } from "@/lib/creator/ideas";
import type { StudioItem } from "@/lib/store/items";
import { CopyButton, CrivoBadge, CrivoFindings, ErrorNote, RecentItems, Segmented, SectionLabel, SourceNote, ToolTitle, useSavedItems } from "./shared";

type IdeasPayload = { input: IdeasInput; ideas: IdeaWithCrivo[]; generatedBy: GeneratedBy };

const SOURCE_OPTIONS = (Object.keys(SOURCE_LABELS) as IdeaSource[]).map((value) => ({ value, label: SOURCE_LABELS[value] }));

const PLACEHOLDER: Record<IdeaSource, string> = {
  pauta: "Tema (ou deixe vazio para usar o seu perfil)",
  noticia: "Cole o link da notícia ou escreva o tema",
  artigo: "Cole o link do artigo ou escreva o tema",
};

function isUrl(text: string) {
  return /^https?:\/\//i.test(text.trim());
}

export function IdeasView({ initialTheme = "" }: { initialTheme?: string }) {
  const { startFromTopic } = useStudio();
  const [theme, setTheme] = useState(initialTheme);
  const [source, setSource] = useState<IdeaSource>("pauta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<StudioItem<IdeasPayload> | null>(null);
  const saved = useSavedItems<IdeasPayload>("/api/creator/ideas", "ideas");

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let activeTheme = theme.trim();
      let sourceContext: string | undefined;
      if (isUrl(activeTheme)) {
        const extracted = await fetch("/api/extract-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: activeTheme }),
        })
          .then((r) => r.json())
          .catch(() => null);
        if (!extracted?.success) throw new Error(extracted?.error ?? "Não consegui ler esse link.");
        const d = extracted.data;
        sourceContext = [d.title, d.description, `Fonte: ${d.url}`].filter(Boolean).join("\n");
        activeTheme = d.clinicalTopic || d.title || "";
      }
      const res = await fetch("/api/creator/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: activeTheme, source, sourceContext }),
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
      <ToolTitle label="Criar · Ideias" title="Pautas da semana" />

      <form onSubmit={generate} className="space-y-3">
        <Segmented label="Fonte" value={source} options={SOURCE_OPTIONS} onChange={setSource} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="ideas-theme" className="sr-only">
            Tema ou link
          </label>
          <input
            id="ideas-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={PLACEHOLDER[source]}
            maxLength={300}
            className="h-12 flex-1 rounded-full border border-[var(--border-subtle)] bg-white px-5 text-sm text-tinta outline-none placeholder:text-[var(--text-muted)] focus:border-teal-600 dark:bg-[#132D29] dark:text-marfim"
          />
          <Button type="submit" size="lg" disabled={loading} className="h-12">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lightbulb className="h-4 w-4" aria-hidden />}
            {loading ? "Gerando" : "Gerar ideias"}
          </Button>
        </div>
        <RecentItems items={saved.items} activeId={current?.id} onOpen={openSaved} />
      </form>

      <ErrorNote message={error} />

      {payload ? (
        <section aria-live="polite" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionLabel>{`${SOURCE_LABELS[payload.input.source]} · ${payload.input.theme}`}</SectionLabel>
            <SourceNote generatedBy={payload.generatedBy} />
          </div>
          <ul className="grid border-l border-t border-[var(--border-subtle)] sm:grid-cols-2 xl:grid-cols-3">
            {payload.ideas.map((idea, n) => (
              <li
                key={`${idea.title}-${n}`}
                className="flex flex-col gap-3 border-b border-r border-[var(--border-subtle)] bg-white/70 p-5 dark:bg-[#132D29]/70"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {String(n + 1).padStart(2, "0")} · {PILLAR_LABELS[idea.pillar]} · {FORMAT_LABELS[idea.format]}
                  </span>
                  <CrivoBadge crivo={idea.crivo} />
                </div>
                <h2 className="text-lg font-extrabold leading-snug text-tinta dark:text-marfim">{idea.title}</h2>
                <p className="font-serif text-[15px] italic leading-relaxed text-teal-800 dark:text-lima/90">“{idea.hook}”</p>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">{idea.angle}</p>
                <CrivoFindings crivo={idea.crivo} />
                <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                  <Button size="sm" onClick={() => startFromTopic(idea.title)} aria-label={`Criar carrossel: ${idea.title}`}>
                    <Layers className="h-3.5 w-3.5" aria-hidden /> Carrossel
                  </Button>
                  <Link
                    href={`/app/stories?tema=${encodeURIComponent(idea.title)}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-lima dark:hover:bg-marfim/10"
                  >
                    <Smartphone className="h-3.5 w-3.5" aria-hidden /> Stories
                  </Link>
                  <CopyButton text={`${idea.title}\n${idea.hook}`} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        !loading && (
          <EmptyState
            icon={<Lightbulb className="h-6 w-6" aria-hidden />}
            title="Suas pautas aparecem aqui"
            action={
              <Button variant="outline" size="sm" onClick={() => generate()}>
                Usar meu perfil <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            }
          />
        )
      )}
    </div>
  );
}
