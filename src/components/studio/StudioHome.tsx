"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, UserRound } from "lucide-react";
import { CAREER_STAGE_LABELS, greetingName } from "@/lib/profile";
import { Button, Card, Kicker, Seal } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { STUDIO_NAV, STUDIO_ROUTES } from "./routes";
import { useStudio } from "./StudioProvider";

export function StudioHome() {
  const { profile, setProfileOpen, suggestedTopics, startFromTopic, postDraft, audit } = useStudio();
  const who = greetingName(profile);
  const greeting = who ? `Olá, ${who}` : "Olá";
  const tools = STUDIO_NAV.filter((item) => item.href !== STUDIO_ROUTES.home);

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <Card tone="dark" className="relative overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-lima">{BRAND.product}</p>
            <h1 className="font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">{greeting}.</h1>
            <p className="text-sm leading-relaxed text-[#cfe0d9]">
              Escolha um tema e receba o carrossel com a sua identidade visual, a legenda e o roteiro de vídeo. Antes de chegar até
              você, o {BRAND.auditorName} revisa as normas do CFM e as referências citadas.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#cfe0d9]">
              <span className="rounded-full bg-marfim/10 px-2.5 py-1 font-semibold text-marfim">
                {CAREER_STAGE_LABELS[profile.careerStage]}
              </span>
              {profile.crm && <span>{profile.crm}</span>}
              {profile.careerStage === "especialista" && profile.rqe && <span>RQE {profile.rqe}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Link
              href={STUDIO_ROUTES.carousel}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lima px-6 text-sm font-bold text-pinho hover:bg-[#c9e35f]"
            >
              Criar conteúdo
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-marfim/30 px-5 text-xs font-semibold text-marfim hover:bg-marfim/10 cursor-pointer"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              Perfil e interesses
            </button>
          </div>
        </div>
      </Card>

      {/* Último post */}
      {postDraft && (
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Kicker>Último post</Kicker>
            <p className="mt-1 font-bold text-tinta dark:text-marfim">{postDraft.slides[0]?.headline ?? postDraft.topic}</p>
            {audit && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Nota do Crivo: <strong className="text-tinta dark:text-marfim">{audit.score}/100</strong>
                {audit.isCompliant ? " · sem pendências críticas" : " · revise os pontos apontados antes de publicar"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {audit?.isCompliant && <Seal size="sm" />}
            <Link href={STUDIO_ROUTES.carousel} className="text-sm font-semibold text-teal-700 hover:underline dark:text-lima">
              Abrir
            </Link>
          </div>
        </Card>
      )}

      {/* Ferramentas */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-tinta dark:text-marfim">Ferramentas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-3 rounded-3xl border border-[var(--border-subtle)] bg-white p-5 transition-colors hover:border-teal-600 dark:bg-[#132D29] dark:hover:border-lima"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-marfim/10 dark:text-lima">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-bold text-tinta dark:text-marfim">{item.label}</span>
              <span className="text-xs leading-relaxed text-[var(--text-muted)]">{item.description}</span>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-lima">
                Abrir
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pautas sugeridas */}
      {suggestedTopics.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-tinta dark:text-marfim">Pautas sugeridas</h2>
            <p className="text-xs text-[var(--text-muted)]">A partir dos seus interesses e da sua área. Clique para abrir o estúdio com o tema.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedTopics.map((t) => (
              <Button
                key={t.name}
                variant="outline"
                onClick={() => startFromTopic(t.name)}
                className="h-auto justify-between whitespace-normal rounded-2xl px-4 py-3 text-left"
              >
                <span>
                  <span className="block text-[11px] font-semibold text-[var(--text-muted)]">{t.category}</span>
                  <span className="block text-sm">{t.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
