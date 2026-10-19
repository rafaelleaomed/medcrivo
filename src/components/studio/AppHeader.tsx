"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { logout } from "@/app/login/actions";
import { STUDIO_NAV, STUDIO_ROUTES, isActiveRoute } from "./routes";
import { useStudio } from "./StudioProvider";
import { greetingName } from "@/lib/profile";

const ICON_BUTTON =
  "grid h-9 w-9 place-items-center rounded-full border border-[var(--border-subtle)] bg-white text-tinta transition-colors hover:bg-teal-50 dark:bg-[#132D29] dark:text-marfim dark:hover:bg-marfim/10 cursor-pointer";


export function AppHeader() {
  const pathname = usePathname();
  const { profile, theme, toggleTheme, setProfileOpen, storeMode } = useStudio();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href={STUDIO_ROUTES.home} className="shrink-0" aria-label="Início do MedCrivo Studio">
            <BrandMark size={28} className="text-base" />
          </Link>

          <nav aria-label="Estúdio" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {STUDIO_NAV.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-pinho text-marfim dark:bg-lima dark:text-pinho"
                      : "text-[var(--text-muted)] hover:bg-teal-50 hover:text-tinta dark:hover:bg-marfim/10 dark:hover:text-marfim"
                  }`}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  <span className="xl:hidden">{item.shortLabel}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {storeMode === "local" && (
              <span className="hidden whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 sm:inline">
                Modo local
              </span>
            )}
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="hidden h-9 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-subtle)] bg-white px-3 text-xs font-semibold text-tinta hover:bg-teal-50 sm:inline-flex dark:bg-[#132D29] dark:text-marfim dark:hover:bg-marfim/10 cursor-pointer"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              {greetingName(profile) || "Seu perfil"}
            </button>
            <button type="button" onClick={() => setProfileOpen(true)} className={`${ICON_BUTTON} sm:hidden`} aria-label="Perfil">
              <UserRound className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={ICON_BUTTON}
              aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {storeMode === "supabase" && (
              <form action={logout}>
                <button type="submit" className={ICON_BUTTON} aria-label="Sair">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Navegação inferior no celular e tablet */}
      <nav
        aria-label="Estúdio (celular)"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-6">
          {STUDIO_NAV.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${
                    active ? "text-teal-700 dark:text-lima" : "text-[var(--text-muted)]"
                  }`}
                >
                  <item.icon className="h-5 w-5" aria-hidden />
                  {item.shortLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
