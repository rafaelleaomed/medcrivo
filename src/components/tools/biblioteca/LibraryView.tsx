"use client";

import React, { useState } from "react";
import { ArrowRight, Library } from "lucide-react";
import { Button, EmptyState, Seal } from "@/components/ui";
import { ToolTitle } from "@/components/creator/shared";
import { useStudio } from "@/components/studio/StudioProvider";
import { CrivoScore } from "@/components/tools/conteudos/PostStatus";
import type { ModelCrivo } from "@/lib/library/crivo";
import {
  frameworkGuide,
  LIBRARY_FRAMEWORKS,
  LIBRARY_MODELS,
  LIBRARY_SPECIALTIES,
  matchSpecialty,
  specialtyById,
  topicFor,
  type LibraryFramework,
  type LibraryModel,
  type LibrarySpecialtyId,
} from "@/lib/library/templates";
import { cn } from "@/lib/utils";

type SpecialtyFilter = LibrarySpecialtyId | "all";
type FrameworkFilter = LibraryFramework | "all";

export function LibraryView({ crivo }: { crivo: Record<string, ModelCrivo> }) {
  const { profile, startFromTopic } = useStudio();
  // Sem escolha do usuário, segue a especialidade do perfil (que chega depois do carregamento).
  const [picked, setPicked] = useState<SpecialtyFilter | null>(null);
  const [framework, setFramework] = useState<FrameworkFilter>("all");
  const specialty: SpecialtyFilter = picked ?? matchSpecialty(profile.specialty, profile.profession) ?? "all";

  const models = LIBRARY_MODELS.filter(
    (m) => (specialty === "all" || m.specialty === specialty) && (framework === "all" || m.framework === framework),
  );

  return (
    <div className="space-y-6">
      <ToolTitle label="Planejar · Biblioteca" title="Modelos" aside={<Seal size="sm" />} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative shrink-0">
          <span className="sr-only">Especialidade</span>
          <select
            value={specialty}
            onChange={(e) => setPicked(e.target.value as SpecialtyFilter)}
            className="h-11 w-full cursor-pointer appearance-none rounded-full border border-[var(--border-subtle)] bg-white pl-5 pr-10 text-sm font-bold text-tinta outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 lg:w-64 dark:bg-[#132D29] dark:text-marfim"
          >
            <option value="all">Todas as especialidades</option>
            {LIBRARY_SPECIALTIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
            ▾
          </span>
        </label>
        <div role="radiogroup" aria-label="Framework" className="flex gap-2 overflow-x-auto pb-1">
          {[{ id: "all" as const, label: "Todos" }, ...LIBRARY_FRAMEWORKS].map((f) => {
            const active = framework === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFramework(f.id)}
                title={f.id === "all" ? undefined : frameworkGuide(f.id).purpose}
                className={cn(
                  "h-11 shrink-0 rounded-full border px-4 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                  active
                    ? "border-pinho bg-pinho text-marfim dark:border-lima dark:bg-lima dark:text-pinho"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-pinho dark:hover:text-marfim",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {models.length ? (
        <ul className="grid border-l border-t border-[var(--border-subtle)] sm:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <ModelCell
              key={model.id}
              model={model}
              crivo={crivo[model.id]}
              showSpecialty={specialty === "all"}
              onUse={() => startFromTopic(topicFor(model))}
            />
          ))}
        </ul>
      ) : (
        <EmptyState icon={<Library className="h-6 w-6" aria-hidden />} title="Nenhum modelo com esse filtro" />
      )}
    </div>
  );
}

function ModelCell({
  model,
  crivo,
  showSpecialty,
  onUse,
}: {
  model: LibraryModel;
  crivo: ModelCrivo | undefined;
  showSpecialty: boolean;
  onUse: () => void;
}) {
  const guide = frameworkGuide(model.framework);
  return (
    <li className="flex flex-col gap-4 border-b border-r border-[var(--border-subtle)] bg-white/70 p-5 dark:bg-[#132D29]/70">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span aria-hidden className="h-1.5 w-1.5 bg-teal-700 dark:bg-lima" />
          {guide.label}
        </p>
        {crivo && <CrivoScore score={crivo.score} approved={crivo.isApproved} />}
      </div>

      <h2 className="font-display text-2xl font-black uppercase leading-[0.95] tracking-tight text-pinho dark:text-marfim">{model.hook}</h2>

      <ol aria-label={`Estrutura em ${guide.slides.length} slides`} className="mt-auto flex flex-wrap gap-1">
        {guide.slides.map((s, i) => (
          <li
            key={i}
            title={s.role}
            className={cn(
              "grid h-7 min-w-7 place-items-center px-1 font-mono text-[11px] font-bold",
              s.template === "capa_noticia"
                ? "bg-pinho text-marfim"
                : s.template === "cta"
                  ? "bg-pinho text-lima"
                  : "border border-[var(--border-subtle)] text-[var(--text-muted)]",
            )}
          >
            <span aria-hidden>{i + 1}</span>
            <span className="sr-only">{s.role}</span>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-4">
        <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {showSpecialty ? specialtyById(model.specialty).label : `${guide.slides.length} slides`}
        </span>
        <Button variant="outline" size="sm" onClick={onUse} aria-label={`Usar modelo: ${model.hook}`}>
          Usar modelo <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </li>
  );
}
