"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Film, Layers } from "lucide-react";
import { CarouselStudio } from "@/components/CarouselStudio";
import { ComplianceInspector } from "@/components/ComplianceInspector";
import { GenerationProgress, PostStudio } from "@/components/PostStudio";
import { ScientificEvidenceCard } from "@/components/ScientificEvidenceCard";
import { VturbVideoDirector } from "@/components/VturbVideoDirector";
import { CrivoChecker } from "@/components/crivo/CrivoChecker";
import { EmptyState, PageHeader } from "@/components/ui";
import { Composer } from "./Composer";
import { STUDIO_ROUTES } from "./routes";
import { useStudio } from "./StudioProvider";

function LocalModeNotice() {
  const { storeMode } = useStudio();
  if (storeMode !== "local") return null;
  return (
    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      Modo local: os dados ficam só nesta máquina (Supabase não configurado).
    </p>
  );
}

export function CarouselView() {
  const { jobProgress, postDraft, profile, carouselSlides, setCarouselSlides, topic, variationSeed } = useStudio();
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Carrossel 4:5"
        title="Do tema ao carrossel revisado"
        description="Escolha o tema ou cole o link de uma notícia. Você recebe os slides com a sua identidade visual, a legenda e a DM do funil, com o parecer do Crivo."
      />
      <LocalModeNotice />
      <Composer />
      {jobProgress && <GenerationProgress job={jobProgress} />}
      {postDraft ? (
        <PostStudio draft={postDraft} profile={profile} />
      ) : (
        !jobProgress && (
          <EmptyState icon={<Layers className="h-6 w-6" aria-hidden />} title="Seu próximo carrossel aparece aqui">
            Digite um tema acima e clique em Gerar conteúdo. A geração leva alguns instantes.
          </EmptyState>
        )
      )}
      {carouselSlides && (
        <details className="rounded-3xl border border-[var(--border-subtle)] bg-white p-5 dark:bg-[#132D29]">
          <summary className="cursor-pointer text-sm font-bold text-tinta dark:text-marfim">Layouts alternativos e exportação</summary>
          <div className="mt-4">
            <CarouselStudio
              topic={topic}
              specialty={profile.specialty}
              doctorName={profile.name}
              crm={profile.crm}
              rqe={profile.careerStage === "especialista" ? profile.rqe : ""}
              doctorInstagram={profile.instagram}
              variationSeed={variationSeed}
              initialSlides={carouselSlides}
              onSlidesUpdated={setCarouselSlides}
            />
          </div>
        </details>
      )}
    </div>
  );
}

export function VideoView() {
  const { videoScript, profile } = useStudio();
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Roteiro de vídeo"
        title="Roteiro de Reels com gancho e CTA ético"
        description="O roteiro é gerado junto com o carrossel, a partir do mesmo tema."
      />
      <Composer />
      {videoScript ? (
        <VturbVideoDirector script={videoScript} doctorName={profile.name} crm={profile.crm} />
      ) : (
        <EmptyState icon={<Film className="h-6 w-6" aria-hidden />} title="Nenhum roteiro ainda">
          Gere um conteúdo e o roteiro aparece aqui, com teleprompter.
        </EmptyState>
      )}
    </div>
  );
}

export function CrivoView() {
  const { audit, postDraft, profile } = useStudio();
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Crivo"
        title="Revise qualquer texto antes de publicar"
        description="O Crivo confere o texto com a Res. CFM 2.336/2023 e a LGPD e mostra o trecho, a norma e uma sugestão de ajuste."
      />
      <CrivoChecker hideIdentification={profile.careerStage === "estudante"} />
      {audit && postDraft && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-tinta dark:text-marfim">Parecer do último post</h2>
          <ComplianceInspector
            key={profile.profession}
            audit={audit}
            doctorName={profile.name}
            crm={profile.crm}
            rqe={profile.rqe}
            profession={profile.profession}
          />
        </section>
      )}
    </div>
  );
}

export function EvidenceView() {
  const { evidence, topic } = useStudio();
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Evidências"
        title="Referências científicas do post"
        description="Só mostramos referências reais encontradas na busca. Quando não há referência, o post sai sem citação, e nada é inventado."
      />
      {evidence.length > 0 ? (
        <ScientificEvidenceCard evidence={evidence} topic={topic} />
      ) : (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="Nenhuma referência ainda"
          action={
            <Link href={STUDIO_ROUTES.carousel} className="text-sm font-semibold text-teal-700 hover:underline dark:text-lima">
              Criar um carrossel
            </Link>
          }
        >
          As referências aparecem depois que você gera um conteúdo.
        </EmptyState>
      )}
    </div>
  );
}
