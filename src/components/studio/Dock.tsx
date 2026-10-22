"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { STUDIO_TOOLS } from "@/config/tools";
import { cn } from "@/lib/utils";
import { STUDIO_ROUTES, isActiveRoute } from "./routes";

type DockItem = { href: string; label: string; icon: LucideIcon };

const ITEMS: DockItem[] = [
  { href: STUDIO_ROUTES.home, label: "Início", icon: Home },
  ...STUDIO_TOOLS.filter((t) => t.status === "pronto").map((t) => ({ href: t.href, label: t.label, icon: t.icon })),
];

/** Tamanho do botão em repouso e no pico de proximidade do mouse (cabe na barra de 64 px). */
const BASE = 36;
const PEAK = 58;
const RADIUS = 110;

function DockIcon({ item, mouseX, active, still }: { item: DockItem; mouseX: MotionValue<number>; active: boolean; still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Distância do centro deste ícone até o mouse: perto = maior, como o dock do macOS.
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    return box ? x - box.x - box.width / 2 : Number.POSITIVE_INFINITY;
  });
  const size = useSpring(useTransform(distance, [-RADIUS, 0, RADIUS], [BASE, PEAK, BASE]), { mass: 0.1, stiffness: 150, damping: 12 });
  const glyph = useSpring(useTransform(distance, [-RADIUS, 0, RADIUS], [16, 28, 16]), { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = item.icon;
  return (
    <div className="relative flex h-16 items-center">
      <motion.div ref={ref} style={still ? { width: BASE, height: BASE } : { width: size, height: size }} className="relative">
        <Link
          href={item.href}
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
            active
              ? "border-teal-600/60 bg-teal-600/10 text-teal-700 dark:border-lima/60 dark:bg-lima/10 dark:text-lima"
              : "border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]",
          )}
        >
          <motion.span style={still ? { width: 16, height: 16 } : { width: glyph, height: glyph }} className="pointer-events-none flex items-center justify-center">
            <Icon className="h-full w-full" aria-hidden />
          </motion.span>
        </Link>
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute left-1/2 top-[calc(100%+14px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-pinho px-2.5 py-1 text-[11px] font-bold text-marfim shadow-xl"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {active && <span aria-hidden className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-teal-600 dark:bg-lima" />}
      </motion.div>
    </div>
  );
}

/** Menu do estúdio no computador: ícones que crescem e levantam quando o mouse passa por perto. */
export function Dock() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const reduced = useReducedMotion() ?? false;

  return (
    <nav
      aria-label="Estúdio"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="hidden flex-1 items-center justify-center gap-2 lg:flex"
    >
      {ITEMS.map((item) => (
        <DockIcon key={item.href} item={item} mouseX={mouseX} still={reduced} active={isActiveRoute(pathname, item.href)} />
      ))}
    </nav>
  );
}
