"use client";

import React from "react";
import { AlertCircle, CheckCircle2, TrendingUp, ShieldCheck, Activity, Stethoscope, ArrowRight } from "lucide-react";

/**
 * 1. Linha do Tempo Fisiopatológica (Mecanismo de Evolução Subclínica)
 * Mostra por que não esperar sintomas para agir.
 */
export function MechanismTimeline({
  topic = "Saúde Metabólica",
  stage1 = "Sobrecarga Subclínica (Exames Normais)",
  stage2 = "Disfunção Celular & Inflamação",
  stage3 = "Manifestação Clínica & Lesão",
  opportunityWindow = "Janela de Ouro Preventiva",
}: {
  topic?: string;
  stage1?: string;
  stage2?: string;
  stage3?: string;
  opportunityWindow?: string;
}) {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-950/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 my-1.5 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            Fisiopatologia em 3 Fases
          </span>
        </div>
        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          {opportunityWindow}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 relative">
        {/* Estágio 1 */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-teal-200 dark:border-teal-900/60 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-[11px] mb-1">
            1
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Fase Inicial
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 leading-tight line-clamp-2">
            {stage1}
          </span>
        </div>

        {/* Estágio 2 */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/60 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-[11px] mb-1">
            2
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Transição
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 leading-tight line-clamp-2">
            {stage2}
          </span>
        </div>

        {/* Estágio 3 */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-rose-200 dark:border-rose-900/60 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-[11px] mb-1">
            3
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Manifesto
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 leading-tight line-clamp-2">
            {stage3}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Intervenção precoce reverte o quadro
        </span>
        <span className="font-mono text-slate-400">Diretriz Clínica</span>
      </div>
    </div>
  );
}

/**
 * 2. Matriz Comparativa "Mito Comum vs. Evidência Científica"
 * Transmite autoridade instantânea ao desmistificar condutas leigas.
 */
export function MythVsEvidence({
  myth = "Se os exames de sangue vieram dentro do intervalo de referência, não há com o que se preocupar.",
  evidence = "O intervalo laboratorial abrange 95% da população média (não necessariamente saudável). A esteatose e a resistência insulínica evoluem anos antes da alteração de transaminases.",
  source = "Hepatology / EASL Guidelines",
}: {
  myth?: string;
  evidence?: string;
  source?: string;
}) {
  return (
    <div className="w-full bg-white dark:bg-[#151D2A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden my-1.5 shadow-sm">
      {/* Topo: Mito */}
      <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Mito Popular / Erro Frequente
          </span>
        </div>
        <p className="text-[11px] text-rose-950 dark:text-rose-200 font-medium leading-snug">
          "{myth}"
        </p>
      </div>

      {/* Base: Evidência */}
      <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              O que a Ciência Comprova
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
            {source}
          </span>
        </div>
        <p className="text-[11px] text-emerald-950 dark:text-emerald-100 leading-snug">
          {evidence}
        </p>
      </div>
    </div>
  );
}

/**
 * 3. Termômetro / Medidor de Estratificação de Risco Clínico
 */
export function RiskStratificationGauge({
  metricName = "Nível de Inflamação & Sobrecarga Hepática",
  optimalLabel = "Prevenção Ativa (Alvo Funcional)",
  warningLabel = "Zona Subclínica de Alerta",
  riskLabel = "Risco Estrutural",
}: {
  metricName?: string;
  optimalLabel?: string;
  warningLabel?: string;
  riskLabel?: string;
}) {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 my-1.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
          {metricName}
        </span>
        <span className="text-[9px] font-mono text-teal-600 dark:text-teal-400 font-bold">
          Estratificação
        </span>
      </div>

      {/* Barra Tricolor do Termômetro */}
      <div className="w-full h-2 rounded-full flex overflow-hidden gap-0.5 bg-slate-200 dark:bg-slate-800">
        <div className="h-full w-1/3 bg-emerald-500 rounded-l-full"></div>
        <div className="h-full w-1/3 bg-amber-400"></div>
        <div className="h-full w-1/3 bg-rose-500 rounded-r-full"></div>
      </div>

      <div className="grid grid-cols-3 gap-1 mt-2 text-center">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">Ótimo</span>
          <span className="text-[8px] text-slate-500 dark:text-slate-400 leading-tight">{optimalLabel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">Atenção</span>
          <span className="text-[8px] text-slate-500 dark:text-slate-400 leading-tight">{warningLabel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">Alerta</span>
          <span className="text-[8px] text-slate-500 dark:text-slate-400 leading-tight">{riskLabel}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Card de Conduta Ética em 3 Passos
 */
export function ClinicalActionSteps({
  step1 = "Estratificação diagnóstica direcionada com biomarcadores de sensibilidade",
  step2 = "Ajuste de estilo de vida e modulação metabólica comprovada",
  step3 = "Reavaliação longitudinal seriada para checagem de desfecho",
}: {
  step1?: string;
  step2?: string;
  step3?: string;
}) {
  return (
    <div className="w-full space-y-1.5 my-1.5">
      <div className="flex items-start gap-2 p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60">
        <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
          1
        </span>
        <p className="text-[11px] text-teal-950 dark:text-teal-100 leading-tight">
          {step1}
        </p>
      </div>

      <div className="flex items-start gap-2 p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60">
        <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
          2
        </span>
        <p className="text-[11px] text-teal-950 dark:text-teal-100 leading-tight">
          {step2}
        </p>
      </div>

      <div className="flex items-start gap-2 p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60">
        <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
          3
        </span>
        <p className="text-[11px] text-teal-950 dark:text-teal-100 leading-tight">
          {step3}
        </p>
      </div>
    </div>
  );
}
