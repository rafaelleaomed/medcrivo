"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { POST_STATUS_LABELS, POST_STATUSES, type PostStatus } from "@/lib/planner/planner";
import { cn } from "@/lib/utils";

/** Seletor de status do post; grava na hora (PATCH /api/posts/:id) e avisa o pai. */
export function StatusSelect({
  postId,
  value,
  onChange,
  className,
}: {
  postId: string;
  value: PostStatus;
  onChange?: (status: PostStatus) => void;
  className?: string;
}) {
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function change(next: PostStatus) {
    const previous = status;
    setStatus(next);
    setSaving(true);
    setFailed(false);
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).catch(() => null);
    setSaving(false);
    if (!res?.ok) {
      setStatus(previous);
      setFailed(true);
      return;
    }
    onChange?.(next);
  }

  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">Status do post</span>
      <span aria-hidden className={cn("pointer-events-none absolute left-3 h-1.5 w-1.5", STATUS_DOT[status])} />
      <select
        value={status}
        disabled={saving}
        onChange={(e) => change(e.target.value as PostStatus)}
        aria-invalid={failed || undefined}
        title={failed ? "Não foi possível salvar. Tente de novo." : undefined}
        className={cn(
          "h-9 cursor-pointer appearance-none rounded-full border bg-transparent pl-7 pr-4 font-mono text-[11px] font-bold uppercase tracking-wider text-tinta outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-60 dark:text-marfim",
          failed ? "border-amber-500" : "border-[var(--border-subtle)]",
        )}
      >
        {POST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {POST_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </label>
  );
}

const STATUS_DOT: Record<PostStatus, string> = {
  draft: "bg-[var(--text-muted)]",
  approved: "bg-teal-700 dark:bg-lima",
  scheduled: "bg-amber-500",
  published: "bg-pinho dark:bg-marfim",
};

/** Nota do Crivo compacta (só número e ícone). */
export function CrivoScore({ score, approved }: { score: number | null; approved: boolean | null }) {
  if (score === null) return null;
  const Icon = approved ? ShieldCheck : ShieldAlert;
  return (
    <span
      title={approved ? "Crivo: sem bloqueios automáticos" : "Crivo: revise antes de publicar"}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider",
        approved ? "text-teal-700 dark:text-lima" : "text-amber-700 dark:text-amber-300",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      Crivo {score}
    </span>
  );
}
