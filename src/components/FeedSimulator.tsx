"use client";

import React, { useState } from "react";
import { Grid, Bookmark, Film, CheckCircle2, ShieldCheck, Heart, MessageCircle, Share2, Award } from "lucide-react";

interface FeedSimulatorProps {
  doctorName: string;
  specialty: string;
  crm: string;
  rqe: string;
  currentPostTitle: string;
  currentPostHook: string;
  viralityScore: number;
}

export function FeedSimulator({
  doctorName,
  specialty,
  crm,
  rqe,
  currentPostTitle,
  currentPostHook,
  viralityScore,
}: FeedSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");
  const [selectedGridIndex, setSelectedGridIndex] = useState<number>(0);

  // Grid simulada 3x3 do feed médico com paleta visual sofisticada e humana
  const gridItems = [
    {
      id: 0,
      type: "carousel",
      tag: "EM DESTAQUE",
      title: currentPostTitle || "A verdade sobre o exame de rotina",
      hook: currentPostHook || "O detalhe que muda seu diagnóstico",
      virality: viralityScore,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-teal-900/90 via-slate-900 to-slate-950 text-white",
      badge: "Carrossel Científico",
    },
    {
      id: 1,
      type: "reel",
      tag: "VÍDEO VIRAL",
      title: "3 sintomas silenciosos que você ignora",
      hook: "Seu corpo avisa antes de inflamar",
      virality: 96,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white",
      badge: "Reel Clínico",
    },
    {
      id: 2,
      type: "post",
      tag: "ALERTA CLÍNICO",
      title: "Mito do jejum intermitente investigado",
      hook: "O que o ensaio clínico comprovou",
      virality: 89,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white",
      badge: "Post Único",
    },
    {
      id: 3,
      type: "carousel",
      tag: "CASO CLÍNICO",
      title: "Quando o cansaço não é anemia",
      hook: "Investigando a causa metabólica real",
      virality: 91,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-850 via-slate-900 to-black text-white",
      badge: "Carrossel",
    },
    {
      id: 4,
      type: "reel",
      tag: "ROTEIRO REELS",
      title: "Você toma esse suplemento todo dia?",
      hook: "Pare agora antes de saber disso",
      virality: 98,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white",
      badge: "Reel 58s",
    },
    {
      id: 5,
      type: "post",
      tag: "GUIA PRÁTICO",
      title: "Como ler seu lipidograma sem medo",
      hook: "Colesterol: frações que realmente importam",
      virality: 87,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white",
      badge: "Infográfico",
    },
    {
      id: 6,
      type: "carousel",
      tag: "META-ANÁLISE",
      title: "Ultraprocessados e inflamação celular",
      hook: "Estudo publicado na The Lancet",
      virality: 93,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-800 via-teal-950 to-slate-900 text-white",
      badge: "Carrossel",
    },
    {
      id: 7,
      type: "reel",
      tag: "CASO DO DIA",
      title: "Dor nas costas que piora à noite",
      hook: "Bandeiras vermelhas que exigem consulta",
      virality: 94,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white",
      badge: "Reel 45s",
    },
    {
      id: 8,
      type: "post",
      tag: "PRESCRIÇÃO ÉTICA",
      title: "Higiene do sono baseada em evidências",
      hook: "Sem melatonina em excesso",
      virality: 88,
      cfmVerified: true,
      bg: "bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-950 text-white",
      badge: "Carrossel",
    },
  ];

  return (
    <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-5">
      {/* Top Banner do Simulador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-md shadow-teal-500/10">
            <Grid className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Simulador de Feed do Instagram 3x3
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-mono">
                Harmonia Visual
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grade visual equilibrada com alternância entre carrossel, reel e post de autoridade médica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 icon-hover-effect" />
            CFM 2.336/2023 Conforme
          </span>
        </div>
      </div>

      {/* Mockup do Perfil do Instagram (Tema Claro/Escuro Refinado) */}
      <div className="bg-slate-50 dark:bg-[#090D15] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-colors duration-300">
        <div className="flex items-center gap-4">
          {/* Avatar com Story ring */}
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-[#090D15] flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xl overflow-hidden">
                <span className="text-teal-600 dark:text-teal-400 font-serif">Dr</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 p-1 rounded-full border-2 border-slate-50 dark:border-[#090D15]">
              <CheckCircle2 className="w-3.5 h-3.5 icon-hover-effect" />
            </div>
          </div>

          {/* Dados do Médico */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                dr_{doctorName.toLowerCase().replace(/[\s.]+/g, "_")}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                Oficial
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Dr(a). {doctorName} • <span className="text-teal-700 dark:text-teal-400">{specialty}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              MÉDICO • {crm} {rqe ? `• RQE: ${rqe}` : "• NÃO ESPECIALISTA"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
              🩺 Medicina baseada em evidências científicas • 📍 Consultório presencial e telemedicina ética • 👇 Agendamento:
            </p>
          </div>
        </div>

        {/* Story Highlights Médicos */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 border-t border-slate-200/80 dark:border-slate-800/60 pt-3">
          {[
            { label: "Consultório", icon: "🏥" },
            { label: "Evidências", icon: "🔬" },
            { label: "Orientações", icon: "📋" },
            { label: "Artigos", icon: "📚" },
            { label: "Agendamento", icon: "📲" },
          ].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 flex items-center justify-center text-lg transition-all duration-300 group-hover:border-teal-500 group-hover:scale-105 shadow-sm">
                <span className="icon-hover-effect">{h.icon}</span>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium group-hover:text-teal-600 dark:group-hover:text-teal-300">
                {h.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tab Selector com Microinterações */}
        <div className="flex border-t border-slate-200/80 dark:border-slate-800/80 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setActiveTab("posts")}
            className={`group flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "posts"
                ? "border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-bold"
                : "border-transparent hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Grid className="w-4 h-4 icon-hover-effect" /> Grade
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`group flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "reels"
                ? "border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-bold"
                : "border-transparent hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Film className="w-4 h-4 icon-hover-effect" /> Reels & Vídeos
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`group flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "saved"
                ? "border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-bold"
                : "border-transparent hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Bookmark className="w-4 h-4 icon-hover-effect" /> Salvos Éticos
          </button>
        </div>

        {/* Grade 3x3 com Hover Sofisticado */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {gridItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedGridIndex(idx)}
              className={`relative aspect-square rounded-xl p-2.5 flex flex-col justify-between cursor-pointer border transition-all duration-300 overflow-hidden group ${
                item.bg
              } ${
                selectedGridIndex === idx
                  ? "ring-2 ring-teal-500 border-teal-500 scale-[1.02] shadow-lg shadow-teal-500/20"
                  : "border-slate-800/80 hover:border-teal-500/50 hover:scale-[1.01]"
              }`}
            >
              {/* Badge superior com microinteração */}
              <div className="flex items-center justify-between gap-1 z-10">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 border border-white/10">
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-300 bg-black/70 px-1 rounded border border-teal-500/30">
                  ⚡ {item.virality}
                </span>
              </div>

              {/* Título do post */}
              <div className="z-10 my-auto">
                <p className="text-[11px] font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                  {item.title}
                </p>
                <p className="text-[9px] text-slate-300 line-clamp-1 mt-0.5 opacity-80">
                  {item.hook}
                </p>
              </div>

              {/* Rodapé da lâmina */}
              <div className="flex items-center justify-between text-[9px] text-slate-300 border-t border-white/10 pt-1 z-10">
                <span className="font-mono text-[9px]">
                  {crm.split(" ")[0]}
                </span>
                <span className="text-teal-400 font-bold">CFM ✔</span>
              </div>

              {/* Overlay hover suave */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white z-20 backdrop-blur-[2px]">
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 icon-hover-effect" />
                  <span>1.2k</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <MessageCircle className="w-3.5 h-3.5 icon-hover-effect" />
                  <span>84</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhe do Post Selecionado com Barra de Ações Rápidas */}
      <div className="bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Award className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">
              Post Ativo: {gridItems[selectedGridIndex].title}
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Virality Score: <strong className="text-teal-600 dark:text-teal-400">{gridItems[selectedGridIndex].virality}/99</strong> • {gridItems[selectedGridIndex].badge} • Auditoria CFM Homologada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => alert("Post aprovado e enfileirado para publicação ética via Meta API!")}
            className="group flex-1 md:flex-initial px-4 py-2 rounded-xl bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 icon-hover-effect" /> Aprovar & Enfileirar
          </button>
          <button
            onClick={() => alert("Legenda completa e tags copiadas para a área de transferência!")}
            className="group px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 icon-hover-effect" /> Copiar Legenda
          </button>
        </div>
      </div>
    </div>
  );
}
