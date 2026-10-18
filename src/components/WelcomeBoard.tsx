"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Stethoscope,
  Camera,
  Video,
  Play,
  Calendar,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Flame,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import {
  MEDICAL_SPECIALTIES,
  MedicalSpecialty,
  TrendingTopic,
} from "@/data/medicalSpecialtiesData";

import { DEFAULT_BRAND, EMPTY_PROFILE, councilLabel, type DoctorProfile } from "@/lib/profile";

export type { DoctorProfile } from "@/lib/profile";

interface WelcomeBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: DoctorProfile) => void;
  initialProfile?: Partial<DoctorProfile>;
}

export function WelcomeBoard({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}: WelcomeBoardProps) {
  const [name, setName] = useState(initialProfile?.name || "");
  const [crm, setCrm] = useState(initialProfile?.crm || "");
  const [rqe, setRqe] = useState(initialProfile?.rqe || "");
  const [profession, setProfession] = useState<DoctorProfile["profession"]>(initialProfile?.profession || "medico");
  const [brandPrimary, setBrandPrimary] = useState(initialProfile?.brand?.primary || DEFAULT_BRAND.primary);
  const [brandAccent, setBrandAccent] = useState(initialProfile?.brand?.accent || DEFAULT_BRAND.accent);

  // Especialidade e Seleção Inteligente
  const findInitialSpecialty = () => {
    const raw = initialProfile?.specialty;
    if (!raw) return MEDICAL_SPECIALTIES[1]; // Clínico Geral
    const lower = raw.toLowerCase();
    const found = MEDICAL_SPECIALTIES.find(
      (s) => s.name.toLowerCase().includes(lower) || lower.includes(s.name.toLowerCase())
    );
    return found || MEDICAL_SPECIALTIES[1];
  };

  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalSpecialty>(findInitialSpecialty());
  const [customSpecialtyName, setCustomSpecialtyName] = useState(
    initialProfile?.specialty || findInitialSpecialty().name
  );
  const [isCustomSpecialty, setIsCustomSpecialty] = useState(false);

  // Redes Sociais
  const [instagram, setInstagram] = useState(initialProfile?.instagram || "");
  const [tiktok, setTiktok] = useState(initialProfile?.tiktok || "");
  const [youtube, setYoutube] = useState(initialProfile?.youtube || "");
  const [bookingLink, setBookingLink] = useState(initialProfile?.bookingLink || "");

  // Temas Selecionados pelo Usuário
  const [interests, setInterests] = useState<string[]>(
    initialProfile?.interests && initialProfile.interests.length > 0
      ? initialProfile.interests
      : selectedSpecialty.trendingTopics.slice(0, 3).map((t) => t.title)
  );
  const [customInterest, setCustomInterest] = useState("");

  // Tópicos em Alta dinâmicos (validados via TrendsMCP e Base REA)
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(selectedSpecialty.trendingTopics);
  const [isValidatingTrends, setIsValidatingTrends] = useState(false);

  // Quando o usuário muda de especialidade, atualiza a lista de tópicos em alta
  const handleSpecialtyChange = async (specId: string) => {
    if (specId === "custom") {
      setIsCustomSpecialty(true);
      return;
    }

    setIsCustomSpecialty(false);
    const found = MEDICAL_SPECIALTIES.find((s) => s.id === specId);
    if (found) {
      setSelectedSpecialty(found);
      setCustomSpecialtyName(found.name);
      setTrendingTopics(found.trendingTopics);

      // Consulta de validação em segundo plano no TrendsMCP
      setIsValidatingTrends(true);
      try {
        const res = await fetch("/api/trends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialtyId: found.id, specialtyName: found.name }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.trendingTopics && data.trendingTopics.length > 0) {
            setTrendingTopics(data.trendingTopics);
          }
        }
      } catch (err) {
        // Contingência silenciosa já mantendo os tópicos da especialidade
      } finally {
        setIsValidatingTrends(false);
      }
    }
  };

  const toggleInterest = (topic: string) => {
    if (interests.includes(topic)) {
      setInterests(interests.filter((i) => i !== topic));
    } else {
      setInterests([...interests, topic]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInterest.trim();
    if (clean && !interests.includes(clean)) {
      setInterests([clean, ...interests]);
      setCustomInterest("");
    }
  };

  const handleSave = () => {
    const finalSpecialty = isCustomSpecialty ? customSpecialtyName : selectedSpecialty.name;
    const profile: DoctorProfile = {
      ...EMPTY_PROFILE,
      ...initialProfile,
      name,
      profession,
      specialty: finalSpecialty,
      crm,
      rqe,
      instagram,
      tiktok,
      youtube,
      bookingLink,
      interests,
      brand: { ...DEFAULT_BRAND, ...initialProfile?.brand, primary: brandPrimary, accent: brandAccent },
      onboarded: true,
    };
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#132D29] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Superior do Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Configuração do Perfil Médico
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personalize sua identidade e temas de interesse para sugestão de pautas em alta
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com Scroll Suave */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-900 dark:text-slate-100">
            {/* Bloco 1: Identificação Médica */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-4 h-4" /> 1. Dados Profissionais (CFM 2.336/2023)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profissão
                  </label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value as DoctorProfile["profession"])}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500 font-medium"
                  >
                    <option value="medico">Médico(a) — regras CFM</option>
                    <option value="dentista">Cirurgião(ã)-dentista — regras CFO</option>
                  </select>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cores da marca nos slides</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <input type="color" value={brandPrimary} onChange={(e) => setBrandPrimary(e.target.value)} aria-label="Cor principal" className="h-8 w-10 rounded border border-slate-200 dark:border-slate-700 bg-transparent" />
                      Principal
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <input type="color" value={brandAccent} onChange={(e) => setBrandAccent(e.target.value)} aria-label="Cor de destaque" className="h-8 w-10 rounded border border-slate-200 dark:border-slate-700 bg-transparent" />
                      Destaque
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr(a). Seu Nome"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* SELECT INTELIGENTE DE ESPECIALIDADES */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Especialidade Principal / Perfil
                  </label>
                  <select
                    value={isCustomSpecialty ? "custom" : selectedSpecialty.id}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500 font-medium"
                  >
                    {MEDICAL_SPECIALTIES.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                    <option value="custom">Outra área / Digitar manualmente...</option>
                  </select>
                </div>

                {/* Campo extra caso escolha digitar especialidade manual */}
                {isCustomSpecialty && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Digite o nome da sua especialidade ou atuação
                    </label>
                    <input
                      type="text"
                      value={customSpecialtyName}
                      onChange={(e) => setCustomSpecialtyName(e.target.value)}
                      placeholder="Ex: Medicina Integrativa, Nutrologia, etc."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {councilLabel({ profession })} com UF
                  </label>
                  <input
                    type="text"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    placeholder={`${councilLabel({ profession })}/SP 000000`}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    RQE (Registro de Especialidade)
                  </label>
                  <input
                    type="text"
                    value={rqe}
                    onChange={(e) => setRqe(e.target.value)}
                    placeholder="Ex: 89412 (opcional)"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Presença Digital */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-3">
                <Camera className="w-4 h-4" /> 2. Redes Sociais e Agendamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instagram (@perfil)
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3">
                    <Camera className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@dr.seuusuario"
                      className="w-full py-2 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    TikTok / Vídeos Curtos
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3">
                    <Video className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="@dr.saude"
                      className="w-full py-2 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Canal YouTube
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3">
                    <Play className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="youtube.com/@seucanal"
                      className="w-full py-2 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Link de Agendamento
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={bookingLink}
                      onChange={(e) => setBookingLink(e.target.value)}
                      placeholder="https://wa.me/55..."
                      className="w-full py-2 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 3: Aba de Interesses Inteligente com Validação de Trends */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 3. Seus Temas de Interesse & Linhas Editoriais
                </h3>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  {interests.length} selecionado{interests.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* SEÇÃO 3.1: SEUS TEMAS SELECIONADOS (VISÍVEIS COM BOTÃO DE EXCLUIR) */}
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Temas Ativos no seu Perfil (clique no ✕ para remover):
                </span>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/40 min-h-[50px] items-center">
                  {interests.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      Nenhum tema selecionado ainda. Escolha nas sugestões em alta abaixo ou adicione temas próprios.
                    </span>
                  ) : (
                    interests.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-teal-600 text-white flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => toggleInterest(topic)}
                          className="w-4 h-4 rounded-full hover:bg-teal-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remover tema"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* SEÇÃO 3.2: ADICIONAR TEMA PERSONALIZADO */}
              <form onSubmit={handleAddCustomInterest} className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Digitar outro interesse clínico ou prova (ex: Glaucoma, ENARE, etc)..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </form>

              {/* SEÇÃO 3.3: PAUTAS EM ALTA SEGUNDO TRENDSMCP & REA */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Pautas em Alta para {selectedSpecialty.name}
                    </span>
                  </div>
                  {isValidatingTrends ? (
                    <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Validando TrendsMCP...
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-teal-500" /> Validado TrendsMCP & REA
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((item) => {
                    const isSelected = interests.includes(item.title);
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => toggleInterest(item.title)}
                        className={`group px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] opacity-75">{item.badge}</span>
                        )}
                        <span>{item.title}</span>
                        {item.growthIndicator && !isSelected && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {item.growthIndicator}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Fixo */}
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Você poderá editar essas informações a qualquer momento.
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
            >
              Salvar e Iniciar Estúdio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
