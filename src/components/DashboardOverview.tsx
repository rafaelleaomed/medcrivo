"use client";

import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Film,
  Layers,
  Grid,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Heart,
  Eye,
} from "lucide-react";

interface DashboardOverviewProps {
  doctorName: string;
  specialty: string;
  crm: string;
  rqe: string;
  viralityScore: number;
  onNavigateTab: (tab: "feed" | "carousel" | "virality" | "vturb" | "compliance" | "evidence") => void;
  onSelectTopic: (topic: string) => void;
}

export function DashboardOverview({
  doctorName,
  specialty,
  crm,
  rqe,
  viralityScore,
  onNavigateTab,
  onSelectTopic,
}: DashboardOverviewProps) {
  // Lista de publicações na esteira médica
  const recentPosts = [
    {
      id: 1,
      title: "Esteatose Hepática e Risco Cardiovascular Oculto",
      format: "Carrossel 4:5 (6 lâminas)",
      status: "Pronto para Publicar",
      statusColor: "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-500/30",
      virality: 96,
      date: "Hoje, 10:30",
      action: () => onNavigateTab("carousel"),
    },
    {
      id: 2,
      title: "3 Sintomas Silenciosos na Pele que seu Fígado Avisa",
      format: "Reel Vturb (58s)",
      status: "Roteiro Pronto / Teleprompter",
      statusColor: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30",
      virality: 98,
      date: "Ontem, 16:45",
      action: () => onNavigateTab("vturb"),
    },
    {
      id: 3,
      title: "O que seu hemograma de rotina pode esconder sobre ferritina",
      format: "Post de Alerta Clínico",
      status: "Homologado CFM",
      statusColor: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
      virality: 92,
      date: "12 de Outubro",
      action: () => onNavigateTab("feed"),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. WELCOME BANNER COM STATUS MÉDICO EXECUTIVO */}
      <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Painel de Controle Editorial Médico
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Visão Geral • Dr(a). {doctorName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Sua central de esteira de conteúdos éticos, métricas de engajamento e blindagem regulatória CFM nº 2.336/2023.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Meta Mensal</span>
            <p className="text-lg font-black text-slate-900 dark:text-white font-mono">18/30</p>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">60% concluído</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Auditoria CFM</span>
            <p className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono">100%</p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Risco Zero</span>
          </div>
        </div>
      </div>

      {/* 2. 4 CARDS DE MÉTRICAS EXECUTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Score de Viralidade</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4 icon-hover-effect" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{viralityScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 99 pts</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">
            ↑ Top 3% de retenção médica
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Blindagem Ética</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4 icon-hover-effect" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">CFM OK</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Resoluções 2.336/23 & 2.380/24
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Alcance Educativo</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Eye className="w-4 h-4 icon-hover-effect" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">42.8k</span>
            <span className="text-xs text-slate-400">visualizações</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">
            +18% de retenção média
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Evidência Indexada</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <BookOpen className="w-4 h-4 icon-hover-effect" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">400M+</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Artigos via Consensus AI
          </p>
        </div>
      </div>

      {/* 3. ATALHOS DE CRIAÇÃO RÁPIDA (HUB DE PRODUÇÃO) */}
      <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 icon-hover-effect" />
            Estúdios de Criação Rápida
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Escolha o formato desejado</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Carrossel */}
          <div
            onClick={() => onNavigateTab("carousel")}
            className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 icon-hover-effect" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Carrossel Slide-by-Slide
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Lâminas sequenciais em 4:5 com diagramação limpa e citação médica.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400">
              <span>Abrir Estúdio</span>
              <ArrowRight className="w-3.5 h-3.5 icon-hover-effect" />
            </div>
          </div>

          {/* Card 2: Vídeo */}
          <div
            onClick={() => onNavigateTab("vturb")}
            className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
              <Film className="w-5 h-5 icon-hover-effect" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Roteiro de Vídeo & Teleprompter
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Roteirização segundo a segundo (0-3s, 4-45s) com teleprompter de gravação.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <span>Gravar Vídeo</span>
              <ArrowRight className="w-3.5 h-3.5 icon-hover-effect" />
            </div>
          </div>

          {/* Card 3: Grade do Instagram */}
          <div
            onClick={() => onNavigateTab("feed")}
            className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-3">
              <Grid className="w-5 h-5 icon-hover-effect" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Simulador de Grade 3x3
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Harmonia visual e pré-visualização da sua grade no Instagram.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400">
              <span>Visualizar Feed</span>
              <ArrowRight className="w-3.5 h-3.5 icon-hover-effect" />
            </div>
          </div>

          {/* Card 4: Radar de Tendências */}
          <div
            onClick={() => onNavigateTab("virality")}
            className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 icon-hover-effect" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Radar de Tendências Médicas
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              21 fórmulas preditivas adaptadas com rigor para a ética médica.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400">
              <span>Testar Ganchos</span>
              <ArrowRight className="w-3.5 h-3.5 icon-hover-effect" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FILA DE CONTEÚDOS RECENTES NA ESTEIRA */}
      <div className="bg-white/90 dark:bg-[#101622]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Fila de Publicações Recentes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Acompanhe o status de produção e publicação</p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
            {recentPosts.length} itens ativos
          </span>
        </div>

        <div className="space-y-2.5">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              onClick={post.action}
              className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${post.statusColor}`}>
                    {post.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{post.format}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Criado em: {post.date} • Dr(a). {doctorName}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-1 rounded-lg border border-teal-500/20">
                  ⚡ {post.virality}/99
                </span>
                <button className="p-2 rounded-xl bg-white dark:bg-slate-800 group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white dark:group-hover:text-slate-950 text-slate-600 dark:text-slate-300 transition-all">
                  <ArrowRight className="w-4 h-4 icon-hover-effect" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
