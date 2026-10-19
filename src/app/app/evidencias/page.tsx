import type { Metadata } from "next";
import { EvidenceView } from "@/components/studio/views";

export const metadata: Metadata = { title: "Evidências" };

export default function EvidencePage() {
  return <EvidenceView />;
}
