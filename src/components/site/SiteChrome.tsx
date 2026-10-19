import React from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { buttonClass } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";

const NAV = [
  { href: "/crivo", label: "Crivo grátis" },
  { href: "/checklist", label: "Checklist" },
  { href: "/planos", label: "Planos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/90 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" aria-label={`${BRAND.name}, página inicial`}>
          <BrandMark size={30} showProduct={false} className="text-lg" />
        </Link>
        <nav aria-label="Site" className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-teal-50 hover:text-tinta"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className={buttonClass("ghost", "sm")}>
            Entrar
          </Link>
          <Link href="/crivo" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
            Testar o Crivo
          </Link>
        </div>
      </div>
      <nav aria-label="Site (celular)" className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-tinta"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-pinho text-marfim print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca */}
          <img src={BRAND.assets.logoOnDark} alt={BRAND.name} width={180} height={44} className="h-11 w-auto" />
          <p className="font-serif text-xl">{BRAND.tagline}</p>
          <p className="max-w-sm text-sm text-[#cfe0d9]">{BRAND.support} Para médicos e estudantes de medicina.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-bold text-lima">Produto</p>
          <ul className="space-y-1.5 text-[#cfe0d9]">
            <li><Link href="/crivo" className="hover:text-marfim">Crivo grátis</Link></li>
            <li><Link href="/checklist" className="hover:text-marfim">Checklist do Instagram</Link></li>
            <li><Link href="/planos" className="hover:text-marfim">Planos</Link></li>
            <li><Link href="/login" className="hover:text-marfim">Entrar</Link></li>
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-bold text-lima">MedCrivo</p>
          <ul className="space-y-1.5 text-[#cfe0d9]">
            <li><a href={SITE.instagram.url} target="_blank" rel="noreferrer" className="hover:text-marfim">Instagram {SITE.instagram.handle}</a></li>
            <li><a href={`mailto:${SITE.contactEmail}`} className="hover:text-marfim">{SITE.contactEmail}</a></li>
            <li><Link href="/privacidade" className="hover:text-marfim">Privacidade</Link></li>
            <li><Link href="/termos" className="hover:text-marfim">Termos de uso</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-marfim/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-[#9cc1b8]">
          © 2026 {BRAND.name}. O {BRAND.auditorName} é uma triagem automatizada: não é certificação nem parecer do CFM. A
          responsabilidade pela publicação é do profissional.
        </p>
      </div>
    </footer>
  );
}
