"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Layers, Plus } from "lucide-react";
import { ButtonLink, EmptyState } from "@/components/ui";
import { ErrorNote, Segmented, ToolTitle } from "@/components/creator/shared";
import { useStudio } from "@/components/studio/StudioProvider";
import { SlideCanvas } from "@/components/slides/SlideTemplates";
import { POST_STATUS_LABELS, POST_STATUSES, type PostStatus } from "@/lib/planner/planner";
import type { PostSummary } from "@/lib/store/types";
import { CrivoScore, StatusSelect } from "./PostStatus";

type Filter = "all" | PostStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  ...POST_STATUSES.map((s) => ({ value: s, label: POST_STATUS_LABELS[s] })),
];

const DATE = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

export function PostsView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: Filter) => {
    setError(null);
    const qs = f === "all" ? "" : `?status=${f}`;
    const data = await fetch(`/api/posts${qs}`)
      .then((r) => r.json())
      .catch(() => null);
    if (data?.success) setPosts(data.posts);
    else {
      setPosts([]);
      setError(data?.error ?? "Não foi possível carregar seus conteúdos.");
    }
  }, []);

  useEffect(() => {
    // Carga da lista ao abrir e ao trocar o filtro (sincronização com o servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(filter);
  }, [filter, load]);

  function onStatusChange(id: string, status: PostStatus) {
    setPosts((list) =>
      (list ?? [])
        .map((p) => (p.id === id ? { ...p, status } : p))
        .filter((p) => filter === "all" || p.status === filter),
    );
  }

  const hasPosts = !!posts?.length;

  return (
    <div className="space-y-6">
      <ToolTitle
        label="Planejar · Conteúdos"
        title="Meus conteúdos"
        aside={
          hasPosts || filter !== "all" ? (
            <ButtonLink href="/app/carrossel">
              <Plus className="h-4 w-4" aria-hidden /> Novo carrossel
            </ButtonLink>
          ) : null
        }
      />

      <Segmented label="Filtrar por status" value={filter} options={FILTERS} onChange={setFilter} />
      <ErrorNote message={error} />

      {posts === null ? (
        <PostsSkeleton />
      ) : hasPosts ? (
        <ul className="grid border-l border-t border-[var(--border-subtle)] grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCell key={post.id} post={post} onStatusChange={(s) => onStatusChange(post.id, s)} />
          ))}
        </ul>
      ) : filter === "all" ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" aria-hidden />}
          title="Nenhum post salvo ainda"
          action={
            <ButtonLink href="/app/carrossel">
              <Layers className="h-4 w-4" aria-hidden /> Criar carrossel
            </ButtonLink>
          }
        />
      ) : (
        <EmptyState icon={<FolderOpen className="h-6 w-6" aria-hidden />} title={`Nada em “${POST_STATUS_LABELS[filter]}”`} />
      )}
    </div>
  );
}

function PostCell({ post, onStatusChange }: { post: PostSummary; onStatusChange: (status: PostStatus) => void }) {
  const { profile } = useStudio();
  const href = `/app/conteudos/${post.id}`;
  return (
    <li className="group flex flex-col border-b border-r border-[var(--border-subtle)] bg-white/70 dark:bg-[#132D29]/70">
      <Link
        href={href}
        className="block flex-1 p-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600"
      >
        <div className="overflow-hidden bg-[var(--bg-card-subtle)] transition-transform duration-300 group-hover:scale-[0.985] motion-reduce:transition-none">
          {post.cover ? (
            <SlideCanvas slide={post.cover} total={post.slideCount ?? post.cover.number} profile={profile} />
          ) : (
            <div className="grid aspect-[4/5] place-items-center text-[var(--text-muted)]">
              <Layers className="h-6 w-6" aria-hidden />
            </div>
          )}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {DATE.format(new Date(post.createdAt)).replace(".", "")}
        </p>
        <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-tinta dark:text-marfim">{post.topic}</h2>
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-3">
        <StatusSelect key={post.status} postId={post.id} value={post.status} onChange={onStatusChange} />
        <CrivoScore score={post.score} approved={post.isApproved} />
      </div>
    </li>
  );
}

function PostsSkeleton() {
  return (
    <ul aria-hidden className="grid border-l border-t border-[var(--border-subtle)] grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="border-b border-r border-[var(--border-subtle)] p-3">
          <div className="aspect-[4/5] animate-pulse bg-[var(--bg-card-subtle)] motion-reduce:animate-none" />
          <div className="mt-3 h-3 w-1/3 animate-pulse bg-[var(--bg-card-subtle)] motion-reduce:animate-none" />
          <div className="mt-2 h-4 w-4/5 animate-pulse bg-[var(--bg-card-subtle)] motion-reduce:animate-none" />
        </li>
      ))}
    </ul>
  );
}
