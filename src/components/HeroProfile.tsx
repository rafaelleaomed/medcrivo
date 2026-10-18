"use client";

import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  RefreshCw,
  Search,
  Sparkles,
  Link as LinkIcon,
  Globe,
} from "lucide-react";

interface HeroProfileProps {
  doctorName: string;
  setDoctorName: (name: string) => void;
  specialty: string;
  setSpecialty: (specialty: string) => void;
  crm: string;
  setCrm: (crm: string) => void;
  rqe: string;
  setRqe: (rqe: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  trendingTopics: { name: string; specialty: string; score: number }[];
}

export function HeroProfile({
  doctorName,
  setDoctorName,
  specialty,
  setSpecialty,
  crm,
  setCrm,
  rqe,
  setRqe,
  topic,
  setTopic,
  onGenerate,
  isLoading,
  trendingTopics,
}: HeroProfileProps) {
  const isUrl = topic.trim().startsWith("http://") || topic.trim().startsWith("https://");

  return (
    <section className="max-w-5xl mx-auto px-4 w-full pt-4 pb-2">
      {/* Bento Container Principal de Perfil (Ruixen UI Minimal Style) */}
      <div className="bg-white/90 dark:bg-[#132D29]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 relative overflow-hidden">
        {/* Glow sutil orgânico (não robotizado) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-500/5 dark:bg-slate-700/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Foto / Avatar do Médico com Stories Ring e microinteração */}
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-teal-500 via-emerald-600 to-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0C1F1C] border-2 border-white dark:border-[#132D29] flex items-center justify-center text-slate-800 dark:text-white font-bold text-2xl overflow-hidden">
                  <span className="text-teal-600 dark:text-teal-400 font-serif">Dr</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 p-1 rounded-full border-2 border-white dark:border-[#132D29] shadow-sm">
                <CheckCircle2 className="w-4 h-4 icon-hover-effect" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Dr(a). {doctorName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  CRM Verificado
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="text-teal-700 dark:text-teal-400 font-bold">{specialty}</span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{crm}</span>
                {rqe && (
                  <>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span className="font-mono text-xs text-teal-600 dark:text-teal-400">RQE: {rqe}</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
                  Ativo no Consultório
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 group cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 icon-hover-effect" />
                  CFM nº 2.336/2023 Conforme
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Metadados Médicos (Clean Minimalist Cards) */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <span className="text-slate-400">Médico:</span>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold w-28 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <span className="text-slate-400">CRM:</span>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                className="bg-transparent text-teal-700 dark:text-teal-400 font-bold w-24 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <span className="text-slate-400">RQE:</span>
              <input
                type="text"
                value={rqe}
                onChange={(e) => setRqe(e.target.value)}
                className="bg-transparent text-teal-600 dark:text-teal-400 font-bold w-16 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Input de Geração e Pautas Quentes (Estilo Ruixen UI Command Bar com suporte a Links/Notícias) */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full group">
              {isUrl ? (
                <LinkIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 animate-pulse icon-hover-effect" />
              ) : (
                <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 icon-hover-effect" />
              )}
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Digite um tema clínico ou cole o link de uma notícia/artigo (https://...)"
                className={`w-full bg-slate-50 dark:bg-[#0C1F1C] border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-inner ${
                  isUrl
                    ? "border-teal-500/80 ring-2 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:border-teal-500"
                }`}
              />
            </div>

            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="group w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 icon-hover-effect ${isLoading ? "animate-spin" : ""}`} />
              {isLoading
                ? "Consultando Evidências..."
                : isUrl
                ? "Gerar a partir da Notícia"
                : "Gerar Conteúdo Médico com IA"}
            </button>
          </div>

          {/* Alerta Visual quando um Link de Notícia é Detectado */}
          {isUrl && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Link de Notícia / Artigo detectado:</strong> A IA extrairá os fatos clínicos da página, estruturará o carrossel encadeado e adicionará a citação da publicação.
              </span>
            </div>
          )}

          {/* Radar de Pautas Quentes Clínicas (Ruixen UI Minimal Tags com Hover) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Pautas em Alta:
            </span>
            {trendingTopics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(t.name);
                  onGenerate();
                }}
                className="group px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 text-[11px] text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white shrink-0 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span>{t.name}</span>
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">
                  ⚡{t.score}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
