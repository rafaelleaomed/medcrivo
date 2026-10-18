"use client";

import React from "react";
import { ShieldCheck, Stethoscope, Lock, BookOpen } from "lucide-react";

export function WordmarkFooter() {
  return (
    <footer className="max-w-5xl mx-auto px-4 w-full pt-12 pb-8 border-t border-slate-200/80 dark:border-slate-800/80 mt-12 text-slate-500 dark:text-slate-400 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-400 text-xs font-black">
              🩺
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              CuidaAI <span className="text-teal-600 dark:text-teal-400">Studio</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-md leading-relaxed">
            Plataforma de inteligência e automação de conteúdo médico baseada em evidências científicas, conformidade regulatória CFM e autoridade clínica.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 group cursor-pointer">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 icon-hover-effect" />
            CFM 2.336/2023
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 group cursor-pointer">
            <Lock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 icon-hover-effect" />
            LGPD Blindada
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 group cursor-pointer">
            <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 icon-hover-effect" />
            Consensus AI
          </span>
        </div>
      </div>

      <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
        <p>
          © 2026 CuidaAI Studio • Todos os direitos reservados. Conteúdos gerados em estrita observância ao Código de Ética Médica.
        </p>
        <p className="font-mono text-slate-500 dark:text-slate-400">
          Ambiente Clínico Seguro • Padrão CFM nº 2.336/2023
        </p>
      </div>
    </footer>
  );
}
