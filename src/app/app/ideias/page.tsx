import { Suspense } from "react";
import type { Metadata } from "next";
import { IdeasView } from "@/components/creator/IdeasView";

export const metadata: Metadata = { title: "Ideias" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// searchParams é dado da requisição: com cacheComponents, a leitura fica dentro de <Suspense>.
async function Ideias({ searchParams }: { searchParams: SearchParams }) {
  const { tema } = await searchParams;
  return <IdeasView initialTheme={typeof tema === "string" ? tema.slice(0, 300) : ""} />;
}

export default function IdeiasPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <Ideias searchParams={searchParams} />
    </Suspense>
  );
}
