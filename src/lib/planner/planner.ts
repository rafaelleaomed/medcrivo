import { z } from "zod";

/**
 * Planner (calendário editorial) e status dos posts salvos.
 * Arquivo sem dependências de servidor para poder ser testado com `node --test`.
 * Datas do calendário em horário local do navegador; no banco, `timestamptz` (ISO).
 */

/* --------------------------------- Posts --------------------------------- */

export const POST_STATUSES = ["draft", "approved", "scheduled", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Rascunho",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
};

export const PostStatusSchema = z.enum(POST_STATUSES);

/* -------------------------------- Planner -------------------------------- */

export const PLANNER_FORMATS = ["carrossel", "reels", "stories", "imagem"] as const;
export type PlannerFormat = (typeof PLANNER_FORMATS)[number];

export const FORMAT_LABELS: Record<PlannerFormat, string> = {
  carrossel: "Carrossel",
  reels: "Reels",
  stories: "Stories",
  imagem: "Imagem",
};

export const PLANNER_STATUSES = ["planned", "published"] as const;
export type PlannerStatus = (typeof PLANNER_STATUSES)[number];

/** Horários fixos observados no @doctorcreators (BRT): 07h, 12h, 17h e 20h. */
export const SUGGESTED_HOURS = [7, 12, 17, 20] as const;

export interface PlannerItem {
  id: string;
  postId: string | null;
  title: string;
  format: PlannerFormat;
  /** ISO 8601 com fuso. */
  scheduledAt: string;
  note: string;
  status: PlannerStatus;
  createdAt: string;
  updatedAt: string;
}

const isoDateTime = z.iso.datetime({ offset: true, error: "Data e hora inválidas." });

export const PlannerItemInputSchema = z.object({
  postId: z.uuid().nullable().default(null),
  title: z.string().trim().min(1, "Dê um título.").max(200, "Título longo demais."),
  format: z.enum(PLANNER_FORMATS).default("carrossel"),
  scheduledAt: isoDateTime,
  note: z.string().trim().max(1000, "Nota longa demais.").default(""),
  status: z.enum(PLANNER_STATUSES).default("planned"),
});
export type PlannerItemInput = z.infer<typeof PlannerItemInputSchema>;

/** Patch: só os campos enviados (sem defaults, para não sobrescrever o que não veio). */
export const PlannerItemPatchSchema = z
  .object({
    postId: z.uuid().nullable(),
    title: z.string().trim().min(1, "Dê um título.").max(200, "Título longo demais."),
    format: z.enum(PLANNER_FORMATS),
    scheduledAt: isoDateTime,
    note: z.string().trim().max(1000, "Nota longa demais."),
    status: z.enum(PLANNER_STATUSES),
  })
  .partial()
  .refine((p) => Object.keys(p).length > 0, "Nada para alterar.");
export type PlannerItemPatch = z.infer<typeof PlannerItemPatchSchema>;

/** Intervalo pedido pelo calendário: no máximo ~6 semanas (visão mensal). */
export const PlannerRangeSchema = z
  .object({ from: isoDateTime, to: isoDateTime })
  .refine((r) => Date.parse(r.to) > Date.parse(r.from), "Intervalo inválido.")
  .refine((r) => Date.parse(r.to) - Date.parse(r.from) <= 45 * 86_400_000, "Intervalo longo demais.");

/* ------------------------------- Calendário ------------------------------ */

export type CalendarView = "month" | "week";

const pad = (n: number) => String(n).padStart(2, "0");

/** Chave do dia em horário local: YYYY-MM-DD. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes());
}

/** Semana começando no domingo (padrão dos calendários brasileiros). */
export function startOfWeek(d: Date): Date {
  const day = startOfDay(d);
  return addDays(day, -day.getDay());
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Semanas visíveis do mês (5 ou 6), cada uma com 7 dias. */
export function monthGrid(anchor: Date): Date[][] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const weeks: Date[][] = [];
  for (let start = startOfWeek(first); start <= last; start = addDays(start, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(start, i)));
  }
  return weeks;
}

/** Intervalo [from, to) a buscar para a visão atual. */
export function visibleRange(view: CalendarView, anchor: Date): { from: Date; to: Date } {
  if (view === "week") {
    const from = startOfWeek(anchor);
    return { from, to: addDays(from, 7) };
  }
  const weeks = monthGrid(anchor);
  return { from: weeks[0][0], to: addDays(weeks[weeks.length - 1][6], 1) };
}

export function shiftAnchor(view: CalendarView, anchor: Date, direction: 1 | -1): Date {
  if (view === "week") return addDays(anchor, 7 * direction);
  return new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1);
}

/** Mesmo horário em outro dia (arrastar no mês). */
export function moveToDay(iso: string, day: Date): string {
  const t = new Date(iso);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), t.getHours(), t.getMinutes()).toISOString();
}

/** Dia + hora cheia (arrastar para um horário sugerido na semana). */
export function atHour(day: Date, hour: number, minute = 0): string {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString();
}

/** Valores para <input type="date"> e <input type="time"> a partir do ISO. */
export function toLocalInputs(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return { date: dayKey(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

export function fromLocalInputs(date: string, time: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m || !t) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(t[1]), Number(t[2]));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function timeLabel(iso: string): string {
  return toLocalInputs(iso).time;
}

export function itemsByDay(items: PlannerItem[]): Map<string, PlannerItem[]> {
  const map = new Map<string, PlannerItem[]>();
  for (const item of [...items].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))) {
    const key = dayKey(new Date(item.scheduledAt));
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}

export type DayEntry = { kind: "item"; item: PlannerItem } | { kind: "slot"; hour: number };

/**
 * Agenda do dia: itens em ordem de horário + horários sugeridos ainda livres
 * (um horário conta como ocupado se já há item na mesma hora cheia).
 */
export function daySchedule(day: Date, items: PlannerItem[]): DayEntry[] {
  const key = dayKey(day);
  const own = items.filter((i) => dayKey(new Date(i.scheduledAt)) === key);
  const busy = new Set(own.map((i) => new Date(i.scheduledAt).getHours()));
  const entries: { minutes: number; entry: DayEntry }[] = [
    ...own.map((item) => {
      const d = new Date(item.scheduledAt);
      return { minutes: d.getHours() * 60 + d.getMinutes(), entry: { kind: "item", item } as DayEntry };
    }),
    ...SUGGESTED_HOURS.filter((h) => !busy.has(h)).map((hour) => ({ minutes: hour * 60, entry: { kind: "slot", hour } as DayEntry })),
  ];
  return entries.sort((a, b) => a.minutes - b.minutes).map((e) => e.entry);
}

/** Próximo horário sugerido livre a partir de agora (para o botão "Agendar"). */
export function nextFreeSlot(items: PlannerItem[], now: Date = new Date()): string {
  for (let offset = 0; offset < 60; offset++) {
    const day = addDays(startOfDay(now), offset);
    for (const entry of daySchedule(day, items)) {
      if (entry.kind !== "slot") continue;
      const iso = atHour(day, entry.hour);
      if (Date.parse(iso) > now.getTime()) return iso;
    }
  }
  return atHour(addDays(startOfDay(now), 1), SUGGESTED_HOURS[0]);
}
