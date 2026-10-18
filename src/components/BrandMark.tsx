/* eslint-disable @next/next/no-img-element -- SVG estático da marca, sem ganho com next/image */
import React from "react";
import { BRAND } from "@/config/brand";

/** Símbolo reduzido + "MedCrivo" com o "C" em destaque (Teal no claro, Lima no escuro). */
export function BrandMark({ size = 32, showProduct = true, className = "" }: { size?: number; showProduct?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src={BRAND.assets.symbol} alt="" width={size} height={size} className="dark:hidden" />
      <img src={BRAND.assets.symbolOnDark} alt="" width={size} height={size} className="hidden dark:block rounded-md" />
      <span className="font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight leading-none text-[#172A27] dark:text-[#F5F2E9]">
        Med<span className="text-[#16796F] dark:text-[#D6EF72]">C</span>rivo
        {showProduct && <span className="ml-1 font-semibold text-[#16796F] dark:text-[#D6EF72]">Studio</span>}
      </span>
    </span>
  );
}
