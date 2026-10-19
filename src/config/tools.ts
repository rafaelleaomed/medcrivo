import {
  BookOpen,
  CalendarDays,
  Film,
  FolderOpen,
  Grid,
  Layers,
  Library,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { MedcrivoFolderArt } from "@/components/ui/medcrivo-folder-art";

/**
 * Registro único das ferramentas do estúdio. O painel (pastas de vidro) e a navegação leem daqui.
 * Para adicionar uma ferramenta: crie a rota em src/app/app/<slug>/ e mude `status` para "pronto".
 * Textos curtos de propósito: o painel é premium e com pouca leitura.
 */
export type ToolGroupId = "criar" | "planejar" | "revisar";
export type ToolStatus = "pronto" | "em-construcao";

export type StudioTool = {
  id: string;
  href: string;
  label: string;
  /** Até ~5 palavras. Vai no arquivo dentro da pasta. */
  hint: string;
  icon: LucideIcon;
  group: ToolGroupId;
  status: ToolStatus;
};

export type ToolGroup = { id: ToolGroupId; label: string; art: MedcrivoFolderArt; tone: "light" | "dark" };

export const TOOL_GROUPS: ToolGroup[] = [
  { id: "criar", label: "Criar", art: "crivo", tone: "dark" },
  { id: "planejar", label: "Planejar", art: "marfim", tone: "light" },
  { id: "revisar", label: "Revisar", art: "noite", tone: "dark" },
];

export const STUDIO_TOOLS: StudioTool[] = [
  // Criar
  { id: "carrossel", href: "/app/carrossel", label: "Carrossel", hint: "Tema → post 4:5", icon: Layers, group: "criar", status: "pronto" },
  { id: "video", href: "/app/video", label: "Reels", hint: "Roteiro e teleprompter", icon: Film, group: "criar", status: "pronto" },
  { id: "stories", href: "/app/stories", label: "Stories", hint: "Sequência do dia", icon: Smartphone, group: "criar", status: "em-construcao" },
  { id: "ideias", href: "/app/ideias", label: "Ideias", hint: "Pautas, notícias e artigos", icon: Lightbulb, group: "criar", status: "em-construcao" },
  { id: "assistente", href: "/app/assistente", label: "Assistente", hint: "Converse com a IA", icon: MessageSquareText, group: "criar", status: "em-construcao" },
  // Planejar
  { id: "planner", href: "/app/planner", label: "Planner", hint: "Calendário editorial", icon: CalendarDays, group: "planejar", status: "em-construcao" },
  { id: "conteudos", href: "/app/conteudos", label: "Meus conteúdos", hint: "Tudo que você criou", icon: FolderOpen, group: "planejar", status: "em-construcao" },
  { id: "biblioteca", href: "/app/biblioteca", label: "Biblioteca", hint: "Modelos por especialidade", icon: Library, group: "planejar", status: "em-construcao" },
  { id: "feed", href: "/app/feed", label: "Feed", hint: "Prévia da grade", icon: Grid, group: "planejar", status: "pronto" },
  // Revisar
  { id: "crivo", href: "/app/crivo", label: "Crivo", hint: "Normas CFM/CFO e LGPD", icon: ShieldCheck, group: "revisar", status: "pronto" },
  { id: "evidencias", href: "/app/evidencias", label: "Evidências", hint: "Referências reais", icon: BookOpen, group: "revisar", status: "pronto" },
];

export function toolsInGroup(group: ToolGroupId): StudioTool[] {
  return STUDIO_TOOLS.filter((t) => t.group === group);
}

export function toolById(id: string): StudioTool | undefined {
  return STUDIO_TOOLS.find((t) => t.id === id);
}
