import type { Metadata } from "next";
import { PostsView } from "@/components/tools/conteudos/PostsView";

export const metadata: Metadata = { title: "Meus conteúdos" };

export default function ConteudosPage() {
  return <PostsView />;
}
