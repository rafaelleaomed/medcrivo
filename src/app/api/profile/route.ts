import { NextRequest, NextResponse } from "next/server";
import { DoctorProfileSchema } from "@/lib/profile";
import { getStore, unauthorized } from "@/lib/store";

export async function GET() {
  const store = await getStore();
  if (!store) return unauthorized();
  const profile = await store.getProfile();
  return NextResponse.json({ success: true, mode: store.mode, profile });
}

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
  const profile = await store.saveProfile({ ...parsed.data, onboarded: true });
  return NextResponse.json({ success: true, mode: store.mode, profile });
}
