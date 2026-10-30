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

export function CarouselView() {
  const { jobProgress, postDraft, profile, carouselSlides, setCarouselSlides, topic, variationSeed, editorialBriefing } = useStudio();
  return (
    <div className="space-y-6">
      <PageHeader kicker="Criar · 4:5" title="Carrossel" />
      <Composer />
      {jobProgress && <GenerationProgress job={jobProgress} />}
      {postDraft ? (
        <PostStudio draft={postDraft} profile={profile} />
      ) : (
        !jobProgress && (
          <EmptyState icon={<Layers className="h-6 w-6" aria-hidden />} title="Digite um tema para começar" />
        )
      )}
      {carouselSlides && (
        <details className="border border-[var(--border-subtle)] p-5">
          <summary className="mc-kicker cursor-pointer">Layouts clássicos e exportação</summary>
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
              editorialBriefing={editorialBriefing ?? undefined}
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
      <PageHeader kicker="Criar · Roteiro" title="Reels" />
      <Composer />
      {videoScript ? (
        <VturbVideoDirector script={videoScript} doctorName={profile.name} crm={profile.crm} />
      ) : (
        <EmptyState icon={<Film className="h-6 w-6" aria-hidden />} title="Gere um tema para ter o roteiro" />
      )}
    </div>
  );
}

export function CrivoView() {
  const { audit, postDraft, profile } = useStudio();
  return (
    <div className="space-y-8">
      <PageHeader kicker="Revisar · CFM/CFO e LGPD" title="Crivo" />
      <CrivoChecker hideIdentification={profile.careerStage === "estudante"} />
      {audit && postDraft && (
        <section className="space-y-3">
          <h2 className="mc-kicker">Último post</h2>
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
      <PageHeader kicker="Revisar · Ciência" title="Evidências" />
      {evidence.length > 0 ? (
        <ScientificEvidenceCard evidence={evidence} topic={topic} />
      ) : (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="Sem referências ainda"
          action={
            <Link href={STUDIO_ROUTES.carousel} className="text-sm font-semibold text-teal-700 hover:underline dark:text-lima">
              Criar um carrossel
            </Link>
          }
        >
        </EmptyState>
      )}
    </div>
  );
}
