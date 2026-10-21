import type { Metadata } from "next";
import { z } from "zod";
import { PlannerView } from "@/components/tools/planner/PlannerView";

export const metadata: Metadata = { title: "Planner" };

export default async function PlannerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const post = z.uuid().safeParse((await searchParams).post);
  return <PlannerView initialPostId={post.success ? post.data : null} />;
}
