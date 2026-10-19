import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { Headline, Kicker, buttonClass } from "@/components/ui";
import { PLANS, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Planos",
  description: "Comece pelo Crivo grátis. Os planos do estúdio incluem carrossel, legenda, roteiro de vídeo e revisão do Crivo em todo post.",
};

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:py-16">
      <div className="max-w-2xl space-y-3">
        <Kicker>Planos</Kicker>
        <Headline className="text-5xl sm:text-6xl">
          Comece pelo <em>Crivo grátis</em>.
        </Headline>
        <p className="text-base leading-relaxed text-[var(--text-muted)]">
          O Crivo em todo post está em todos os planos. Plano mensal, sem fidelidade.
          {!SITE.pricingPublished && " As assinaturas do estúdio abrem em breve; valores e cotas saem na abertura."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const free = plan.id === "gratis";
          return (
            <section
              key={plan.id}
              className={`flex flex-col gap-4 rounded-3xl p-6 ${
                plan.highlight ? "bg-pinho text-marfim" : "border border-[var(--border-subtle)] bg-white text-tinta"
              }`}
            >
              <div>
                <h2 className="text-lg font-extrabold">{plan.name}</h2>
                <p className={`mt-1 text-sm ${plan.highlight ? "text-[#cfe0d9]" : "text-[var(--text-muted)]"}`}>{plan.tagline}</p>
              </div>
              <p className="font-display text-4xl font-black uppercase">
                {free || SITE.pricingPublished ? plan.price : <span className="text-2xl">Valor na abertura</span>}
              </p>
              <ul className="flex-1 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-lima" : "text-teal-700"}`} aria-hidden />
                    {f}
                  </li>
                ))}
                {plan.soon?.map((f) => (
                  <li key={f} className={`flex gap-2 ${plan.highlight ? "text-[#cfe0d9]" : "text-[var(--text-muted)]"}`}>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {f} (em breve)
                  </li>
                ))}
              </ul>
              {free ? (
                <Link href="/crivo" className={buttonClass("primary", "md", "w-full")}>
                  Usar o Crivo grátis
                </Link>
              ) : (
                <a
                  href={SITE.instagram.dm}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass(plan.highlight ? "lima" : "outline", "md", "w-full")}
                >
                  Quero ser avisado(a)
                </a>
              )}
            </section>
          );
        })}
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        “Quero ser avisado(a)” abre o direct do {SITE.instagram.handle}. Mande CRIVO e a gente te avisa quando as assinaturas
        abrirem. Compras on-line podem ser canceladas em até 7 dias com reembolso integral (CDC, art. 49).
      </p>
    </div>
  );
}
