"use client";

import { SlideCanvas } from "@/components/slides/SlideTemplates";
import type { PostSlide } from "@/lib/content/schema";
import { identificationLine, type DoctorProfile } from "@/lib/profile";

const SAMPLE: PostSlide = {
  number: 3,
  template: "lista",
  kicker: "",
  headline: "Sinais que merecem atenção",
  highlight: ["atenção"],
  body: "",
  items: ["Cansaço que não passa", "Mudança no sono", "Dor que volta sempre"],
  imagePrompt: "",
};

/** Prévia ao vivo: um slide real com a paleta escolhida, num celular, e o rodapé ético. */
export function BrandPreview({ profile }: { profile: DoctorProfile }) {
  return (
    <figure className="mx-auto w-full max-w-[260px]">
      <div className="rounded-[2.2rem] border-[6px] border-tinta bg-tinta p-1.5 shadow-2xl dark:border-black dark:bg-black">
        <div className="mx-auto mb-1.5 h-4 w-20 rounded-full bg-black/60" aria-hidden />
        <div className="overflow-hidden rounded-[1.5rem]">
          <SlideCanvas slide={SAMPLE} total={9} profile={profile} />
        </div>
      </div>
      <figcaption className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {identificationLine(profile)}
      </figcaption>
    </figure>
  );
}
