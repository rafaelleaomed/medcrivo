import type { Metadata } from "next";
import { CarouselView } from "@/components/studio/views";

export const metadata: Metadata = { title: "Carrossel" };

export default function CarouselPage() {
  return <CarouselView />;
}
