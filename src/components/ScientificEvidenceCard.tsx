"use client";

import React from "react";
import { BookOpen, ExternalLink, CheckCircle2, Bookmark, Sparkles } from "lucide-react";
import { ScientificEvidence } from "@/lib/consensus";

interface ScientificEvidenceCardProps {
  evidence: ScientificEvidence[];
  topic: string;
}

export function ScientificEvidenceCard({ evidence, topic }: ScientificEvidenceCardProps) {
  const primary = evidence && evidence.length > 0 ? evidence[0] : null;

  return (
    <div className="bg-white/90 dark:bg-[#132D29]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-md shadow-teal-500/10">
            <BookOpen className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Evidência Clínica Indexada
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-mono">
                Consensus AI + PubMed
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Citação científica validada para fundamentar a autoridade médica e garantir respaldo.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 icon-hover-effect" /> Revisado por Pares
        </span>
      </div>

      {/* Card do Estudo Principal */}
      {primary ? (
        <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 transition-colors duration-300">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                {primary.evidenceLevel}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                {primary.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                {primary.journal} • {primary.year} • DOI: {primary.doi}
              </p>
            </div>

            <a
              href={`https://doi.org/${primary.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shrink-0"
              title="Acessar no PubMed / DOI"
            >
              <ExternalLink className="w-4 h-4 icon-hover-effect" />
            </a>
          </div>

          {/* Consensus Takeaway */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 icon-hover-effect" /> Consensus Takeaway (Conclusão Clínica):
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
              &quot;{primary.takeaway}&quot;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-3">
            <span>Citado automaticamente nas lâminas do carrossel e no roteiro de vídeo.</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Fonte: ${primary.title}. ${primary.journal} (${primary.year}). DOI: ${primary.doi}`
                );
                alert("Citação copiada em padrão ABNT / Vancouver!");
              }}
              className="group text-teal-700 dark:text-teal-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Bookmark className="w-3 h-3 icon-hover-effect" /> Copiar Citação Científica
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
          Nenhum artigo recuperado no momento. Digite um tema clínico para consultar o Consensus AI.
        </div>
      )}
    </div>
  );
}
