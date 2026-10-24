"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, LogOut, Moon, PenLine, CalendarRange, ShieldCheck, Sun, UserRound, type LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { logout } from "@/app/login/actions";
import { TOOL_GROUPS, toolsInGroup, type ToolGroupId } from "@/config/tools";
import { cn } from "@/lib/utils";
import { greetingName } from "@/lib/profile";
import { Dock } from "./Dock";
import { STUDIO_ROUTES, isActiveRoute } from "./routes";
import { useStudio } from "./StudioProvider";

const GROUP_ICONS: Record<ToolGroupId, LucideIcon> = { criar: PenLine, planejar: CalendarRange, revisar: ShieldCheck };

const ICON_BUTTON =
  "grid h-10 w-10 place-items-center text-[var(--text-main)] transition-colors hover:bg-[var(--bg-card-subtle)] cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600";

function groupIsActive(pathname: string, group: ToolGroupId) {
  return toolsInGroup(group).some((t) => isActiveRoute(pathname, t.href));
}

/** Menu suspenso de um grupo de ferramentas. Fecha com Esc, clique fora ou troca de rota. */
function GroupMenu({ group, label, open, onOpenChange, placement }: {
  group: ToolGroupId;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: "down" | "up";
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const tools = toolsInGroup(group);
  const active = groupIsActive(pathname, group);
  const Icon = GROUP_ICONS[group];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, onOpenChange]);

  const menuId = `menu-${group}-${placement}`;
  return (
    // No celular o menu ancora na barra inteira (não no botão) para não vazar da tela.
    <div ref={rootRef} className={cn(placement === "down" ? "relative" : "flex-1")}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600",
          placement === "down" ? "h-16 px-4" : "h-14 w-full flex-col justify-center gap-1 px-1 text-[10px] tracking-[0.12em]",
          active || open ? "text-[var(--text-main)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]",
        )}
      >
        {placement === "up" && <Icon className="h-5 w-5" aria-hidden />}
        <span className="inline-flex items-center gap-1">
          {active && <span aria-hidden className="h-1.5 w-1.5 bg-teal-600 dark:bg-lima" />}
          {label}
          {placement === "down" && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden />}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-50 border border-[var(--border-subtle)] bg-[var(--bg-main)] shadow-[0_24px_48px_-24px_rgba(11,38,34,0.45)]",
            placement === "down" ? "left-1/2 top-full w-72 -translate-x-1/2" : "inset-x-3 bottom-full mb-2",
          )}
        >
          <p className="mc-kicker border-b border-[var(--border-subtle)] px-4 py-3">{label}</p>
          <ul>
            {tools.map((tool) => {
              const current = isActiveRoute(pathname, tool.href);
              return (
                <li key={tool.id}>
                  <Link
                    role="menuitem"
                    href={tool.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3 last:border-b-0 transition-colors hover:bg-[var(--bg-card-subtle)] focus-visible:bg-[var(--bg-card-subtle)] focus-visible:outline-none",
                      current && "bg-[var(--bg-card-subtle)]",
                    )}
                  >
                    <tool.icon className="h-4 w-4 shrink-0 text-teal-700 dark:text-lima" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--text-main)]">{tool.label}</span>
                      <span className="block truncate text-xs text-[var(--text-muted)]">{tool.hint}</span>
                    </span>
                    {tool.status === "em-construcao" && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Em breve</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const { profile, theme, toggleTheme, setProfileOpen, storeMode } = useStudio();
  const [openGroup, setOpenGroup] = useState<{ id: ToolGroupId; where: "down" | "up" } | null>(null);
  const homeActive = pathname === STUDIO_ROUTES.home;

  // Troca de rota fecha qualquer menu aberto.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenGroup(null);
  }

  const menuProps = (id: ToolGroupId, where: "down" | "up") => ({
    open: openGroup?.id === id && openGroup.where === where,
    onOpenChange: (next: boolean) => setOpenGroup(next ? { id, where } : null),
  });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-stretch border-x border-[var(--border-subtle)]">
          <Link
            href={STUDIO_ROUTES.home}
            aria-label="Início do MedCrivo Studio"
            className="flex shrink-0 items-center border-r border-[var(--border-subtle)] px-4 sm:px-5"
          >
            <BrandMark size={28} className="text-base" />
          </Link>

          <Dock />

          <div className="ml-auto flex items-stretch border-l border-[var(--border-subtle)]">
            {storeMode === "local" && (
              <span className="hidden items-center border-r border-[var(--border-subtle)] px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-700 sm:flex">
                Local
              </span>
            )}
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="hidden items-center gap-2 border-r border-[var(--border-subtle)] px-4 text-xs font-semibold text-[var(--text-main)] transition-colors hover:bg-[var(--bg-card-subtle)] sm:inline-flex cursor-pointer"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              {greetingName(profile) || "Perfil"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(ICON_BUTTON, "h-16 w-14 border-r border-[var(--border-subtle)]")}
              aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {storeMode === "supabase" && (
              <form action={logout} className="flex">
                <button type="submit" className={cn(ICON_BUTTON, "h-16 w-14")} aria-label="Sair">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Celular e tablet: mesmos grupos numa barra inferior */}
      <nav
        aria-label="Estúdio (celular)"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch">
          <Link
            href={STUDIO_ROUTES.home}
            aria-current={homeActive ? "page" : undefined}
            className={cn(
              "flex h-14 flex-1 flex-col items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em]",
              homeActive ? "text-[var(--text-main)]" : "text-[var(--text-muted)]",
            )}
          >
            <Home className="h-5 w-5" aria-hidden />
            Início
          </Link>
          {TOOL_GROUPS.map((g) => (
            <GroupMenu key={g.id} group={g.id} label={g.label} placement="up" {...menuProps(g.id, "up")} />
          ))}
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex h-14 flex-1 flex-col items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] cursor-pointer"
          >
            <UserRound className="h-5 w-5" aria-hidden />
            Perfil
          </button>
        </div>
      </nav>
    </>
  );
}
