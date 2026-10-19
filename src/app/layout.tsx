import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Barlow_Condensed, Source_Serif_4 } from "next/font/google";
import { BRAND } from "@/config/brand";
import "./globals.css";

// Tipografia da marca (brand book, seção 05): Plus Jakarta (texto e interface), Barlow Condensed (manchetes), Source Serif 4 (frases).
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND.name} · ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: `${BRAND.support} Conteúdo de saúde com IA para médicos, revisado pelas normas do CFM antes de publicar.`,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: BRAND.name,
    title: `${BRAND.name} · ${BRAND.tagline}`,
    description: BRAND.support,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.colors.marfim },
    { media: "(prefers-color-scheme: dark)", color: BRAND.colors.pinho },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${barlowCondensed.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-main)] font-sans text-[var(--text-main)] selection:bg-lima/60 selection:text-pinho transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
