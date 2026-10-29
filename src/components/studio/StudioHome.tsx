"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { CAREER_STAGE_LABELS, firstName } from "@/lib/profile";
import type { RadarResponse } from "@/lib/radar/radar";
import { Seal } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { STUDIO_TOOLS } from "@/config/tools";
import { ToolFolders } from "@/components/dashboard/ToolFolders";
import type { DashboardSummary } from "@/app/api/dashboard/summary/route";
import { STUDIO_ROUTES } from "./routes";
import { useStudio } from "./StudioProvider";

const RADAR_CACHE_KEY = "medcrivo:radar:v1";
const RADAR_CACHE_MS = 60 * 60 * 1000;

type RadarCache = { radar: RadarResponse; history: string[]; savedAt: number };

function readRadarCache(): RadarCache | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(RADAR_CACHE_KEY) ?? "null") as RadarCache | null;
    if (!parsed?.radar?.opportunities?.length || !Array.isArray(parsed.history)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveRadarCache(cache: RadarCache) {
  try {
    localStorage.setItem(RADAR_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // O radar continua funcionando sem armazenamento local.
  }
}

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

function Metric({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="mc-cell flex min-h-32 flex-col justify-between p-5 sm:p-6">
      <span className="mc-kicker">{label}</span>
      <span className="mc-display text-5xl sm:text-6xl">{value === null || value === undefined ? "—" : value}</span>
    </div>
  );
}

const sourceLabel: Record<string, string> = { google_trends: "Google Trends", perfil: "Seu perfil" };
const goalLabel: Record<string, string> = { educar: "Educar", engajar: "Engajar", converter: "Converter", autoridade: "Autoridade" };

export function StudioHome() {
  const { profile, storeMode, topic, setTopic, generate, isLoading, startFromTopic, postDraft, audit } = useStudio();
  const summary = useSummary();
  const [radar, setRadar] = useState<RadarResponse | null>(null);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarError, setRadarError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const name = firstName(profile.name);
  const isStudent = profile.careerStage === "estudante";
  const readyTools = STUDIO_TOOLS.filter((tool) => tool.status === "pronto").length;

  const loadRadar = useCallback(async (force = false) => {
    const cached = readRadarCache();
    if (!force && cached && Date.now() - cached.savedAt < RADAR_CACHE_MS) {
      setRadar(cached.radar);
      setHistory(cached.history);
      return;
    }

    const excluded = [...new Set([...(cached?.history ?? history), ...(radar?.opportunities.map((item) => item.title) ?? [])])].slice(-30);
    setRadarLoading(true);
    setRadarError("");
    try {
      const response = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exclude: excluded }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || "Não foi possível atualizar o radar.");
      const nextRadar = data.radar as RadarResponse;
      const nextHistory = [...new Set([...excluded, ...nextRadar.opportunities.map((item) => item.title)])].slice(-30);
      setRadar(nextRadar);
      setHistory(nextHistory);
      saveRadarCache({ radar: nextRadar, history: nextHistory, savedAt: Date.now() });
    } catch (error) {
      setRadarError(error instanceof Error ? error.message : "Não foi possível atualizar o radar.");
      if (cached) {
        setRadar(cached.radar);
        setHistory(cached.history);
      }
    } finally {
      setRadarLoading(false);
    }
  }, [history, radar]);

  useEffect(() => {
    if (!storeMode) return;
    const timer = window.setTimeout(() => void loadRadar(false), 0);
    return () => window.clearTimeout(timer);
  }, [storeMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="-mx-4 sm:mx-0">
      <section className="mc-grid grid-cols-1 lg:grid-cols-12" aria-labelledby="radar-title">
        <div className="mc-cell p-6 sm:p-10 lg:col-span-8">
          <p className="mc-kicker">Radar editorial · Google Trends Brasil + estratégia MedCrivo</p>
          <h1 id="radar-title" className="mc-display mt-5 text-6xl sm:text-8xl">
            O que vale
            <br />
            <span className="mc-accent">publicar agora</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
            Pautas renovadas pelo que está ganhando atenção, pelo seu perfil e pelas dúvidas do seu público. Tendência sem relação responsável com saúde é descartada.
          </p>
        </div>
        <div className="mc-cell relative flex min-h-56 flex-col justify-between overflow-hidden bg-pinho p-6 text-marfim sm:p-8 lg:col-span-4">
          <div aria-hidden className="mc-dots pointer-events-none absolute inset-0 text-marfim opacity-[0.12]" />
          <p className="mc-kicker relative !text-marfim/70 before:!bg-lima">
            {BRAND.product} · {CAREER_STAGE_LABELS[profile.careerStage]}
          </p>
          <div className="relative space-y-4">
            <Seal />
            <p className="font-serif text-2xl italic leading-snug">
              {name ? `${isStudent ? "" : "Dr(a). "}${name}, ` : ""}primeiro a pauta. Depois, a peça.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Pautas do radar" className="border border-t-0 border-[var(--border-subtle)]">
        <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="mc-kicker">Oportunidades selecionadas</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {radar?.trendCount ? `${radar.trendCount} sinais atuais analisados` : "Perfil editorial analisado"}
              {radar?.generatedAt ? ` · atualizado ${new Date(radar.generatedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadRadar(true)}
            disabled={radarLoading || !storeMode}
            className="inline-flex items-center justify-center gap-2 border border-[var(--border-subtle)] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[var(--bg-card-subtle)] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${radarLoading ? "animate-spin" : ""}`} aria-hidden />
            Novas pautas
          </button>
        </div>

        {radarLoading && !radar ? (
          <div className="flex min-h-64 items-center justify-center gap-3 p-8 text-[var(--text-muted)]">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Cruzando tendências com seu perfil…
          </div>
        ) : radar?.opportunities.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {radar.opportunities.map((item, index) => (
              <li key={`${item.title}-${index}`} className="border-b border-r border-[var(--border-subtle)] p-6 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="mc-kicker flex items-center gap-2">
                    {item.source === "google_trends" ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : <Sparkles className="h-3.5 w-3.5" aria-hidden />}
                    {sourceLabel[item.source]}
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{item.score}/100</span>
                </div>
                <h2 className="mt-5 text-xl font-bold leading-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.hook}</p>
                <p className="mt-4 border-l-2 border-lima pl-3 text-sm leading-relaxed">{item.whyNow}</p>
                <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  <span>{item.format}</span><span>·</span><span>{goalLabel[item.goal]}</span>
                  {item.trendTitle ? <><span>·</span><span>{item.trendTitle}</span></> : null}
                </div>
                <button
                  type="button"
                  onClick={() => startFromTopic(item.title)}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 hover:text-pinho dark:text-lima cursor-pointer"
                >
                  Usar esta pauta <ArrowUpRight className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="min-h-48 p-8 text-[var(--text-muted)]">Complete o perfil para receber pautas mais precisas.</div>
        )}

        {(radarError || radar?.note) && (
          <p className="border-t border-[var(--border-subtle)] px-6 py-4 text-sm text-[var(--text-muted)]">{radarError || radar?.note}</p>
        )}
      </section>

      <section aria-labelledby="create-title" className="mc-grid grid-cols-1 border-t-0 lg:grid-cols-12">
        <div className="mc-cell p-6 sm:p-8 lg:col-span-4">
          <p className="mc-kicker">Já tem um tema?</p>
          <h2 id="create-title" className="mc-display mt-4 text-4xl sm:text-5xl">Criação direta</h2>
        </div>
        <form
          className="mc-cell flex items-center p-5 sm:p-8 lg:col-span-8"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          <div className="flex w-full border border-[var(--border-subtle)] bg-[var(--bg-card)] focus-within:border-teal-600 dark:focus-within:border-lima">
            <label htmlFor="home-topic" className="sr-only">Tema ou link de notícia</label>
            <input
              id="home-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Tema ou link de notícia"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="inline-flex items-center gap-2 bg-pinho px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-marfim hover:bg-teal-800 disabled:opacity-40 dark:bg-lima dark:text-pinho cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Criar <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </form>
      </section>

      <section aria-label="Números" className="mc-grid grid-cols-2 border-t-0 lg:grid-cols-4">
        <Metric label="Posts" value={summary?.posts} />
        <Metric label="Aprovados" value={summary?.approved} />
        <Metric label="Pautas" value={summary?.ideas} />
        <Metric label="Stories" value={summary?.stories} />
      </section>

      <section aria-labelledby="tools-title">
        <div className="mc-grid grid-cols-12 border-t-0">
          <h2 id="tools-title" className="mc-cell mc-display col-span-8 p-6 text-5xl sm:p-8 sm:text-6xl">Ferramentas</h2>
          <div className="mc-cell col-span-4 flex flex-col items-end justify-end p-6 sm:p-8">
            <span className="mc-kicker">Prontas</span>
            <span className="mc-display mt-2 text-5xl">{readyTools}<span className="mc-accent">/{STUDIO_TOOLS.length}</span></span>
          </div>
        </div>
        <ToolFolders />
      </section>

      {postDraft && (
        <section aria-label="Último post" className="mc-grid grid-cols-1 border-t-0 sm:grid-cols-12">
          <div className="mc-cell p-6 sm:col-span-9">
            <p className="mc-kicker">Último post</p>
            <p className="mt-3 text-lg font-bold">{postDraft.slides[0]?.headline ?? postDraft.topic}</p>
          </div>
          <Link href={STUDIO_ROUTES.carousel} className="mc-cell flex items-center justify-between gap-3 p-6 hover:bg-[var(--bg-card-subtle)] sm:col-span-3">
            <span className="mc-display text-4xl">{audit ? audit.score : "—"}<span className="mc-accent text-2xl">/100</span></span>
            <ArrowUpRight className="h-5 w-5" aria-hidden />
            <span className="sr-only">Abrir o último post</span>
          </Link>
        </section>
      )}
    </div>
  );
}
