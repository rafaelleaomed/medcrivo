import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Meus conteúdos" };

export default function ConteudosPage() {
  return <ToolPlaceholder toolId="conteudos" />;
}
