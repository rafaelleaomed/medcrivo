import type { Metadata } from "next";
import { LibraryView } from "@/components/tools/biblioteca/LibraryView";
import { libraryCrivo } from "@/lib/library/crivo";

export const metadata: Metadata = { title: "Biblioteca" };

export default function BibliotecaPage() {
  // Conteúdo estático: o Crivo roda no servidor e a nota vai pronta para a tela.
  return <LibraryView crivo={libraryCrivo()} />;
}
