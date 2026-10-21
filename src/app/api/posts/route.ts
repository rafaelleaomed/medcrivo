import { NextRequest, NextResponse } from "next/server";
import { getStore, unauthorized } from "@/lib/store";
import { PostStatusSchema } from "@/lib/planner/planner";
import { badRequest, failure } from "@/lib/planner/http";

/** Meus conteúdos: posts salvos do mais novo ao mais antigo; `?status=` filtra. */
export async function GET(req: NextRequest) {
  const store = await getStore();
  if (!store) return unauthorized();

  const raw = req.nextUrl.searchParams.get("status");
  const status = raw ? PostStatusSchema.safeParse(raw) : null;
  if (status && !status.success) return badRequest("Status inválido.");

  try {
    const posts = await store.listPosts({ status: status?.data });
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    return failure("Listar posts", err);
  }
}
