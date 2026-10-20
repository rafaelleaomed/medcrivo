import { NextRequest, NextResponse } from "next/server";
import { getStore, unauthorized } from "@/lib/store";

export type InstagramPreview = {
  handle: string;
  fullName: string;
  biography: string;
  followers: number | null;
  posts: number | null;
  picture: string | null;
  isPrivate: boolean;
  verified: boolean;
};

const HANDLE = /^[a-z0-9._]{1,30}$/;

/**
 * Prévia pública do perfil do Instagram (opcional), feita no servidor via Apify.
 * Sem APIFY_TOKEN, responde `available: false` e o onboarding segue sem prévia. Nunca pede senha.
 */
export async function GET(req: NextRequest) {
  const store = await getStore();
  if (!store) return unauthorized();

  const handle = (req.nextUrl.searchParams.get("handle") ?? "").trim().replace(/^@/, "").toLowerCase();
  if (!HANDLE.test(handle)) {
    return NextResponse.json({ success: false, error: "Use só letras, números, ponto e sublinhado." }, { status: 400 });
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) return NextResponse.json({ success: true, available: false });

  try {
    const res = await fetch(
      "https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?timeout=60",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [handle] }),
        signal: AbortSignal.timeout(70_000),
      },
    );
    if (!res.ok) return NextResponse.json({ success: true, available: false });
    const items = (await res.json()) as Array<Record<string, unknown>>;
    const p = items?.[0];
    if (!p || p.error) return NextResponse.json({ success: true, available: true, found: false });

    const preview: InstagramPreview = {
      handle,
      fullName: String(p.fullName ?? ""),
      biography: String(p.biography ?? ""),
      followers: typeof p.followersCount === "number" ? p.followersCount : null,
      posts: typeof p.postsCount === "number" ? p.postsCount : null,
      picture: typeof p.profilePicUrlHD === "string" ? p.profilePicUrlHD : typeof p.profilePicUrl === "string" ? p.profilePicUrl : null,
      isPrivate: Boolean(p.private),
      verified: Boolean(p.verified),
    };
    return NextResponse.json({ success: true, available: true, found: true, preview });
  } catch {
    return NextResponse.json({ success: true, available: false });
  }
}
