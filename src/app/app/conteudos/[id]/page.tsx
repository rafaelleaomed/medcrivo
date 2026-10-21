import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { PostDetail } from "@/components/tools/conteudos/PostDetail";

export const metadata: Metadata = { title: "Post" };

type Params = Promise<{ id: string }>;

// params e cookies são dados da requisição: com cacheComponents, a leitura fica dentro de <Suspense>.
async function Post({ params }: { params: Params }) {
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();

  const store = await getStore();
  if (!store) redirect("/login");

  const post = await store.getPost(id.data);
  if (!post) notFound();

  return <PostDetail post={post} />;
}

export default function PostPage({ params }: { params: Params }) {
  return (
    <Suspense>
      <Post params={params} />
    </Suspense>
  );
}
