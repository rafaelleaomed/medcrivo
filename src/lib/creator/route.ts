import { NextResponse } from "next/server";
import type { z } from "zod";
import { EMPTY_PROFILE, type DoctorProfile } from "@/lib/profile";
import { getStore, unauthorized, type Store } from "@/lib/store";
import { getItemStore, type ItemKind, type ItemStore } from "@/lib/store/items";
import { RefusalError, type Usage } from "./ai";

/** Contexto comum das rotas de criação: store do usuário, itens salvos e perfil. */
export async function creatorContext(): Promise<
  { ok: true; store: Store; items: ItemStore; profile: DoctorProfile } | { ok: false; response: NextResponse }
> {
  const [store, items] = await Promise.all([getStore(), getItemStore()]);
  if (!store || !items) return { ok: false, response: unauthorized() };
  const profile = (await store.getProfile()) ?? EMPTY_PROFILE;
  return { ok: true, store, items, profile };
}

export function badRequest(error: z.ZodError | string) {
  const message = typeof error === "string" ? error : (error.issues[0]?.message ?? "Pedido inválido.");
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function notFound() {
  return NextResponse.json({ success: false, error: "Não encontrado." }, { status: 404 });
}

/** Recusa da IA vira 422 com a mensagem; o resto, 500 genérico (detalhe só no log). */
export function failure(label: string, err: unknown) {
  if (err instanceof RefusalError) return NextResponse.json({ success: false, error: err.message }, { status: 422 });
  console.error(`${label}:`, err);
  return NextResponse.json({ success: false, error: "Não foi possível concluir agora. Tente de novo." }, { status: 500 });
}

export async function logUsage(store: Store, usage: Usage | undefined) {
  if (!usage) return;
  await store.logUsage({ jobId: null, ...usage }).catch((e) => console.warn("Uso de IA não registrado:", e));
}

/** GET padrão: `?id=` devolve um item; sem id, a lista recente. */
export async function listOrGet(req: Request, kind: ItemKind) {
  const items = await getItemStore();
  if (!items) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const item = await items.get(id, kind);
    return item ? NextResponse.json({ success: true, item }) : notFound();
  }
  return NextResponse.json({ success: true, items: await items.list(kind) });
}
