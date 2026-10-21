import { Suspense } from "react";
import type { Metadata } from "next";
import { StudioProvider } from "@/components/studio/StudioProvider";
import { AppHeader } from "@/components/studio/AppHeader";
import { ProfileDialog } from "@/components/studio/ProfileDialog";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: { default: `Estúdio · ${BRAND.name}`, template: `%s · ${BRAND.product}` },
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      {/* O menu lê a rota (usePathname): em rotas dinâmicas isso é dado da requisição, então fica em <Suspense>. */}
      <Suspense fallback={<div className="h-16 border-b border-[var(--border-subtle)]" aria-hidden />}>
        <AppHeader />
      </Suspense>
      <ProfileDialog />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 lg:pb-12">{children}</main>
      <footer className="mx-auto hidden w-full max-w-6xl border-t border-[var(--border-subtle)] px-4 py-6 text-xs text-[var(--text-muted)] lg:block">
        © 2026 {BRAND.name} · {BRAND.tagline} O Crivo é uma triagem automatizada; a responsabilidade pela publicação é do
        profissional.
      </footer>
    </StudioProvider>
  );
}
