"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  LayoutDashboard,
  Grid,
  Layers,
  Zap,
  Film,
  Shield,
  BookOpen,
  Send,
  Sun,
  Moon,
  Stethoscope,
  Settings,
} from "lucide-react";

interface FloatingHeaderProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  doctorName: string;
  crm: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenSettings?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

export function FloatingHeader({
  activeTab,
  onSelectTab,
  doctorName,
  crm,
  theme,
  onToggleTheme,
  onOpenSettings,
}: FloatingHeaderProps) {
  // Motion value desktop (mouseX) e mobile (touchX) para magnificação fluida
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const touchX = useMotionValue(Number.POSITIVE_INFINITY);

  const navItems: NavItem[] = [
    { id: "home", label: "Página Inicial", shortLabel: "Início", icon: LayoutDashboard },
    { id: "carousel", label: "Carrossel 4:5", shortLabel: "Post", icon: Layers },
    { id: "vturb", label: "Roteiro de Vídeo", shortLabel: "Vídeo", icon: Film },
    { id: "feed", label: "Feed 3x3", shortLabel: "Feed", icon: Grid },
    { id: "virality", label: "Radar Viral", shortLabel: "Radar", icon: Zap },
    { id: "compliance", label: "Auditor CFM", shortLabel: "CFM", icon: Shield },
    { id: "evidence", label: "Consensus AI", shortLabel: "Ciência", icon: BookOpen },
  ];

  return (
    <>
      {/* ========================================================
          1. HEADER DESKTOP (Dock macOS Flutuante com Magnificação)
          Visível a partir de sm (640px+)
         ======================================================== */}
      <header className="hidden md:flex sticky top-4 z-50 max-w-5xl mx-auto px-4 w-full justify-center overflow-visible">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#101622]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-colors duration-300"
        >
          {/* Brand / Mini Perfil Médico */}
          <div className="flex items-center gap-2 pl-1.5 pr-2 group cursor-pointer select-none">
            <div className="w-8 h-8 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-black text-sm shadow-md transition-transform duration-300 group-hover:scale-110">
              <Stethoscope className="w-4 h-4 text-white dark:text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                CuidaAI <span className="text-teal-600 dark:text-teal-400">Studio</span>
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono leading-tight mt-0.5">
                Dr. {doctorName.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* Divisor Vertical */}
          <hr className="h-7 w-px shrink-0 border-0 bg-slate-200 dark:bg-slate-800 my-auto" />

          {/* Trilho de Ícones do Dock com Física Fluida macOS (Ruixen UI Original) */}
          <div className="flex items-center gap-2 px-1 overflow-visible">
            {navItems.map((item) => (
              <DockIcon
                key={item.id}
                mouseX={mouseX}
                title={item.label}
                isActive={activeTab === item.id}
                onClick={() => onSelectTab(item.id)}
              >
                <item.icon className="w-full h-full" />
              </DockIcon>
            ))}

            {/* Divisor Interno */}
            <hr className="h-6 w-px shrink-0 border-0 bg-slate-200 dark:bg-slate-800 my-auto" />

            {/* Botão de Tema (Dark / Light) */}
            <DockIcon
              mouseX={mouseX}
              title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              onClick={onToggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-full h-full text-amber-400" />
              ) : (
                <Moon className="w-full h-full text-slate-700" />
              )}
            </DockIcon>

            {/* Botão de Perfil / Interesses */}
            {onOpenSettings && (
              <DockIcon
                mouseX={mouseX}
                title="Configurar Perfil & Interesses"
                onClick={onOpenSettings}
              >
                <Settings className="w-full h-full text-slate-600 dark:text-slate-300" />
              </DockIcon>
            )}
          </div>

          {/* Divisor Vertical */}
          <hr className="h-7 w-px shrink-0 border-0 bg-slate-200 dark:bg-slate-800 my-auto" />

          {/* Botão de Publicação Direta */}
          <div className="flex items-center pl-1 pr-1.5">
            <button
              type="button"
              onClick={() => alert("Post aprovado e sincronizado com o Meta Graph API!")}
              className="h-9 px-3.5 rounded-full bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </motion.div>
      </header>

      {/* ========================================================
          2. MOBILE: TOP BAR RESPONSIVA (Zero Overflow, 100% Touch)
          Visível apenas em telas menores que md (< 768px)
         ======================================================== */}
      <header className="flex md:hidden sticky top-2 z-50 w-full px-3 mx-auto">
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#101622]/95 backdrop-blur-2xl shadow-md transition-colors duration-300">
          {/* Identidade Médica */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-black text-sm shadow-sm shrink-0">
              <Stethoscope className="w-4 h-4 text-white dark:text-slate-950" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                CuidaAI <span className="text-teal-600 dark:text-teal-400">Studio</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Dr. {doctorName.split(" ")[0]} • {crm.split(" ")[1] || crm}
              </span>
            </div>
          </div>

          {/* Ações Rápidas no Topo: Tema + Publicar */}
          <div className="flex items-center gap-1.5">
            {/* Botão de Tema (Modo Claro / Escuro) dedicado para celular */}
            <motion.button
              type="button"
              onClick={onToggleTheme}
              whileTap={{ scale: 0.85 }}
              title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 active:bg-slate-200 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </motion.button>

            {/* Botão de Perfil / Interesses no Mobile */}
            {onOpenSettings && (
              <motion.button
                type="button"
                onClick={onOpenSettings}
                whileTap={{ scale: 0.85 }}
                title="Configurar Perfil & Interesses"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 active:bg-slate-200 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </motion.button>
            )}

            {/* Botão de Publicação Direta Mobile */}
            <motion.button
              type="button"
              onClick={() => alert("Post aprovado e sincronizado com o Meta Graph API!")}
              whileTap={{ scale: 0.9 }}
              className="h-9 px-3 rounded-full bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Postar</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ========================================================
          3. MOBILE: BOTTOM DOCK MAGNIFICADO (Estilo iOS / Ruixen)
          Fixado no rodapé com toque ultra-responsivo e efeito magnify
         ======================================================== */}
      <nav
        aria-label="Navegação mobile"
        className="flex md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-[430px] px-1 pointer-events-auto"
      >
        <div
          onTouchMove={(e) => {
            if (e.touches[0]) touchX.set(e.touches[0].clientX);
          }}
          onTouchEnd={() => touchX.set(Number.POSITIVE_INFINITY)}
          className="w-full flex items-center justify-around py-1.5 px-2 rounded-full border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#101622]/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors duration-300"
        >
          {navItems.map((item) => (
            <MobileDockIcon
              key={item.id}
              touchX={touchX}
              label={item.shortLabel}
              isActive={activeTab === item.id}
              onClick={() => onSelectTab(item.id)}
            >
              <item.icon className="w-full h-full" />
            </MobileDockIcon>
          ))}
        </div>
      </nav>
    </>
  );
}

// ========================================================
// Componente DockIcon Desktop (Física idêntica ao Ruixen UI)
// ========================================================
function DockIcon({
  mouseX,
  title,
  isActive = false,
  onClick,
  children,
}: {
  mouseX: any;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  // Cálculo da distância exata do centro deste ícone até o mouseX
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Raio de 150px: cresce de 40px para 80px no pico de proximidade
  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  // Escala PROPORCIONAL do ícone interno (de 18px base até 38px no pico!)
  const iconSizeTransform = useTransform(distance, [-150, 0, 150], [18, 38, 18]);

  // Mola ultra-fluida (Apple Spring Physics)
  const springConfig = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(widthTransform, springConfig);
  const height = useSpring(heightTransform, springConfig);
  const iconSize = useSpring(iconSizeTransform, springConfig);

  return (
    <motion.button
      type="button"
      ref={ref}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.92 }}
      className={`relative flex cursor-pointer items-center justify-center rounded-full select-none transition-colors duration-200 shrink-0 ${
        isActive
          ? "bg-teal-50 dark:bg-teal-950/70 border border-teal-500/50 text-teal-700 dark:text-teal-300 shadow-sm shadow-teal-500/10"
          : "bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
      }`}
    >
      {/* Tooltip elegante animado via AnimatePresence */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-lg border border-slate-200/90 dark:border-slate-800/90 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-2.5 py-1 text-[11px] font-bold shadow-xl backdrop-blur-md pointer-events-none"
          >
            {title}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900/95 dark:border-b-slate-100/95" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ícone interno que cresce PROPORCIONALMENTE de 18px para 38px */}
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center overflow-hidden pointer-events-none"
      >
        {children}
      </motion.div>

      {/* Indicador de Aba Ativa (Dot central inferior idêntico ao macOS dock) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-sm"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ========================================================
// Componente MobileDockIcon (Ultra responsivo para Celular)
// Suporta toque direto e magnificação contínua ao arrastar o dedo
// ========================================================
function MobileDockIcon({
  touchX,
  label,
  isActive = false,
  onClick,
  children,
}: {
  touchX: any;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distância do toque em relação a este ícone mobile
  const distance = useTransform(touchX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Magnificação no celular: aumenta de 42px para 58px quando o dedo passa por cima
  const sizeTransform = useTransform(distance, [-60, 0, 60], [42, 58, 42]);
  const iconSizeTransform = useTransform(distance, [-60, 0, 60], [20, 28, 20]);
  const yTransform = useTransform(distance, [-60, 0, 60], [0, -8, 0]);

  const springConfig = { mass: 0.1, stiffness: 220, damping: 15 };
  const size = useSpring(sizeTransform, springConfig);
  const iconSize = useSpring(iconSizeTransform, springConfig);
  const y = useSpring(yTransform, springConfig);

  return (
    <motion.button
      type="button"
      ref={ref}
      style={{ width: size, height: size, y }}
      onClick={onClick}
      whileTap={{ scale: 1.25, y: -6 }}
      className={`relative flex flex-col items-center justify-center rounded-full select-none cursor-pointer transition-colors duration-150 shrink-0 ${
        isActive
          ? "bg-teal-500/20 dark:bg-teal-500/30 text-teal-600 dark:text-teal-300 font-bold border border-teal-500/50 shadow-sm shadow-teal-500/20"
          : "bg-transparent text-slate-600 dark:text-slate-400 active:bg-slate-200 dark:active:bg-slate-800"
      }`}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center overflow-hidden pointer-events-none"
      >
        {children}
      </motion.div>

      {/* Ponto indicador de aba ativa */}
      {isActive && (
        <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-teal-500 shadow-sm" />
      )}
    </motion.button>
  );
}
