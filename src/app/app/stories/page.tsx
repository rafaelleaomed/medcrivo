import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Stories" };

export default function StoriesPage() {
  return <ToolPlaceholder toolId="stories" />;
}
