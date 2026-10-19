import React from "react";
import { Headline, Kicker } from "@/components/ui";
import { SITE } from "@/config/site";

export function controllerLine(): string {
  const { name, cnpj } = SITE.legalEntity;
  const entity = name ? `${name}${cnpj ? `, CNPJ ${cnpj}` : ""}` : "MedCrivo";
  return `${entity} · contato: ${SITE.contactEmail}`;
}

export function LegalPage({ kicker, title, updated, children }: { kicker: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 md:py-16">
      <header className="space-y-3">
        <Kicker>{kicker}</Kicker>
        <Headline className="text-5xl">{title}</Headline>
        <p className="text-sm text-[var(--text-muted)]">Atualizado em {updated}.</p>
      </header>
      <div className="space-y-6 text-sm leading-relaxed text-tinta [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </article>
  );
}
