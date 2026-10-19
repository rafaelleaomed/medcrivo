import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Headline, Kicker, Seal } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Checklist: pode ou não pode no Instagram",
  description: "Os pontos principais da Res. CFM 2.336/2023 em uma página, para conferir antes de publicar.",
};

const COMMON_YES = [
  "Educar: prevenção, sinais de alerta, mitos e dúvidas frequentes.",
  "Explicar como um tratamento funciona, com limites e indicações.",
  "Mostrar bastidores, equipe e estrutura, sem pacientes identificáveis.",
  "Citar a fonte do que afirma.",
];
const COMMON_NO = [
  "Prometer resultado, prazo de resultado ou cura.",
  "Usar superlativos ou se colocar acima dos colegas (“o melhor”, “o único”).",
  "Anunciar método ou técnica exclusiva não reconhecida.",
  "Usar medo ou sensacionalismo para chamar atenção.",
  "Expor nome, rosto, exame ou dado que identifique quem você atendeu, sem autorização por escrito.",
  "Relatar caso com data e lugar que permita reconhecer o paciente.",
];
const CFM_YES = [
  "Identificação em toda peça: nome, a palavra MÉDICO(A), CRM/UF e RQE quando anunciar especialidade.",
  "Valor da consulta pode ser informado de forma sóbria.",
  "Imagens de resultado só com finalidade educativa, autorização do paciente e contexto: indicação, limitações e variação entre pessoas.",
];
const CFM_NO = [
  "Anunciar especialidade sem RQE. Pós-graduação sem RQE não torna ninguém especialista.",
  "Combos, descontos e ofertas agressivas de procedimento.",
  "Estudante se apresentar como médico(a) ou especialista.",
];
const BEFORE = [
  "Tem identificação completa?",
  "Alguma frase promete resultado ou prazo?",
  "Tem paciente, exame ou dado identificável?",
  "A fonte sustenta a frase exata?",
];

function List({ items, kind }: { items: string[]; kind: "yes" | "no" }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-snug text-tinta">
          {kind === "yes" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-lima p-0.5 text-pinho ring-1 ring-pinho" aria-label="Pode" />
          ) : (
            <X className="mt-0.5 h-4 w-4 shrink-0 rounded-full p-0.5 text-rose-700 ring-1 ring-rose-700" aria-label="Não pode" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 md:py-16 print:max-w-none print:p-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div className="space-y-3">
          <Kicker>Grátis · para médicos e estudantes</Kicker>
          <Headline className="text-5xl">
            Pode ou <em>não pode</em>?
          </Headline>
          <p className="max-w-xl text-sm text-[var(--text-muted)]">
            Os pontos principais da Res. CFM 2.336/2023 em uma página. Prefere pelo direct? Comente CRIVO em qualquer post do{" "}
            <a href={SITE.instagram.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 underline">
              {SITE.instagram.handle}
            </a>
            .
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Folha A4 (é o que sai no PDF) */}
      <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[var(--border-subtle)] print:rounded-none print:shadow-none print:ring-0">
        <header className="bg-pinho px-8 py-7 text-marfim">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca */}
          <img src={BRAND.assets.logoOnDark} alt={BRAND.name} width={150} height={36} className="h-9 w-auto" />
          <h1 className="mt-4 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            <span className="text-lima">Pode ou não pode?</span> Checklist do Instagram
          </h1>
          <p className="mt-2 text-sm text-[#cfe0d9]">Para médicos · Resolução CFM nº 2.336/2023 · Versão 1, outubro de 2026</p>
        </header>

        <div className="space-y-5 px-8 py-7">
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Vale para todo profissional de saúde</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-marfim p-4">
                <p className="mb-2 font-bold text-tinta">Pode</p>
                <List items={COMMON_YES} kind="yes" />
              </div>
              <div className="rounded-2xl bg-marfim p-4">
                <p className="mb-2 font-bold text-tinta">Não pode</p>
                <List items={COMMON_NO} kind="no" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-teal-700 p-4">
            <h2 className="mb-3 font-bold text-pinho">Médicos · Resolução CFM nº 2.336/2023</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <List items={CFM_YES} kind="yes" />
              <List items={CFM_NO} kind="no" />
            </div>
          </section>

          <section className="rounded-2xl bg-marfim p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Antes de publicar</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {BEFORE.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-tinta">
                  <span className="h-4 w-4 shrink-0 rounded border-2 border-teal-700" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <p className="rounded-2xl border border-dashed border-teal-700 p-4 text-sm text-tinta">
            <strong>Quer uma segunda leitura?</strong> Cole seu texto no Crivo e veja o trecho, a norma e uma sugestão de ajuste.
            A decisão final é sempre sua.
          </p>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] px-8 py-4 text-[11px] text-[var(--text-muted)]">
          <span>
            Resumo educativo. Não é parecer jurídico nem posição oficial do CFM. Confira a íntegra da norma no site do CFM.
            <br />
            <strong className="text-tinta">
              {BRAND.name} · {BRAND.tagline}
            </strong>{" "}
            · {SITE.instagram.handle}
          </span>
          <Seal size="sm" />
        </footer>
      </article>
    </div>
  );
}
