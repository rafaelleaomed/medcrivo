import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = { title: `Comece aqui · ${BRAND.name}`, robots: { index: false, follow: false } };

/** Provisório: o wizard de onboarding (estilo CreatorMed) substitui esta tela. */
export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] px-4">
      <Link href="/app" className="font-mono text-xs uppercase tracking-[0.18em] text-teal-700 dark:text-lima">
        Onboarding em construção → ir ao estúdio
      </Link>
    </main>
  );
}
