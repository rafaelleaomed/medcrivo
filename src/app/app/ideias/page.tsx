import type { Metadata } from "next";
import { IdeasView } from "@/components/creator/IdeasView";

export const metadata: Metadata = { title: "Ideias" };

export default async function IdeiasPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { tema } = await searchParams;
  return <IdeasView initialTheme={typeof tema === "string" ? tema.slice(0, 300) : ""} />;
}
