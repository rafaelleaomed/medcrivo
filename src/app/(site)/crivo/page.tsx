import type { Metadata } from "next";
import Link from "next/link";
import { CrivoChecker } from "@/components/crivo/CrivoChecker";
import { Headline, Kicker, buttonClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Crivo grátis",
  description: "Revise a legenda ou o roteiro do seu post pelas normas do CFM e a LGPD. Grátis, no navegador, sem cadastro.",
};

export default function CrivoPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 md:py-16">
      <div className="space-y-3">
        <Kicker>Crivo grátis · sem cadastro</Kicker>
        <Headline className="text-5xl sm:text-6xl">
          Seu post passa <em>no crivo</em>?
        </Headline>
        <p className="text-base leading-relaxed text-[var(--text-muted)]">
          O Crivo, revisor ético e científico da MedCrivo, lê o seu texto pela Res. CFM 2.336/2023 e pela LGPD e aponta o
          trecho, a norma e uma sugestão de ajuste.
        </p>
      </div>
      <CrivoChecker hideIdentification autoFocus />
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-white p-6">
        <p className="font-bold text-tinta">Quer o post inteiro, já revisado?</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          No estúdio, você escolhe o tema e recebe o carrossel, a legenda e o roteiro de vídeo com o Crivo embutido.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/planos" className={buttonClass("primary", "md")}>
            Ver planos
          </Link>
          <Link href="/checklist" className={buttonClass("outline", "md")}>
            Baixar o checklist
          </Link>
        </div>
      </div>
    </div>
  );
}
