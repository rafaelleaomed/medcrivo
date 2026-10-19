import type { Metadata } from "next";
import { ToolPlaceholder } from "@/components/studio/ToolPlaceholder";

export const metadata: Metadata = { title: "Planner" };

export default function PlannerPage() {
  return <ToolPlaceholder toolId="planner" />;
}
