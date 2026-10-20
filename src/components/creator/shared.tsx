"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Check, Copy, History, ShieldAlert, ShieldCheck } from "lucide-react";
import type { CrivoSummary, GeneratedBy } from "@/lib/creator/ai";
import type { ItemKind, ItemSummary, StudioItem } from "@/lib/store/items";
import { cn } from "@/lib/utils";

/** Rótulo de seção no padrão Stencil: mono, caixa alta, marcador quadrado. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]", className)}>
      <span aria-hidden className="h-1.5 w-1.5 bg-teal-700 dark:bg-lima" />
      {children}
    </p>
  );
}

/** Cabeçalho curto da ferramenta: rótulo + título display (até 4 palavras). */
export function ToolTitle({ label, title, aside }: { label: string; title: string; aside?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
      <div className="space-y-2">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-pinho sm:text-5xl dark:text-marfim">
          {title}
        </h1>
      </div>
      {aside}
    </header>
  );
}

/** Seletor segmentado (rádio acessível). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-[var(--border-subtle)] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-9 min-w-10 rounded-full px-4 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
              active
                ? "bg-pinho text-marfim dark:bg-lima dark:text-pinho"
                : "text-[var(--text-muted)] hover:text-pinho dark:hover:text-marfim",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Nota do Crivo; os achados aparecem no `title` (detalhe sem poluir a tela). */
export function CrivoBadge({ crivo, className }: { crivo: CrivoSummary; className?: string }) {
  const ok = crivo.isApproved;
  const detail = crivo.infractions.length
    ? crivo.infractions.map((i) => `• ${i.detectedText}: ${i.reason}`).join("\n")
    : "Nenhum achado.";
  const Icon = ok ? ShieldCheck : ShieldAlert;
  return (
    <span
      title={detail}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider",
        ok ? "bg-teal-50 text-teal-700 dark:bg-marfim/10 dark:text-lima" : "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      Crivo {crivo.score}
    </span>
  );
}

/** Achados do Crivo em lista curta (só quando há algo a corrigir). */
export function CrivoFindings({ crivo }: { crivo: CrivoSummary }) {
  if (!crivo.infractions.length) return null;
  return (
    <ul className="space-y-1.5 text-xs leading-relaxed">
      {crivo.infractions.map((i, n) => (
        <li key={`${i.ruleId}-${n}`} className="text-[var(--text-muted)]">
          <span className="font-bold text-tinta dark:text-marfim">{i.detectedText}</span> → {i.suggestion}{" "}
          <span className="font-mono text-[10px] uppercase">({i.legalReference})</span>
        </li>
      ))}
    </ul>
  );
}

/** Aviso discreto quando a IA não respondeu e o conteúdo é o rascunho de reserva. */
export function SourceNote({ generatedBy }: { generatedBy: GeneratedBy }) {
  if (generatedBy.source === "claude") return null;
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]" title={generatedBy.fallbackReason}>
      Rascunho de reserva · IA indisponível
    </p>
  );
}

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => undefined);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-lima dark:hover:bg-marfim/10"
    >
      {done ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {done ? "Copiado" : label}
    </button>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      {message}
    </p>
  );
}

/** Lista e abre itens salvos de uma ferramenta. */
export function useSavedItems<P>(endpoint: string, kind: ItemKind) {
  const [items, setItems] = useState<ItemSummary[]>([]);
  const refresh = useCallback(async () => {
    const data = await fetch(endpoint).then((r) => r.json()).catch(() => null);
    if (data?.success) setItems((data.items as ItemSummary[]).filter((i) => i.kind === kind));
  }, [endpoint, kind]);
  const open = useCallback(
    async (id: string): Promise<StudioItem<P> | null> => {
      const data = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`).then((r) => r.json()).catch(() => null);
      return data?.success ? (data.item as StudioItem<P>) : null;
    },
    [endpoint],
  );
  useEffect(() => {
    // Carga inicial da lista salva (efeito de sincronização com o servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);
  return { items, refresh, open };
}

/** Recentes: chips com os últimos itens salvos. */
export function RecentItems({
  items,
  activeId,
  onOpen,
}: {
  items: ItemSummary[];
  activeId?: string | null;
  onOpen: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <nav aria-label="Recentes" className="flex items-center gap-2 overflow-x-auto pb-1">
      <History className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-label="Recentes" />
      {items.slice(0, 8).map((i) => (
        <button
          key={i.id}
          type="button"
          onClick={() => onOpen(i.id)}
          aria-current={i.id === activeId ? "true" : undefined}
          className={cn(
            "h-8 shrink-0 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-600",
            i.id === activeId
              ? "border-pinho bg-pinho text-marfim dark:border-lima dark:bg-lima dark:text-pinho"
              : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-pinho dark:hover:text-marfim",
          )}
        >
          {i.title.length > 32 ? `${i.title.slice(0, 30)}…` : i.title}
        </button>
      ))}
    </nav>
  );
}
