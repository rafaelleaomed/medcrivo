"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Loader2, MessageSquareText, Plus, Trash2 } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { useStudio } from "@/components/studio/StudioProvider";
import {
  STARTER_PROMPTS,
  TOOL_LABELS,
  type AssistantTool,
  type ConversationPayload,
  type StoredMessage,
} from "@/lib/creator/assistant";
import type { StudioItem } from "@/lib/store/items";
import { cn } from "@/lib/utils";
import { CrivoBadge, ErrorNote, SourceNote, ToolTitle, useSavedItems } from "./shared";

/** Negrito com **texto**; o resto vai como texto puro (sem HTML vindo da IA). */
function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>,
  );
}

/** Markdown mínimo: parágrafos e listas com "-", "*" ou "1.". */
function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={blocks.length} className={cn("space-y-1 pl-5", list.ordered ? "list-decimal" : "list-disc")}>
        {list.items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    flush();
    if (line) blocks.push(<p key={blocks.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

function ToolAction({ tool, topic }: { tool: AssistantTool; topic: string }) {
  const { startFromTopic } = useStudio();
  const cls = buttonClass("outline", "sm");
  const label = (
    <>
      {TOOL_LABELS[tool]} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </>
  );
  if (tool === "carrossel" && topic) {
    return (
      <button type="button" className={cls} onClick={() => startFromTopic(topic)}>
        {label}
      </button>
    );
  }
  const href =
    tool === "crivo" ? "/app/crivo" : tool === "carrossel" ? "/app/carrossel" : `/app/${tool}${topic ? `?tema=${encodeURIComponent(topic)}` : ""}`;
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

function Message({ message }: { message: StoredMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-pinho px-4 py-3 text-sm text-marfim dark:bg-lima dark:text-pinho">
          {message.content}
        </p>
      </div>
    );
  }
  const turn = message.turn;
  return (
    <div className="max-w-[92%] space-y-2">
      <div className="rounded-3xl rounded-bl-md border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm leading-relaxed text-tinta dark:bg-[#132D29] dark:text-marfim">
        <RichText text={message.content} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {turn && !turn.crivo.isApproved && <CrivoBadge crivo={turn.crivo} />}
        {turn?.action && <ToolAction tool={turn.action.tool} topic={turn.action.topic} />}
        {message.generatedBy && <SourceNote generatedBy={message.generatedBy} />}
      </div>
    </div>
  );
}

export function AssistantView() {
  const saved = useSavedItems<ConversationPayload>("/api/creator/assistant", "chat");
  const [conversation, setConversation] = useState<StudioItem<ConversationPayload> | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = conversation?.payload.messages ?? [];
  const lastTurn = [...messages].reverse().find((m) => m.role === "assistant")?.turn;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    setPending(message);
    setDraft("");
    setError(null);
    try {
      const res = await fetch("/api/creator/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conversation?.id, message }),
      });
      const data = await res.json().catch(() => null);
      if (!data?.success) throw new Error(data?.error ?? `Erro ${res.status}`);
      setConversation(data.item);
      void saved.refresh();
    } catch (err) {
      setDraft(message);
      setError(err instanceof Error ? err.message : "Não foi possível responder agora.");
    } finally {
      setPending(null);
      inputRef.current?.focus();
    }
  }

  async function open(id: string) {
    const item = await saved.open(id);
    if (item) {
      setConversation(item);
      setError(null);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/creator/assistant?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
    if (conversation?.id === id) setConversation(null);
    void saved.refresh();
  }

  function newConversation() {
    setConversation(null);
    setError(null);
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      <ToolTitle
        label="Criar · Assistente"
        title="Converse com a IA"
        aside={
          <button type="button" onClick={newConversation} className={buttonClass("outline", "sm")}>
            <Plus className="h-4 w-4" aria-hidden /> Nova conversa
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Conversas salvas */}
        <aside aria-label="Conversas" className="order-2 lg:order-1">
          <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {saved.items.length === 0 && (
              <li className="py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Nenhuma conversa</li>
            )}
            {saved.items.map((c) => (
              <li key={c.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => open(c.id)}
                  aria-current={c.id === conversation?.id ? "true" : undefined}
                  className={cn(
                    "min-h-10 flex-1 truncate py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-teal-600",
                    c.id === conversation?.id ? "font-bold text-pinho dark:text-lima" : "text-[var(--text-muted)] hover:text-tinta dark:hover:text-marfim",
                  )}
                >
                  {c.title}
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label={`Apagar conversa: ${c.title}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-[var(--text-muted)] opacity-60 hover:bg-amber-50 hover:text-amber-900 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:bg-amber-950/40 dark:hover:text-amber-200"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conversa */}
        <section aria-label="Conversa" className="order-1 flex min-h-[60vh] flex-col rounded-3xl border border-[var(--border-subtle)] bg-white/50 dark:bg-[#132D29]/40 lg:order-2">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.length === 0 && !pending ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pinho text-lima">
                  <MessageSquareText className="h-6 w-6" aria-hidden />
                </div>
                <p className="text-base font-bold text-tinta dark:text-marfim">Como posso ajudar hoje?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {STARTER_PROMPTS.map((p) => (
                    <button key={p} type="button" onClick={() => send(p)} className={buttonClass("outline", "sm")}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <Message key={`${m.at}-${i}`} message={m} />
                ))}
                {pending && (
                  <>
                    <Message message={{ role: "user", content: pending, at: "" }} />
                    <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Pensando
                    </p>
                  </>
                )}
                {!pending && lastTurn && lastTurn.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lastTurn.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="h-9 rounded-full border border-[var(--border-subtle)] px-3 text-xs font-semibold text-teal-700 hover:border-teal-600 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-lima"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="space-y-2 border-t border-[var(--border-subtle)] p-3 sm:p-4"
          >
            <ErrorNote message={error} />
            <div className="flex items-end gap-2">
              <label htmlFor="assistant-input" className="sr-only">
                Mensagem
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    void send(draft);
                  }
                }}
                rows={1}
                maxLength={4000}
                placeholder="Pergunte ou cole um texto"
                className="max-h-40 min-h-12 flex-1 resize-y rounded-3xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-tinta outline-none placeholder:text-[var(--text-muted)] focus:border-teal-600 dark:bg-[#0B2622] dark:text-marfim"
              />
              <button
                type="submit"
                disabled={!draft.trim() || Boolean(pending)}
                aria-label="Enviar"
                className={buttonClass("primary", "md", "h-12 w-12 px-0")}
              >
                {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <ArrowUp className="h-5 w-5" aria-hidden />}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
