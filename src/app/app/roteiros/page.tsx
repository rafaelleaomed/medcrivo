import { Suspense } from "react";
import type { Metadata } from "next";
import { ReelsView } from "@/components/creator/ReelsView";

export const metadata: Metadata = { title: "Roteiros" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// searchParams é dado da requisição: com cacheComponents, a leitura fica dentro de <Suspense>.
async function Roteiros({ searchParams }: { searchParams: SearchParams }) {
  const { tema } = await searchParams;
  return <ReelsView initialTopic={typeof tema === "string" ? tema.slice(0, 300) : ""} />;
}

export default function RoteirosPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <Roteiros searchParams={searchParams} />
    </Suspense>
  );
}
