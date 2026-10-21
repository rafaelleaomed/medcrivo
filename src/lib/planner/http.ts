import { NextResponse } from "next/server";
import type { z } from "zod";

/** Respostas comuns das rotas de posts e planner. */
export function badRequest(error: z.ZodError | string) {
  const message = typeof error === "string" ? error : (error.issues[0]?.message ?? "Pedido inválido.");
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function notFound(message = "Não encontrado.") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

/** Erro do banco: RLS/FK (post de outro dono ou inexistente) vira 404; o resto, 500 genérico (detalhe só no log). */
export function failure(label: string, err: unknown) {
  const code = (err as { code?: string } | null)?.code;
  const message = err instanceof Error ? err.message : "";
  if (code === "42501" || code === "23503" || message === "Post não encontrado.") return notFound("Post não encontrado.");
  console.error(`${label}:`, err);
  return NextResponse.json({ success: false, error: "Não foi possível concluir agora. Tente de novo." }, { status: 500 });
}

export async function readJson(req: Request): Promise<unknown> {
  return req.json().catch(() => null);
}
