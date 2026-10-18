"use client";

import React, { useState } from "react";
import { Zap, TrendingUp, Sparkles, Share2, Bookmark, Eye, MessageSquare, Check } from "lucide-react";

interface ViralityRadarProps {
  score: number;
  onSelectHook?: (hookTitle: string, hookSpeech: string) => void;
}

export function ViralityRadar({ score = 94, onSelectHook }: ViralityRadarProps) {
  const [selectedFormula, setSelectedFormula] = useState<number>(0);

  // 21 Fórmulas de Ganchos Médicos Virais (Metodologia ViralityAI + Vturb)
  const hookFormulas = [
    {
      id: 0,
      name: "O Alerta Silencioso",
      category: "Prevenção",
      score: 96,
      title: "3 sinais discretos na sua pele que seu fígado dá antes de inflamar",
      speech: "Se você tem essa manchinha clara ou coceira sem motivo, não passe hidratante antes de checar isso.",
      reason: "Gatilho de curiosidade imediata e identificação física no corpo do espectador.",
    },
    {
      id: 1,
      name: "A Quebra de Mito",
      category: "Alimentação & Rotina",
      score: 94,
      title: "Você toma esse suplemento em jejum todo dia? Pare agora antes de ver isso",
      speech: "90% das pessoas tomam essa vitamina do jeito errado e acabam jogando dinheiro no lixo.",
      reason: "Quebra de hábito cotidiano estabelecido com urgência moderada e ética.",
    },
    {
      id: 2,
      name: "O Paradoxo Clínico",
      category: "Cardiologia / Estilo de Vida",
      score: 92,
      title: "Por que cortar o sal de forma radical pode não estar baixando sua pressão",
      speech: "A medicina descobriu que a proporção sódio-potássio importa mais do que você imagina.",
      reason: "Contradiz o senso comum com fundamentação científica que gera alto debate nos comentários.",
    },
    {
      id: 3,
      name: "O Diagnóstico Inesperado",
      category: "Metabolismo",
      score: 95,
      title: "Não é preguiça nem falta de foco: o que seu exame de ferritina pode estar gritando",
      speech: "Quando recebo pacientes que dormem 8 horas e acordam exaustos, olho para este marcador primeiro.",
      reason: "Valida o sofrimento do paciente sem culpabilizá-lo, gerando conexão empática profunda.",
    },
    {
      id: 4,
      name: "A Comparação Visual",
      category: "Clínica Geral",
      score: 91,
      title: "O que acontece com suas artérias em 30 dias quando você troca estes 2 alimentos",
      speech: "Não é mágica nem dieta restritiva: é biofisiologia vascular básica explicada em 60 segundos.",
      reason: "Promessa de transformação explicada por mecanismo fisiológico palpável.",
    },
  ];

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shadow-sm">
            <Zap className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Radar de Tendências e Engajamento
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono">
                Score Preditivo 0-100
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Análise algorítmica de retenção nos 3s, potencial de compartilhamento e utilidade clínica.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
          Alta Probabilidade de Entrega
        </span>
      </div>

      {/* Seção Principal: Gauge Radial + 4 Pilares de Retenção */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Velocímetro Radial Circular SVG com Paleta Elegante Humana */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-colors duration-300">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              {/* Círculo de fundo */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Círculo de progresso com gradiente clássico suave */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="url(#viralityGradientHuman)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="viralityGradientHuman" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0D9488" />
                  <stop offset="70%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>

            {/* Conteúdo central do círculo */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                de 99 pts
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              ⚡ Nível Viral Alto (Top 3%)
            </span>
          </div>
        </div>

        {/* 4 Pilares de Retenção & Conversão (ViralityAI Breakdown) */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-3 transition-colors duration-300">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400 icon-hover-effect" />
            Desdobramento dos 4 Fatores do Algoritmo
          </h4>

          <div className="space-y-3">
            {/* Pilar 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 icon-hover-effect" /> Gancho Primeiros 3 Segundos (Stop Scroll)
                </span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">96%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full w-[96%]" />
              </div>
            </div>

            {/* Pilar 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Bookmark className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 icon-hover-effect" /> Taxa de Salvamento (Utilidade Clínica)
                </span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">94%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full w-[94%]" />
              </div>
            </div>

            {/* Pilar 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 icon-hover-effect" /> Compartilhamentos (Envio Família / WhatsApp)
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">91%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full w-[91%]" />
              </div>
            </div>

            {/* Pilar 4 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 icon-hover-effect" /> Ativação de Comentários Éticos
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">88%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-600 dark:bg-amber-500 h-2 rounded-full w-[88%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Ganchos Médicos (Hook Matrix com Hover Suave) */}
      <div className="bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 icon-hover-effect" />
            Matriz de Ganchos Virais (Selecione para aplicar)
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Formatado para credibilidade médica</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hookFormulas.map((h, idx) => (
            <div
              key={h.id}
              onClick={() => {
                setSelectedFormula(idx);
                if (onSelectHook) onSelectHook(h.title, h.speech);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-2.5 ${
                selectedFormula === idx
                  ? "bg-white dark:bg-slate-800/90 border-teal-500 ring-2 ring-teal-500/20 shadow-md"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {h.name}
                </span>
                <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                  ⚡ {h.score}/99
                </span>
              </div>

              <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                "{h.title}"
              </p>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2 bg-slate-50 dark:bg-[#090D15] p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                "{h.speech}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span>{h.reason}</span>
                {selectedFormula === idx && (
                  <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 icon-hover-effect" /> Aplicado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
