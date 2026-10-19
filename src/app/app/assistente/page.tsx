import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Assistente" };

export default function AssistentePage() {
  return <ToolPlaceholder toolId="assistente" />;
}
