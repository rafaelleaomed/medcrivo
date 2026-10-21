import { Suspense } from "react";
import type { Metadata } from "next";
import { z } from "zod";
import { PlannerView } from "@/components/tools/planner/PlannerView";

export const metadata: Metadata = { title: "Planner" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// searchParams é dado da requisição: com cacheComponents, a leitura fica dentro de <Suspense>.
async function Planner({ searchParams }: { searchParams: SearchParams }) {
  const post = z.uuid().safeParse((await searchParams).post);
  return <PlannerView initialPostId={post.success ? post.data : null} />;
}

export default function PlannerPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <Planner searchParams={searchParams} />
    </Suspense>
  );
}
