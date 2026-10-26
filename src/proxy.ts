import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // APIs sempre passam pelo controle de acesso, mesmo quando a URL termina em extensão de imagem.
    "/api/:path*",
    // Tudo, exceto arquivos estáticos, otimização de imagem e assets públicos.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
