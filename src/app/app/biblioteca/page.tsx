import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Biblioteca" };

export default function BibliotecaPage() {
  return <ToolPlaceholder toolId="biblioteca" />;
}
