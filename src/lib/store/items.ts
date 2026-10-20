import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Itens das ferramentas de criação (pautas, sequências de stories e conversas do assistente).
 * Tabela `studio_items` com RLS por dono; sem Supabase, arquivo `.data/local-items.json` (só desenvolvimento).
 * Fica fora de `Store` para não mexer no contrato usado pelo carrossel.
 */
export const ITEM_KINDS = ["ideas", "stories", "chat"] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export interface StudioItem<P = unknown> {
  id: string;
  kind: ItemKind;
  title: string;
  payload: P;
  createdAt: string;
  updatedAt: string;
}

export type ItemSummary = Omit<StudioItem, "payload">;

export interface ItemStore {
  create<P>(kind: ItemKind, title: string, payload: P): Promise<StudioItem<P>>;
  update<P>(id: string, patch: { title?: string; payload: P }): Promise<StudioItem<P> | null>;
  get<P>(id: string, kind: ItemKind): Promise<StudioItem<P> | null>;
  list(kind: ItemKind, limit?: number): Promise<ItemSummary[]>;
  remove(id: string, kind: ItemKind): Promise<void>;
}

/* --------------------------------- Supabase -------------------------------- */

interface ItemRow {
  id: string;
  kind: ItemKind;
  title: string;
  payload: unknown;
  created_at: string;
  updated_at: string;
}

function fromRow<P>(row: ItemRow): StudioItem<P> {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    payload: row.payload as P,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function supabaseItems(supabase: SupabaseClient, userId: string): ItemStore {
  return {
    async create(kind, title, payload) {
      const { data, error } = await supabase
        .from("studio_items")
        .insert({ user_id: userId, kind, title, payload })
        .select("*")
        .single();
      if (error) throw error;
      return fromRow(data as ItemRow);
    },
    async update(id, patch) {
      const { data, error } = await supabase
        .from("studio_items")
        .update({ ...(patch.title ? { title: patch.title } : {}), payload: patch.payload })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data ? fromRow(data as ItemRow) : null;
    },
    async get(id, kind) {
      const { data, error } = await supabase
        .from("studio_items")
        .select("*")
        .eq("id", id)
        .eq("kind", kind)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ? fromRow(data as ItemRow) : null;
    },
    async list(kind, limit = 20) {
      const { data, error } = await supabase
        .from("studio_items")
        .select("id, kind, title, created_at, updated_at")
        .eq("kind", kind)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        kind: r.kind as ItemKind,
        title: r.title,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },
    async remove(id, kind) {
      const { error } = await supabase.from("studio_items").delete().eq("id", id).eq("kind", kind).eq("user_id", userId);
      if (error) throw error;
    },
  };
}

/* ----------------------------------- Local --------------------------------- */

const LOCAL_FILE = path.join(process.cwd(), ".data", "local-items.json");

let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readLocal(): Promise<Record<string, StudioItem>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf-8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeLocal(data: Record<string, StudioItem>): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  const tmp = `${LOCAL_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 1), "utf-8");
  await fs.rename(tmp, LOCAL_FILE);
}

function mutateLocal<T>(fn: (data: Record<string, StudioItem>) => T): Promise<T> {
  return serialized(async () => {
    const data = await readLocal();
    const result = fn(data);
    await writeLocal(data);
    return result;
  });
}

function localItems(): ItemStore {
  return {
    create(kind, title, payload) {
      const now = new Date().toISOString();
      const item = { id: randomUUID(), kind, title, payload, createdAt: now, updatedAt: now };
      return mutateLocal((data) => {
        data[item.id] = item;
        return item;
      });
    },
    update<P>(id: string, patch: { title?: string; payload: P }) {
      return mutateLocal((data) => {
        const item = data[id];
        if (!item) return null;
        data[id] = { ...item, title: patch.title || item.title, payload: patch.payload, updatedAt: new Date().toISOString() };
        return data[id] as StudioItem<P>;
      });
    },
    async get<P>(id: string, kind: ItemKind) {
      const item = (await serialized(readLocal))[id];
      return item && item.kind === kind ? (item as StudioItem<P>) : null;
    },
    async list(kind, limit = 20) {
      const data = await serialized(readLocal);
      return Object.values(data)
        .filter((i) => i.kind === kind)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, limit)
        .map((i) => ({ id: i.id, kind: i.kind, title: i.title, createdAt: i.createdAt, updatedAt: i.updatedAt }));
    },
    async remove(id, kind) {
      await mutateLocal((data) => {
        if (data[id]?.kind === kind) delete data[id];
      });
    },
  };
}

/** Itens do usuário da requisição. Retorna null sem sessão válida (mesma regra de `getStore`). */
export async function getItemStore(): Promise<ItemStore | null> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") throw new Error("Supabase é obrigatório em produção.");
    return localItems();
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;
  return supabaseItems(supabase, userId);
}
