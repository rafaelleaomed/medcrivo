import { Suspense } from "react";
import type { Metadata } from "next";
import { StoriesView } from "@/components/creator/StoriesView";

export const metadata: Metadata = { title: "Stories" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// searchParams é dado da requisição: com cacheComponents, a leitura fica dentro de <Suspense>.
async function Stories({ searchParams }: { searchParams: SearchParams }) {
  const { tema } = await searchParams;
  return <StoriesView initialTopic={typeof tema === "string" ? tema.slice(0, 300) : ""} />;
}

export default function StoriesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <Stories searchParams={searchParams} />
    </Suspense>
  );
}
