"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui";
import { ErrorNote, Segmented } from "@/components/creator/shared";
import {
  FORMAT_LABELS,
  fromLocalInputs,
  PLANNER_FORMATS,
  SUGGESTED_HOURS,
  type PlannerFormat,
  type PlannerItem,
  type PlannerStatus,
} from "@/lib/planner/planner";
import type { PostSummary } from "@/lib/store/types";
import { cn } from "@/lib/utils";

export type PlannerDraft = {
  id?: string;
  postId: string | null;
  title: string;
  format: PlannerFormat;
  date: string;
  time: string;
  note: string;
  status: PlannerStatus;
};

type Source = "post" | "livre";

const FORMAT_OPTIONS = PLANNER_FORMATS.map((value) => ({ value, label: FORMAT_LABELS[value] }));
const FIELD =
  "w-full rounded-2xl border border-[var(--border-subtle)] bg-white px-4 text-sm text-tinta outline-none placeholder:text-[var(--text-muted)] focus:border-teal-600 dark:bg-[#132D29] dark:text-marfim";
const LABEL = "font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]";
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** Agendar ou editar um item do planner (diálogo nativo: Esc fecha, foco preso no modal). */
export function PlannerDialog({
  draft,
  posts,
  onClose,
  onSaved,
  onDeleted,
}: {
  draft: PlannerDraft;
  posts: PostSummary[];
  onClose: () => void;
  onSaved: (item: PlannerItem, created: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState(draft);
  const [source, setSource] = useState<Source>(draft.postId || (!draft.id && posts.length) ? "post" : "livre");
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editing = !!draft.id;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const set = <K extends keyof PlannerDraft>(key: K, value: PlannerDraft[K]) => setForm((f) => ({ ...f, [key]: value }));

  function pickPost(id: string) {
    const post = posts.find((p) => p.id === id);
    setForm((f) => ({ ...f, postId: post?.id ?? null, title: post?.topic.slice(0, 200) ?? f.title, format: "carrossel" }));
  }

  function changeSource(next: Source) {
    setSource(next);
    if (next === "livre") setForm((f) => ({ ...f, postId: null }));
    else if (!form.postId && posts[0]) pickPost(posts[0].id);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const scheduledAt = fromLocalInputs(form.date, form.time);
    if (!scheduledAt) return setError("Escolha data e hora.");
    if (source === "post" && !form.postId) return setError("Escolha um post.");
    if (!form.title.trim()) return setError("Dê um título.");
    setBusy("save");
    setError(null);
    const body = {
      postId: source === "post" ? form.postId : null,
      title: form.title.trim(),
      format: form.format,
      scheduledAt,
      note: form.note.trim(),
      status: form.status,
    };
    const res = await fetch(editing ? `/api/planner/${draft.id}` : "/api/planner", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setBusy(null);
    if (!data?.success) return setError(data?.error ?? "Não foi possível salvar.");
    onSaved(data.item, !editing);
  }

  async function remove() {
    if (!draft.id) return;
    setBusy("delete");
    setError(null);
    const res = await fetch(`/api/planner/${draft.id}`, { method: "DELETE" }).catch(() => null);
    setBusy(null);
    if (!res?.ok) return setError("Não foi possível remover.");
    onDeleted(draft.id);
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="planner-dialog-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-3xl border border-[var(--border-subtle)] bg-marfim p-0 text-tinta shadow-2xl backdrop:bg-pinho/40 backdrop:backdrop-blur-sm dark:bg-[#0E2A26] dark:text-marfim"
    >
      <form onSubmit={save} className="space-y-5 p-6">
        <header className="flex items-start justify-between gap-4">
          <h2 id="planner-dialog-title" className="font-display text-3xl font-black uppercase leading-none tracking-tight">
            {editing ? "Agendamento" : "Agendar"}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-muted)] hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-marfim/10"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        {posts.length > 0 && (
          <Segmented
            label="Origem"
            value={source}
            options={[
              { value: "post", label: "Post salvo" },
              { value: "livre", label: "Livre" },
            ]}
            onChange={changeSource}
          />
        )}

        {source === "post" ? (
          <div className="space-y-2">
            <label htmlFor="planner-post" className={LABEL}>
              Post
            </label>
            <select id="planner-post" value={form.postId ?? ""} onChange={(e) => pickPost(e.target.value)} className={cn(FIELD, "h-12")}>
              <option value="" disabled>
                Escolha um post
              </option>
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.topic.length > 70 ? `${p.topic.slice(0, 68)}…` : p.topic}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="planner-title" className={LABEL}>
                Título
              </label>
              <input
                id="planner-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={200}
                required
                autoFocus={!editing}
                placeholder="Ex.: Mito sobre colesterol"
                className={cn(FIELD, "h-12")}
              />
            </div>
            <div className="space-y-2">
              <p className={LABEL}>Formato</p>
              <Segmented label="Formato" value={form.format} options={FORMAT_OPTIONS} onChange={(v) => set("format", v)} />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="planner-date" className={LABEL}>
              Data
            </label>
            <input id="planner-date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className={cn(FIELD, "h-12")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="planner-time" className={LABEL}>
              Hora
            </label>
            <input id="planner-time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required className={cn(FIELD, "h-12")} />
          </div>
        </div>
        <div role="group" aria-label="Horários sugeridos" className="flex flex-wrap gap-2">
          {SUGGESTED_HOURS.map((h) => {
            const active = form.time === hh(h);
            return (
              <button
                key={h}
                type="button"
                aria-pressed={active}
                onClick={() => set("time", hh(h))}
                className={cn(
                  "h-9 rounded-full border px-3 font-mono text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-600",
                  active
                    ? "border-pinho bg-pinho text-marfim dark:border-lima dark:bg-lima dark:text-pinho"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-pinho dark:hover:text-marfim",
                )}
              >
                {hh(h)}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label htmlFor="planner-note" className={LABEL}>
            Nota
          </label>
          <textarea
            id="planner-note"
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            maxLength={1000}
            rows={2}
            className={cn(FIELD, "resize-none py-3")}
          />
        </div>

        {editing && (
          <label className="flex h-10 cursor-pointer items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.status === "published"}
              onChange={(e) => set("status", e.target.checked ? "published" : "planned")}
              className="h-5 w-5 accent-teal-700"
            />
            Já publiquei
          </label>
        )}

        <ErrorNote message={error} />

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex items-center gap-1">
            {editing && (
              <Button variant="ghost" size="sm" onClick={remove} disabled={!!busy}>
                {busy === "delete" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
                Remover
              </Button>
            )}
            {editing && draft.postId && (
              <Link
                href={`/app/conteudos/${draft.postId}`}
                className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-lima dark:hover:bg-marfim/10"
              >
                Abrir post <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
          <Button type="submit" disabled={!!busy}>
            {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Salvar
          </Button>
        </footer>
      </form>
    </dialog>
  );
}
