import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { authorizedUserId } from "@/lib/access";
import { resolveEditorialAssetPath } from "@/lib/editorial/assets";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!authorizedUserId(data?.claims)) {
    return NextResponse.json({ success: false, error: "Acesso não autorizado." }, { status: 401 });
  }

  const segments = (await params).path;
  const assetPath = resolveEditorialAssetPath(path.join(process.cwd(), "assets", "posts"), segments);
  if (!assetPath) return NextResponse.json({ success: false, error: "Imagem inválida." }, { status: 404 });

  try {
    const image = await fs.readFile(assetPath);
    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ success: false, error: "Imagem não encontrada." }, { status: 404 });
    }
    console.error("[editorial-asset:get]", error);
    return NextResponse.json({ success: false, error: "Não foi possível carregar a imagem." }, { status: 500 });
  }
}
