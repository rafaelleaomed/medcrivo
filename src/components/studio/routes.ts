import { BookOpen, CheckSquare2, Film, Grid, Home, Layers, ShieldCheck, type LucideIcon } from "lucide-react";

/** Rotas do app autenticado (estúdio). */
export const STUDIO_ROUTES = {
  home: "/app",
  carousel: "/app/carrossel",
  video: "/app/video",
  feed: "/app/feed",
  crivo: "/app/crivo",
  evidence: "/app/evidencias",
  approvals: "/app/aprovacoes",
} as const;

export type StudioNavItem = { href: string; label: string; shortLabel: string; icon: LucideIcon; description: string };

export const STUDIO_NAV: StudioNavItem[] = [
  { href: STUDIO_ROUTES.home, label: "Início", shortLabel: "Início", icon: Home, description: "Seu painel e as pautas sugeridas." },
  {
    href: STUDIO_ROUTES.carousel,
    label: "Carrossel 4:5",
    shortLabel: "Post",
    icon: Layers,
    description: "Do tema ao carrossel com a sua identidade visual, legenda pronta e revisão do Crivo.",
  },
  {
    href: STUDIO_ROUTES.video,
    label: "Roteiro de vídeo",
    shortLabel: "Vídeo",
    icon: Film,
    description: "Roteiro de Reels com gancho, desenvolvimento e CTA ético, com teleprompter.",
  },
  {
    href: STUDIO_ROUTES.feed,
    label: "Feed 3×3",
    shortLabel: "Feed",
    icon: Grid,
    description: "Veja como o post fica na grade antes de publicar.",
  },
  {
    href: STUDIO_ROUTES.approvals,
    label: "Aprovações",
    shortLabel: "Aprovar",
    icon: CheckSquare2,
    description: "Veja artes, projetos e rascunhos; aprove ou peça ajustes em um só lugar.",
  },
  {
    href: STUDIO_ROUTES.crivo,
    label: "Crivo",
    shortLabel: "Crivo",
    icon: ShieldCheck,
    description: "Revise qualquer texto pelas normas do CFM e a LGPD; veja trecho, norma e sugestão.",
  },
  {
    href: STUDIO_ROUTES.evidence,
    label: "Evidências",
    shortLabel: "Ciência",
    icon: BookOpen,
    description: "Referências científicas reais do post; sem referência, nada é inventado.",
  },
];

export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === STUDIO_ROUTES.home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
