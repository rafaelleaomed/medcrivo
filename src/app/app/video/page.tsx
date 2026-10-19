import type { Metadata } from "next";
import { VideoView } from "@/components/studio/views";

export const metadata: Metadata = { title: "Roteiro de vídeo" };

export default function VideoPage() {
  return <VideoView />;
}
