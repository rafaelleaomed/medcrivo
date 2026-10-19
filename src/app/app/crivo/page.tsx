import type { Metadata } from "next";
import { CrivoView } from "@/components/studio/views";

export const metadata: Metadata = { title: "Crivo" };

export default function StudioCrivoPage() {
  return <CrivoView />;
}
