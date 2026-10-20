/* eslint-disable @next/next/no-img-element -- SVG estático da marca */
import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";

/**
 * Componentes base da MedCrivo (brand book, seção 06–08).
 * Destaque = Lima no escuro, Teal no claro. Nunca Lima sobre Marfim/branco nem Teal como texto sobre Pinho.
 */

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "lima" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Pinho com texto Marfim no claro; no escuro vira Lima com texto Pinho.
  primary: "bg-pinho text-marfim hover:bg-teal-800 dark:bg-lima dark:text-pinho dark:hover:bg-[#c9e35f]",
  // CTA de conversão: Lima com texto Pinho (par aprovado 9,5:1).
  lima: "bg-lima text-pinho hover:bg-[#c9e35f]",
  outline:
    "border border-pinho/25 text-pinho hover:bg-pinho/5 dark:border-marfim/30 dark:text-marfim dark:hover:bg-marfim/10",
  ghost: "text-teal-700 hover:bg-teal-50 dark:text-lima dark:hover:bg-marfim/10",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function Card({
  className,
  tone = "light",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "light" | "dark" | "subtle" }) {
  const tones = {
    light: "bg-white border border-[var(--border-subtle)] dark:bg-[#132D29]",
    subtle: "bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]",
    dark: "bg-pinho text-marfim border border-pinho",
  } as const;
  return (
    <div className={cx("rounded-3xl p-6", tones[tone], className)} {...props}>
      {children}
    </div>
  );
}

/** Selo "Revisado pelo Crivo": controle de qualidade da MedCrivo, nunca certificação do conselho. */
export function Seal({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const small = size === "sm";
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-full border border-black/10 bg-marfim font-extrabold text-pinho",
        small ? "gap-1.5 py-0.5 pl-0.5 pr-2.5 text-[11px]" : "gap-2 py-1 pl-1 pr-3.5 text-sm",
        className,
      )}
    >
      <img src={BRAND.assets.symbol} alt="" width={small ? 18 : 26} height={small ? 18 : 26} />
      {BRAND.sealText}
    </span>
  );
}

/** `onDark`: sobre fundo Pinho usa Lima (Teal sobre Pinho é proibido pelo brand book). */
export function Kicker({ children, className, onDark = false }: { children: React.ReactNode; className?: string; onDark?: boolean }) {
  return (
    <p
      className={cx(
        "text-xs font-bold uppercase tracking-[0.14em]",
        onDark ? "text-lima" : "text-teal-700 dark:text-lima",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Manchete de campanha: Barlow Condensed 900, caixa alta. Use <em> para a palavra-chave em destaque. */
export function Headline({
  as: Tag = "h1",
  className,
  onDark = false,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Sobre fundo Pinho: texto Marfim e destaque Lima. No claro: Pinho e destaque Teal. */
  onDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cx(
        "font-display font-black uppercase leading-[0.95] tracking-tight [&_em]:not-italic",
        onDark ? "text-marfim [&_em]:text-lima" : "text-pinho dark:text-marfim [&_em]:text-teal-700 dark:[&_em]:text-lima",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Cabeçalho de tela na grade editorial (Stencil adaptada): rótulo mono + título em display.
 * `description` aparece numa linha só (fica oculta no celular): prefira não usar.
 */
export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mc-grid -mx-4 grid-cols-1 sm:mx-0 md:grid-cols-12">
      <div className={cx("mc-cell p-6 sm:p-8", actions ? "md:col-span-8" : "md:col-span-12")}>
        {kicker && <p className="mc-kicker">{kicker}</p>}
        <h1 className="mc-display mt-4 text-5xl text-[var(--text-main)] sm:text-6xl">{title}</h1>
        {description && <p className="mt-3 hidden truncate text-sm text-[var(--text-muted)] sm:block">{description}</p>}
      </div>
      {actions && <div className="mc-cell flex flex-wrap items-end justify-start gap-2 p-6 sm:p-8 md:col-span-4 md:justify-end">{actions}</div>}
    </header>
  );
}

/** Estado vazio enxuto: ícone, uma frase e, se houver, uma ação. */
export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-[var(--border-subtle)] px-6 py-14 text-center">
      {icon && <div className="grid h-12 w-12 place-items-center bg-pinho text-lima dark:bg-lima dark:text-pinho">{icon}</div>}
      <h2 className="text-base font-bold text-[var(--text-main)]">{title}</h2>
      {children && <div className="max-w-sm text-sm text-[var(--text-muted)]">{children}</div>}
      {action}
    </div>
  );
}

/** Aviso de responsabilidade usado em toda saída do Crivo. */
export function CrivoDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cx("text-xs leading-relaxed text-[var(--text-muted)]", className)}>
      Triagem automatizada: não é certificação nem parecer do conselho. A decisão e a responsabilidade pela publicação são
      do profissional.
    </p>
  );
}
