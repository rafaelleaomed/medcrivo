import { Film, Image as ImageIcon, Layers, Smartphone, type LucideIcon } from "lucide-react";
import type { PlannerFormat } from "@/lib/planner/planner";

export const FORMAT_ICONS: Record<PlannerFormat, LucideIcon> = {
  carrossel: Layers,
  reels: Film,
  stories: Smartphone,
  imagem: ImageIcon,
};
