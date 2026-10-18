"use client";

import React from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Grid,
  Layers,
  Zap,
  Film,
  Shield,
  BookOpen,
  ArrowRight,
  Settings,
  Sparkles,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { DoctorProfile } from "./WelcomeBoard";

interface LandingHomeProps {
  doctorProfile: DoctorProfile;
  onOpenProfileSettings: () => void;
  onNavigateTab: (tabId: string) => void;
  onSelectTopicAndCreate: (topic: string) => void;
  trendingTopics: Array<{ name: string; category: string; score: number }>;
}

export function LandingHome({
  doctorProfile,
  onOpenProfileSettings,
  onNavigateTab,
  onSelectTopicAndCreate,
  trendingTopics,
}: LandingHomeProps) {
  // Mapeamento das ferramentas principais e legendas dos ícones da barra superior
  const appFeatures = [
    {
      id: "carousel",
      title: "Carrossel Educativo 4:5",
      icon: Layers,
      color: "teal",
      badge: "Formato Mais Salvo",
      legend: "Ícone de Lâminas no menu",
      description: "Crie carrosséis médicos lâmina por lâmina com diagramação limpa, referências científicas e conformidade ética.",
    },
    {
      id: "vturb",
      title: "Roteiro de Vídeo & Reels",
      icon: Film,
      color: "indigo",
      badge: "Ganchos de 3s",
      legend: "Ícone de Rolo de Filme",
      description: "Estruturação persuasiva com ganchos de alta retenção, teleprompter ajustável e linguagem humana para consultório.",
    },
    {
      id: "feed",
      title: "Simulador de Feed 3x3",
      icon: Grid,
      color: "blue",
      badge: "Grade Harmônica",
      legend: "Ícone de Grade",
      description: "Planeje o layout visual da sua grade no Instagram, garantindo equilíbrio entre posts científicos, técnicos e de conexão.",
    },
    {
      id: "virality",
      title: "Radar de Tendências",
      icon: Zap,
      color: "amber",
      badge: "Pautas em Alta",
      legend: "Ícone de Raio",
      description: "Monitore os assuntos e dúvidas de saúde mais buscados na sua especialidade com dados atualizados.",
    },
    {
      id: "compliance",
      title: "Auditor CFM & Ética",
      icon: Shield,
      color: "emerald",
      badge: "Resolução 2.336/2023",
      legend: "Ícone de Escudo",
      description: "Auditoria automática preventiva que identifica termos proibidos, promessas de resultado e ajusta para conformidade com a ANS e CFM.",
    },
    {
      id: "evidence",
      title: "Consensus Científico",
      icon: BookOpen,
      color: "cyan",
      badge: "Nível 1A / PubMed",
      legend: "Ícone de Livro Aberto",
      description: "Indexação de artigos de periódicos de alto impacto (The Lancet, NEJM) para sustentar suas afirmações com DOI e rigor.",
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* 1. HERO DE BOAS-VINDAS MÉDICO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#132D29]/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Painel Inicial • MedCrivo Studio</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Olá, Dr(a). {doctorProfile.name}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Seu estúdio unificado para transformar conhecimento médico em conteúdos educativos de alta autoridade,
              com blindagem ética e evidências científicas.
            </p>

            {/* Badges de Identificação e Redes */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {doctorProfile.specialty}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {doctorProfile.crm}
              </span>
              {doctorProfile.rqe && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  RQE {doctorProfile.rqe}
                </span>
              )}
              {doctorProfile.instagram && (
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-sans">
                  {doctorProfile.instagram}
                </span>
              )}
            </div>
          </div>

          {/* Ações Rápidas do Topo */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("carousel")}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Criar Conteúdo Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenProfileSettings}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Configurar Perfil & Interesses</span>
            </button>
          </div>
        </div>

        {/* Linha de Interesses Configurados */}
        {doctorProfile.interests && doctorProfile.interests.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Suas Linhas de Interesse:
            </span>
            {doctorProfile.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 2. MINI PAINEL DE FUNCIONALIDADES & LEGENDA DOS ÍCONES SUPERIORES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Guia de Ferramentas & Legenda dos Ícones</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Conheça as ferramentas disponíveis e navegue rapidamente através dos ícones da barra superior
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-[#132D29]/70 hover:bg-white dark:hover:bg-[#132D29] transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono font-medium">
                    {feat.legend}
                  </span>
                  <button
                    onClick={() => onNavigateTab(feat.id)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Acessar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. PAUTAS EM ALTA PERSONALIZADAS PELOS SEUS INTERESSES */}
      <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#132D29]/70 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sugestões de Pautas Baseadas nos Seus Interesses</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clique em qualquer pauta para abrir o estúdio de criação já abastecido
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("virality")}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Radar Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {trendingTopics.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectTopicAndCreate(item.name)}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-teal-500/50 hover:bg-teal-50/20 dark:hover:bg-teal-950/20 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  <span>{item.category}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">{item.score}% viral</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {item.name}
                </h4>
              </div>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-teal-600 dark:text-teal-400">
                <span>Criar carrossel / roteiro</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
