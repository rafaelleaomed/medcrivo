import { NextRequest, NextResponse } from "next/server";
import { DoctorProfileSchema } from "@/lib/profile";
import { getStore, unauthorized } from "@/lib/store";

/**
 * Rascunho do onboarding: salva o perfil a cada etapa SEM forçar `onboarded: true`
 * (o PUT /api/profile marca como concluído). Só a última etapa envia `onboarded: true`.
 */
export async function PUT(req: NextRequest) {
  const store = await getStore();
  if (!store) return unauthorized();

  const parsed = DoctorProfileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Perfil inválido.", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      { status: 400 },
    );
  }
  const profile = await store.saveProfile(parsed.data);
  return NextResponse.json({ success: true, mode: store.mode, profile });
}
