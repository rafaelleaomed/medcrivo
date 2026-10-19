import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toolById } from "@/config/tools";

/** Tela provisória das ferramentas em construção. Cada frente substitui pela tela real. */
export function ToolPlaceholder({ toolId }: { toolId: string }) {
  const tool = toolById(toolId);
  if (!tool) return null;
  const Icon = tool.icon;
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pinho text-lima dark:bg-lima dark:text-pinho">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold">{tool.label}</h1>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Em construção</p>
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-lima">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao painel
      </Link>
    </section>
  );
}
