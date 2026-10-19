import type { Metadata } from "next";
import { FeedPreview } from "@/components/studio/FeedPreview";

export const metadata: Metadata = { title: "Feed 3×3" };

export default function FeedPage() {
  return <FeedPreview />;
}
