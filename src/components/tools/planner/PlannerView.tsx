"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ErrorNote, Segmented, ToolTitle } from "@/components/creator/shared";
import {
  atHour,
  daySchedule,
  dayKey,
  itemsByDay,
  monthGrid,
  moveToDay,
  nextFreeSlot,
  shiftAnchor,
  SUGGESTED_HOURS,
  timeLabel,
  toLocalInputs,
  visibleRange,
  weekDays,
  type CalendarView,
  type PlannerItem,
} from "@/lib/planner/planner";
import type { PostSummary } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import { FORMAT_ICONS } from "./formats";
import { PlannerDialog, type PlannerDraft } from "./PlannerDialog";

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Mês" },
  { value: "week", label: "Semana" },
];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const DAY = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
const DRAG_TYPE = "application/x-medcrivo-planner";

function newDraft(scheduledAt: string, postId: string | null = null, title = ""): PlannerDraft {
  return { postId, title, format: "carrossel", note: "", status: "planned", ...toLocalInputs(scheduledAt) };
}

function editDraft(item: PlannerItem): PlannerDraft {
  return { id: item.id, postId: item.postId, title: item.title, format: item.format, note: item.note, status: item.status, ...toLocalInputs(item.scheduledAt) };
}

export function PlannerView({ initialPostId = null }: { initialPostId?: string | null }) {
  // Data só no cliente: o servidor não sabe o fuso nem o "hoje" de quem vê.
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>("month");
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [dialog, setDialog] = useState<{ key: number; draft: PlannerDraft } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pendingPost, setPendingPost] = useState(initialPostId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnchor(new Date());
    if (window.matchMedia("(max-width: 639px)").matches) setView("week");
    void fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d?.success ? d.posts : []))
      .catch(() => setPosts([]));
  }, []);

  const range = useMemo(() => (anchor ? visibleRange(view, anchor) : null), [view, anchor]);

  const load = useCallback(async (from: Date, to: Date) => {
    const qs = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
    const data = await fetch(`/api/planner?${qs}`)
      .then((r) => r.json())
      .catch(() => null);
    if (data?.success) {
      setItems(data.items);
      setLoaded(true);
      setError(null);
    } else setError(data?.error ?? "Não foi possível carregar o calendário.");
  }, []);

  useEffect(() => {
    // Recarrega ao trocar mês/semana (sincronização com o servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (range) void load(range.from, range.to);
  }, [range, load]);

  // Vindo de "Agendar" num post (?post=id): abre o diálogo já com o post e o próximo horário livre.
  useEffect(() => {
    if (!pendingPost || !posts || !loaded) return;
    const post = posts.find((p) => p.id === pendingPost);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingPost(null);
    window.history.replaceState(null, "", "/app/planner");
    if (post) setDialog({ key: Date.now(), draft: newDraft(nextFreeSlot(items), post.id, post.topic.slice(0, 200)) });
  }, [pendingPost, posts, loaded, items]);

  const openNew = (scheduledAt: string) => setDialog({ key: Date.now(), draft: newDraft(scheduledAt) });
  const openEdit = (item: PlannerItem) => setDialog({ key: Date.now(), draft: editDraft(item) });

  async function move(id: string, scheduledAt: string) {
    const before = items;
    const current = before.find((i) => i.id === id);
    if (!current || current.scheduledAt === scheduledAt) return;
    setItems(before.map((i) => (i.id === id ? { ...i, scheduledAt } : i)));
    const res = await fetch(`/api/planner/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt }),
    }).catch(() => null);
    if (!res?.ok) {
      setItems(before);
      setError("Não foi possível mover. Tente de novo.");
    }
  }

  function onSaved(item: PlannerItem) {
    setDialog(null);
    const inRange = range && Date.parse(item.scheduledAt) >= range.from.getTime() && Date.parse(item.scheduledAt) < range.to.getTime();
    setItems((list) => [...list.filter((i) => i.id !== item.id), ...(inRange ? [item] : [])]);
    if (!inRange) setAnchor(new Date(item.scheduledAt));
    if (item.postId) setPosts((list) => list?.map((p) => (p.id === item.postId && p.status !== "published" ? { ...p, status: item.status === "published" ? "published" : "scheduled" } : p)) ?? list);
  }

  function onDeleted(id: string) {
    setDialog(null);
    setItems((list) => list.filter((i) => i.id !== id));
  }

  if (!anchor || !range) {
    return (
      <div className="space-y-6">
        <ToolTitle label="Planejar · Planner" title="Calendário" />
        <div aria-hidden className="h-96 animate-pulse bg-[var(--bg-card-subtle)] motion-reduce:animate-none" />
      </div>
    );
  }

  const byDay = itemsByDay(items);
  const today = dayKey(new Date());
  const title = view === "month" ? MONTH.format(anchor) : `${DAY.format(range.from)} – ${DAY.format(weekDays(anchor)[6])}`;
  const dnd = { onDropItem: move };

  return (
    <div className="space-y-6">
      <ToolTitle
        label="Planejar · Planner"
        title="Calendário"
        aside={
          <Button onClick={() => openNew(nextFreeSlot(items))}>
            <CalendarPlus className="h-4 w-4" aria-hidden /> Agendar
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <IconButton label="Anterior" onClick={() => setAnchor(shiftAnchor(view, anchor, -1))}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </IconButton>
          <IconButton label="Próximo" onClick={() => setAnchor(shiftAnchor(view, anchor, 1))}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </IconButton>
          <Button variant="ghost" size="sm" onClick={() => setAnchor(new Date())}>
            Hoje
          </Button>
          <h2 aria-live="polite" className="ml-2 font-display text-2xl font-extrabold uppercase tracking-tight text-pinho dark:text-marfim">
            {title}
          </h2>
        </div>
        <Segmented label="Visão" value={view} options={VIEW_OPTIONS} onChange={setView} />
      </div>

      <ErrorNote message={error} />

      {view === "month" ? (
        <MonthGrid
          anchor={anchor}
          today={today}
          byDay={byDay}
          onOpenDay={(d) => {
            setAnchor(d);
            setView("week");
          }}
          onNew={(d) => openNew(nextFreeSlot(items, d > new Date() ? d : new Date()))}
          onEdit={openEdit}
          {...dnd}
        />
      ) : (
        <WeekGrid anchor={anchor} today={today} items={items} onNew={openNew} onEdit={openEdit} {...dnd} />
      )}

      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <span aria-hidden className="h-1.5 w-1.5 bg-teal-700 dark:bg-lima" />
        Horários sugeridos {SUGGESTED_HOURS.map((h) => `${String(h).padStart(2, "0")}h`).join(" · ")}
      </p>

      {dialog && (
        <PlannerDialog
          key={dialog.key}
          draft={dialog.draft}
          posts={posts ?? []}
          onClose={() => setDialog(null)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full text-pinho hover:bg-pinho/5 focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-marfim dark:hover:bg-marfim/10"
    >
      {children}
    </button>
  );
}

/* --------------------------------- Arrastar -------------------------------- */

type DropHandler = { onDropItem: (id: string, scheduledAt: string) => void };

function dropZone(
  active: boolean,
  setActive: (v: boolean) => void,
  target: (scheduledAt: string) => string,
  items: Map<string, PlannerItem>,
  onDropItem: DropHandler["onDropItem"],
) {
  return {
    "data-drop": active || undefined,
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!active) setActive(true);
    },
    onDragLeave: () => setActive(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setActive(false);
      const id = e.dataTransfer.getData(DRAG_TYPE);
      const item = items.get(id);
      if (item) onDropItem(id, target(item.scheduledAt));
    },
  };
}

function ItemChip({ item, onEdit, compact = false }: { item: PlannerItem; onEdit: (item: PlannerItem) => void; compact?: boolean }) {
  const Icon = FORMAT_ICONS[item.format];
  const published = item.status === "published";
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, item.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onEdit(item)}
      title={item.note || item.title}
      className={cn(
        "flex w-full cursor-grab items-center gap-1.5 text-left transition-colors active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-teal-600",
        compact ? "h-7 rounded-md px-1.5 text-[11px]" : "min-h-11 rounded-xl px-2.5 py-2 text-xs",
        published
          ? "bg-transparent text-[var(--text-muted)] line-through decoration-1"
          : "bg-pinho text-marfim hover:bg-teal-800 dark:bg-lima dark:text-pinho dark:hover:bg-[#c9e35f]",
      )}
    >
      {published ? <Check className="h-3.5 w-3.5 shrink-0" aria-label="Publicado" /> : <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
      <span className="shrink-0 font-mono font-bold">{timeLabel(item.scheduledAt)}</span>
      <span className="truncate font-semibold">{item.title}</span>
    </button>
  );
}

/* ---------------------------------- Mês ---------------------------------- */

function MonthGrid({
  anchor,
  today,
  byDay,
  onOpenDay,
  onNew,
  onEdit,
  onDropItem,
}: {
  anchor: Date;
  today: string;
  byDay: Map<string, PlannerItem[]>;
  onOpenDay: (day: Date) => void;
  onNew: (day: Date) => void;
  onEdit: (item: PlannerItem) => void;
} & DropHandler) {
  const weeks = monthGrid(anchor);
  const all = new Map([...byDay.values()].flat().map((i) => [i.id, i]));
  return (
    <div role="grid" aria-label="Calendário do mês" className="border-l border-t border-[var(--border-subtle)]">
      <div role="row" className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            role="columnheader"
            className="border-b border-r border-[var(--border-subtle)] px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]"
          >
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week) => (
        <div role="row" key={dayKey(week[0])} className="grid grid-cols-7">
          {week.map((day) => (
            <MonthCell
              key={dayKey(day)}
              day={day}
              outside={day.getMonth() !== anchor.getMonth()}
              isToday={dayKey(day) === today}
              items={byDay.get(dayKey(day)) ?? []}
              all={all}
              onOpenDay={onOpenDay}
              onNew={onNew}
              onEdit={onEdit}
              onDropItem={onDropItem}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MonthCell({
  day,
  outside,
  isToday,
  items,
  all,
  onOpenDay,
  onNew,
  onEdit,
  onDropItem,
}: {
  day: Date;
  outside: boolean;
  isToday: boolean;
  items: PlannerItem[];
  all: Map<string, PlannerItem>;
  onOpenDay: (day: Date) => void;
  onNew: (day: Date) => void;
  onEdit: (item: PlannerItem) => void;
} & DropHandler) {
  const [over, setOver] = useState(false);
  const shown = items.slice(0, 3);
  const label = DAY.format(day);
  return (
    <div
      role="gridcell"
      aria-label={`${label}${items.length ? `, ${items.length} agendado${items.length > 1 ? "s" : ""}` : ""}`}
      {...dropZone(over, setOver, (iso) => moveToDay(iso, day), all, onDropItem)}
      className={cn(
        "group relative flex min-h-20 flex-col gap-1 border-b border-r border-[var(--border-subtle)] p-1.5 transition-colors sm:min-h-28",
        outside ? "bg-transparent" : "bg-white/70 dark:bg-[#132D29]/70",
        "data-[drop]:bg-teal-50 dark:data-[drop]:bg-marfim/10",
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onOpenDay(day)}
          aria-label={`Ver semana de ${label}`}
          className={cn(
            "grid h-8 min-w-8 place-items-center px-1 font-mono text-xs font-bold focus-visible:outline-2 focus-visible:outline-teal-600",
            isToday ? "bg-pinho text-marfim dark:bg-lima dark:text-pinho" : outside ? "text-[var(--text-muted)]/60" : "text-tinta dark:text-marfim",
          )}
        >
          {day.getDate()}
        </button>
        <button
          type="button"
          onClick={() => onNew(day)}
          aria-label={`Agendar em ${label}`}
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-muted)] opacity-0 transition-opacity hover:text-pinho focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-teal-600 group-hover:opacity-100 dark:hover:text-marfim"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {/* Telas pequenas: só marcadores; o dia abre a semana. */}
      <div className="flex flex-wrap gap-1 px-1 sm:hidden" aria-hidden>
        {items.map((i) => (
          <span key={i.id} className={cn("h-1.5 w-1.5", i.status === "published" ? "bg-[var(--text-muted)]" : "bg-teal-700 dark:bg-lima")} />
        ))}
      </div>
      <div className="hidden flex-col gap-1 sm:flex">
        {shown.map((item) => (
          <ItemChip key={item.id} item={item} onEdit={onEdit} compact />
        ))}
        {items.length > shown.length && (
          <button
            type="button"
            onClick={() => onOpenDay(day)}
            className="h-6 px-1.5 text-left font-mono text-[11px] font-bold text-teal-700 hover:underline dark:text-lima"
          >
            +{items.length - shown.length}
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Semana -------------------------------- */

function WeekGrid({
  anchor,
  today,
  items,
  onNew,
  onEdit,
  onDropItem,
}: {
  anchor: Date;
  today: string;
  items: PlannerItem[];
  onNew: (scheduledAt: string) => void;
  onEdit: (item: PlannerItem) => void;
} & DropHandler) {
  const all = new Map(items.map((i) => [i.id, i]));
  return (
    <div className="grid border-l border-t border-[var(--border-subtle)] sm:grid-cols-7">
      {weekDays(anchor).map((day) => (
        <WeekColumn
          key={dayKey(day)}
          day={day}
          isToday={dayKey(day) === today}
          items={items}
          all={all}
          onNew={onNew}
          onEdit={onEdit}
          onDropItem={onDropItem}
        />
      ))}
    </div>
  );
}

function WeekColumn({
  day,
  isToday,
  items,
  all,
  onNew,
  onEdit,
  onDropItem,
}: {
  day: Date;
  isToday: boolean;
  items: PlannerItem[];
  all: Map<string, PlannerItem>;
  onNew: (scheduledAt: string) => void;
  onEdit: (item: PlannerItem) => void;
} & DropHandler) {
  const [over, setOver] = useState(false);
  const past = dayKey(day) < dayKey(new Date());
  return (
    <section
      aria-label={DAY.format(day)}
      {...dropZone(over, setOver, (iso) => moveToDay(iso, day), all, onDropItem)}
      className="flex min-h-40 flex-col border-b border-r border-[var(--border-subtle)] bg-white/70 transition-colors data-[drop]:bg-teal-50 dark:bg-[#132D29]/70 dark:data-[drop]:bg-marfim/10"
    >
      <header className="flex items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{WEEKDAYS[day.getDay()]}</span>
        <span
          className={cn(
            "font-display text-2xl font-black leading-none",
            isToday ? "text-teal-700 dark:text-lima" : "text-pinho dark:text-marfim",
          )}
        >
          {day.getDate()}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        {daySchedule(day, items).map((entry) =>
          entry.kind === "item" ? (
            <ItemChip key={entry.item.id} item={entry.item} onEdit={onEdit} />
          ) : (
            <SlotButton
              key={entry.hour}
              hour={entry.hour}
              disabled={past}
              onNew={() => onNew(atHour(day, entry.hour))}
              onDropOnSlot={(id) => onDropItem(id, atHour(day, entry.hour))}
            />
          ),
        )}
      </div>
    </section>
  );
}

/** Horário sugerido livre: clique agenda; soltar um item aqui move para este horário. */
function SlotButton({
  hour,
  disabled,
  onNew,
  onDropOnSlot,
}: {
  hour: number;
  disabled: boolean;
  onNew: () => void;
  onDropOnSlot: (id: string) => void;
}) {
  const [over, setOver] = useState(false);
  const label = `${String(hour).padStart(2, "0")}:00`;
  return (
    <button
      type="button"
      onClick={onNew}
      disabled={disabled}
      aria-label={`Agendar às ${label}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        const id = e.dataTransfer.getData(DRAG_TYPE);
        if (id) onDropOnSlot(id);
      }}
      className={cn(
        "flex min-h-11 items-center gap-1.5 rounded-xl border border-dashed px-2.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-40",
        over
          ? "border-teal-700 bg-teal-50 text-teal-700 dark:border-lima dark:bg-marfim/10 dark:text-lima"
          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-teal-700 hover:text-teal-700 dark:hover:border-lima dark:hover:text-lima",
      )}
    >
      <Plus className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}
