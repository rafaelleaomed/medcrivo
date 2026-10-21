import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { PostDetail } from "@/components/tools/conteudos/PostDetail";

export const metadata: Metadata = { title: "Post" };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();

  const store = await getStore();
  if (!store) redirect("/login");

  const post = await store.getPost(id.data);
  if (!post) notFound();

  return <PostDetail post={post} />;
}
