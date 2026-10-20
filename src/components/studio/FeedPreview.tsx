"use client";

import React from "react";
import Link from "next/link";
import { Grid3x3, Plus } from "lucide-react";
import { SlideCanvas } from "@/components/slides/SlideTemplates";
import { EmptyState, PageHeader } from "@/components/ui";
import { STUDIO_ROUTES } from "./routes";
import { useStudio } from "./StudioProvider";

/** Prévia da grade 3×3: o post atual entra no primeiro espaço; os demais ficam livres para os próximos. */
export function FeedPreview() {
  const { postDraft, profile } = useStudio();
  const handle = profile.instagram ? (profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`) : "@seuperfil";

  return (
    <div className="space-y-6">
      <PageHeader kicker="Planejar · Grade 3×3" title="Feed" />

      {!postDraft ? (
        <EmptyState
          icon={<Grid3x3 className="h-6 w-6" aria-hidden />}
          title="Sem post para mostrar"
          action={
            <Link href={STUDIO_ROUTES.carousel} className="text-sm font-semibold text-teal-700 hover:underline dark:text-lima">
              Criar um carrossel
            </Link>
          }
        >
        </EmptyState>
      ) : (
        <div className="mx-auto max-w-md border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
          <p className="mc-kicker mb-3">{handle}</p>
          <div className="grid grid-cols-3 gap-1">
            <div className="aspect-[4/5] overflow-hidden">
              <SlideCanvas slide={postDraft.slides[0]} total={postDraft.slides.length} profile={profile} />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid aspect-[4/5] place-items-center bg-[var(--bg-card-subtle)] text-[var(--text-muted)]"
                aria-label="Espaço livre"
              >
                <Plus className="h-4 w-4 opacity-50" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
