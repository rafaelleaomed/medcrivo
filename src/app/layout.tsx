import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Barlow_Condensed, Playfair_Display, Source_Serif_4 } from "next/font/google";
import { BRAND } from "@/config/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${BRAND.product} · ${BRAND.tagline}`,
  description: `${BRAND.tagline} ${BRAND.support} Para médicos e dentistas.`,
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
    <html lang="pt-BR" className={`${inter.variable} ${plusJakarta.variable} ${barlowCondensed.variable} ${playfair.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F2E9] dark:bg-[#0C1F1C] text-slate-900 dark:text-slate-100 selection:bg-[#D6EF72]/60 selection:text-[#123C36] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
