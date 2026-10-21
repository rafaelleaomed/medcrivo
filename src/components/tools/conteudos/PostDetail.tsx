"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { PostStudio } from "@/components/PostStudio";
import { useStudio } from "@/components/studio/StudioProvider";
import type { PostRecord } from "@/lib/store/types";
import { StatusSelect } from "./PostStatus";

/** Post salvo aberto por link: o rascunho vem do banco, então nada se perde ao recarregar. */
export function PostDetail({ post }: { post: PostRecord }) {
  const { profile } = useStudio();
  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <Link
          href="/app/conteudos"
          className="inline-flex h-10 items-center gap-1.5 rounded-full pr-3 text-sm font-semibold text-teal-700 hover:underline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-lima"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Meus conteúdos
        </Link>
        <div className="flex items-center gap-2">
          <StatusSelect postId={post.id} value={post.status} />
          <ButtonLink href={`/app/planner?post=${post.id}`}>
            <CalendarPlus className="h-4 w-4" aria-hidden /> Agendar
          </ButtonLink>
        </div>
      </nav>
      <PostStudio draft={post.draft} profile={profile} />
    </div>
  );
}
