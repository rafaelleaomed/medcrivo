import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Barlow_Condensed } from "next/font/google";
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

export const metadata: Metadata = {
  title: "CuidaAI Studio | Automação Médica com Blindagem CFM & Inteligência Viral",
  description: "Plataforma de alta performance para médicos gerarem carrosséis científicos, roteiros educativos de alta retenção e posts com conformidade CFM 2.336/2023.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakarta.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090D15] text-slate-900 dark:text-slate-100 selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
