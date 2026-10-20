import type { Metadata } from "next";
import { StoriesView } from "@/components/creator/StoriesView";

export const metadata: Metadata = { title: "Stories" };

export default async function StoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { tema } = await searchParams;
  return <StoriesView initialTopic={typeof tema === "string" ? tema.slice(0, 300) : ""} />;
}
