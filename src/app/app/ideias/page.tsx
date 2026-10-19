import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Ideias" };

export default function IdeiasPage() {
  return <ToolPlaceholder toolId="ideias" />;
}
