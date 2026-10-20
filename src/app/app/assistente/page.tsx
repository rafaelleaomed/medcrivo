import type { Metadata } from "next";
import { AssistantView } from "@/components/creator/AssistantView";

export const metadata: Metadata = { title: "Assistente" };

export default function AssistentePage() {
  return <AssistantView />;
}
