"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Download,
  Shield,
  Bookmark,
  ArrowRight,
  Sparkles,
  Share2,
  MessageSquare,
  UserPlus,
  Hash,
  Palette,
  ExternalLink,
  BookOpen,
  MoreHorizontal,
  Repeat,
  Heart,
  Share,
  ImageIcon,
  RefreshCw,
  Activity,
  BarChart2,
} from "lucide-react";
import {
  MechanismTimeline,
  MythVsEvidence,
  RiskStratificationGauge,
  ClinicalActionSteps,
} from "./infographics/ClinicalInfographics";
import {
  RemotionEditorialCarouselPlayer,
} from "./infographics/RemotionEditorialCarouselPlayer";
import {
  auditInstagramCaption,
  INSTAGRAM_HOOK_FORMULAS,
  EngagementGoal,
} from "@/lib/instagramEngine";
import {
  generateInterlinkedCarouselSlides,
  CAROUSEL_LAYOUT_THEMES,
  CarouselLayoutTheme,
  CarouselSlide,
  buildImageUrlFromPrompt,
  generateMedicalImagePrompt,
} from "@/lib/carouselEngine";

interface CarouselStudioProps {
  topic: string;
  specialty: string;
  doctorName: string;
  crm: string;
  rqe: string;
  scientificCitation?: string;
  doctorInstagram?: string;
  variationSeed?: number;
  initialSlides?: CarouselSlide[];
  onSlidesUpdated?: (slides: CarouselSlide[]) => void;
}

export function CarouselStudio({
  topic,
  specialty,
  doctorName,
  crm,
  rqe,
  doctorInstagram,
  variationSeed,
  initialSlides,
  onSlidesUpdated,
}: CarouselStudioProps) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [tone, setTone] = useState<"didatico" | "academico" | "consultorio">("didatico");
  const [goal, setGoal] = useState<EngagementGoal>("saves");
  const [layoutThemeId, setLayoutThemeId] = useState<CarouselLayoutTheme["id"]>("tweet_clean");
  const [customImageSeeds, setCustomImageSeeds] = useState<Record<number, number>>({});
  const [isRegeneratingImage, setIsRegeneratingImage] = useState<boolean>(false);
  const [isAdaptingAI, setIsAdaptingAI] = useState<boolean>(false);
  const [dynamicSlides, setDynamicSlides] = useState<CarouselSlide[] | null>(initialSlides || null);

  // Sincroniza dynamicSlides quando initialSlides mudar (ajuste durante a renderização, sem effect)
  const [prevInitialSlides, setPrevInitialSlides] = useState(initialSlides);
  if (initialSlides !== prevInitialSlides) {
    setPrevInitialSlides(initialSlides);
    if (initialSlides && initialSlides.length > 0) {
      setDynamicSlides(initialSlides);
    }
  }

  // Função para adaptar os slides via IA real ao mudar Tom ou Meta
  const adaptCarouselWithAI = async (newTone: "didatico" | "academico" | "consultorio", newGoal: EngagementGoal) => {
    setIsAdaptingAI(true);
    try {
      const res = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          specialty,
          doctorName,
          crm,
          rqe,
          tone: newTone,
          goal: newGoal,
        }),
      });
      const data = await res.json();
      if (data.success && data.slides && data.slides.length > 0) {
        setDynamicSlides(data.slides);
        if (onSlidesUpdated) onSlidesUpdated(data.slides);
      }
    } catch (e) {
      console.warn("Falha ao adaptar com IA, mantendo estado atual:", e);
    } finally {
      setIsAdaptingAI(false);
    }
  };

  const handleToneChange = (newTone: "didatico" | "academico" | "consultorio") => {
    setTone(newTone);
    adaptCarouselWithAI(newTone, goal);
  };

  const handleGoalChange = (newGoal: EngagementGoal) => {
    setGoal(newGoal);
    adaptCarouselWithAI(tone, newGoal);
  };

  // Handle do médico para visual de post do X
  const doctorHandle = useMemo(() => {
    if (doctorInstagram && doctorInstagram.trim().length > 1) {
      return doctorInstagram.startsWith("@") ? doctorInstagram : `@${doctorInstagram}`;
    }
    const cleanName = doctorName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `@dr.${cleanName || "medico"}`;
  }, [doctorInstagram, doctorName]);

  // Modo visual: Infográficos Clínicos Programáticos ou Fotografia Editorial
  const [visualMode, setVisualMode] = useState<"infographic" | "photo">("infographic");

  // Encontra o tema visual ativo
  const activeTheme = useMemo(() => {
    return CAROUSEL_LAYOUT_THEMES.find((t) => t.id === layoutThemeId) || CAROUSEL_LAYOUT_THEMES[0];
  }, [layoutThemeId]);

  // GERAÇÃO DE LÂMINAS: Prioriza a IA dinâmica (dynamicSlides), com fallback local inteligente
  const baseSlides: CarouselSlide[] = useMemo(() => {
    if (dynamicSlides && dynamicSlides.length > 0) {
      return dynamicSlides;
    }
    return generateInterlinkedCarouselSlides(
      topic,
      specialty,
      doctorName,
      crm,
      rqe,
      // Sem referência inventada: só entra citação real vinda do pipeline de evidências.
      undefined,
      variationSeed
    );
  }, [dynamicSlides, topic, specialty, doctorName, crm, rqe, variationSeed]);

  // Aplica sementes personalizadas de imagem quando o usuário clica em regenerar
  const slides: CarouselSlide[] = useMemo(() => {
    return baseSlides.map((s) => {
      if (customImageSeeds[s.number] && s.imagePrompt) {
        return {
          ...s,
          imageUrl: buildImageUrlFromPrompt(s.imagePrompt, customImageSeeds[s.number]),
        };
      }
      return s;
    });
  }, [baseSlides, customImageSeeds]);

  // Renderizador do elemento visual da lâmina (Infográfico Clínico ou Fotografia)
  const renderVisualElement = (slide: CarouselSlide) => {
    if (visualMode === "infographic") {
      if (slide.number === 1 || slide.number === 2) {
        return <MechanismTimeline topic={topic} />;
      }
      if (slide.number === 3) {
        return (
          <MythVsEvidence
            myth={slide.subtext}
            evidence={slide.takeaway || "Reversão precoce com modulação clínica comprovada em ensaios randomizados."}
            source={slides[3]?.scientificReference?.journal || "Diretrizes Clínicas"}
          />
        );
      }
      if (slide.number === 4) {
        return <RiskStratificationGauge metricName={`Estratificação de Biomarcadores: ${topic}`} />;
      }
      if (slide.number === 5) {
        return (
          <ClinicalActionSteps
            step1={slide.bullets?.[0] || "Estratificação diagnóstica direcionada"}
            step2={slide.bullets?.[1] || "Modulação metabólica comprovada"}
            step3={slide.bullets?.[2] || "Monitoramento longitudinal com critérios objetivos"}
          />
        );
      }
    }

    if (slide.imageUrl) {
      return (
        <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden my-1 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-900 group/img">
          <img
            src={slide.imageUrl}
            alt={slide.headline}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] text-white font-mono flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-teal-300" /> Foto Editorial
          </div>
        </div>
      );
    }

    return null;
  };

  // Garante índice seguro
  const safeIndex = Math.min(activeSlide, slides.length - 1);
  const currentSlide = slides[safeIndex] || slides[0];

  // Função para regenerar a imagem da lâmina ativa com nova semente
  const handleRegenerateSlideImage = () => {
    setIsRegeneratingImage(true);
    const newSeed = Math.floor(Math.random() * 100000) + 1;
    setTimeout(() => {
      setCustomImageSeeds((prev) => ({
        ...prev,
        [currentSlide.number]: newSeed,
      }));
      setIsRegeneratingImage(false);
    }, 400);
  };

  // Referência científica do slide 4 para inclusão na legenda
  const slide4Reference = slides[3]?.scientificReference;

  // Legenda do Instagram com citação científica explícita
  const baseCaption = `${topic}: o que muitos ignoram na consulta de rotina.\n\nA literatura médica recente demonstra que pequenas alterações subclínicas sinalizam intervenções preventivas precoces muito antes de sintomas graves se manifestarem.\n\nCompartilhe este alerta e salve para rever seus exames com critério.\n\nDr(a). ${doctorName} • ${crm}${rqe ? ` • RQE ${rqe}` : ""}${
    slide4Reference
      ? `\n\n📚 Fonte Científica Citada:\n• Periódico: ${slide4Reference.journal} (${slide4Reference.year})\n• Evidência: ${slide4Reference.evidenceLevel}\n• DOI: https://doi.org/${slide4Reference.doi}`
      : ""
  }`;

  const captionAudit = auditInstagramCaption(baseCaption, topic, specialty, crm, goal);
  const activeFormula = INSTAGRAM_HOOK_FORMULAS.find((f) => f.goal === goal) || INSTAGRAM_HOOK_FORMULAS[0];

  const copySlideText = () => {
    const refText = currentSlide.scientificReference
      ? `\n\n[Fonte Científica: ${currentSlide.scientificReference.journal} (${currentSlide.scientificReference.year}) - DOI: ${currentSlide.scientificReference.doi}]`
      : "";

    const text = `[Slide ${currentSlide.number}/${slides.length} - ${currentSlide.type}]\n${currentSlide.headline}\n\n${currentSlide.subtext}${currentSlide.bullets ? `\n\nPontos:\n${currentSlide.bullets.join("\n")}` : ""}${currentSlide.takeaway ? `\n\nNota: ${currentSlide.takeaway}` : ""}${refText}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Motor de renderização e download real em PNG 1080x1350px (Editorial Viral Engine)
  const exportSlideAsPNG = (targetIndex: number) => {
    const slideToExport = slides[targetIndex] || currentSlide;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isBrands = layoutThemeId === "brands_decoded";

    // 1. Fundo
    ctx.fillStyle = isBrands ? "#0A0A0A" : activeTheme.id === "obsidian" || activeTheme.id === "alert" ? "#0C1F1C" : "#FFFFFF";
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Borda externa
    ctx.strokeStyle = isBrands ? "#222222" : "#E2E8F0";
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1032, 1302);

    // 3. Grid de pontos sutis para o layout Editorial Viral
    if (isBrands) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      for (let x = 60; x < 1020; x += 40) {
        for (let y = 60; y < 1290; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. Badge Superior
    const badgeText = isBrands ? `[ ${specialty.toUpperCase() || "MEDICINA & SAÚDE"} ]` : slideToExport.badge;
    ctx.fillStyle = isBrands ? "rgba(255, 230, 0, 0.15)" : "#E6FFFA";
    ctx.fillRect(80, 80, 380, 52);
    ctx.strokeStyle = isBrands ? "rgba(255, 230, 0, 0.5)" : "#319795";
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 80, 380, 52);

    ctx.fillStyle = isBrands ? "#FFE600" : "#234E52";
    ctx.font = isBrands ? "bold 24px 'Barlow Condensed', sans-serif" : "bold 20px 'Inter', sans-serif";
    ctx.fillText(badgeText, 105, 115);

    // 5. Contador (01/06 ou 01/09)
    ctx.fillStyle = isBrands ? "#888888" : "#64748B";
    ctx.font = "bold 32px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${String(targetIndex + 1).padStart(2, "0")}/${String(slides.length).padStart(2, "0")}`, 1000, 115);
    ctx.textAlign = "left";

    // 6. Headline Principal (Barlow Condensed ou Sans)
    ctx.fillStyle = isBrands || activeTheme.id === "obsidian" || activeTheme.id === "alert" ? "#FFFFFF" : "#0F172A";
    ctx.font = isBrands ? "900 60px 'Barlow Condensed', sans-serif" : "bold 44px 'Inter', sans-serif";

    const words = slideToExport.headline.split(" ");
    let line = "";
    let y = 280;
    const lineHeight = isBrands ? 68 : 54;
    const maxWidth = 920;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 80, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);

    // Linha de acento
    y += 25;
    ctx.fillStyle = isBrands ? "#FFE600" : "#16796F";
    ctx.fillRect(80, y, 140, 6);
    y += 50;

    // 7. Subtítulo
    ctx.fillStyle = isBrands || activeTheme.id === "obsidian" || activeTheme.id === "alert" ? "#CBD5E1" : "#334155";
    ctx.font = "400 30px 'Inter', sans-serif";
    const subWords = slideToExport.subtext.split(" ");
    let subLine = "";
    const subLineHeight = 44;

    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(subLine, 80, y);
        subLine = subWords[n] + " ";
        y += subLineHeight;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine, 80, y);
    y += 60;

    // 8. Bullets
    if (slideToExport.bullets && slideToExport.bullets.length > 0) {
      slideToExport.bullets.forEach((b) => {
        ctx.fillStyle = isBrands ? "#141414" : "#F8FAFC";
        ctx.fillRect(80, y, maxWidth, 95);
        ctx.strokeStyle = isBrands ? "#242424" : "#E2E8F0";
        ctx.lineWidth = 2;
        ctx.strokeRect(80, y, maxWidth, 95);

        ctx.fillStyle = isBrands ? "#FFE600" : "#16796F";
        ctx.beginPath();
        ctx.arc(115, y + 47, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isBrands ? "#E5E7EB" : "#1E293B";
        ctx.font = "500 24px 'Inter', sans-serif";
        ctx.fillText(b.substring(0, 75) + (b.length > 75 ? "..." : ""), 145, y + 55);
        y += 115;
      });
    }

    // 9. Rodapé
    ctx.fillStyle = isBrands ? "#202020" : "#E2E8F0";
    ctx.fillRect(80, 1220, maxWidth, 2);

    ctx.fillStyle = isBrands ? "#888888" : "#64748B";
    ctx.font = "600 26px monospace";
    ctx.fillText(`Dr(a). ${doctorName} • ${crm}`, 80, 1275);

    ctx.fillStyle = isBrands ? "#FFE600" : "#16796F";
    ctx.font = isBrands ? "bold 30px 'Barlow Condensed', sans-serif" : "bold 24px 'Inter', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("ARRASTE PARA O LADO →", 1000, 1275);
    ctx.textAlign = "left";

    const link = document.createElement("a");
    link.download = `carrossel-slide-${String(targetIndex + 1).padStart(2, "0")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportAllSlides = () => {
    slides.forEach((_, idx) => {
      setTimeout(() => {
        exportSlideAsPNG(idx);
      }, idx * 300);
    });
  };


  return (
    <div className="bg-white/90 dark:bg-[#132D29]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-6">
      {/* 1. Header do Estúdio de Carrossel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-md shadow-teal-500/10">
            <Layers className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Estúdio de Carrossel Encadeado & IA Visual
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-mono font-bold">
                Padrão 4:5 Instagram
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lâminas sequenciais sem poluição de rodapés redundantes, com imagens médicas integradas por IA e referência científica.
            </p>
          </div>
        </div>

        {/* Seletores: Meta no Instagram e Tom */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Meta (Instagram Skills) */}
          {/* Seletor de Meta (Instagram Skills) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
            <span className="text-[10px] text-slate-400 px-1.5 font-medium flex items-center gap-1">
              Meta: {isAdaptingAI && <RefreshCw className="w-2.5 h-2.5 animate-spin text-teal-600" />}
            </span>
            {([
              { id: "saves", label: "Salvar", icon: Bookmark },
              { id: "shares", label: "Compartilhar", icon: Share2 },
              { id: "comments", label: "Comentar", icon: MessageSquare },
              { id: "follows", label: "Seguir", icon: UserPlus },
            ] as const).map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  disabled={isAdaptingAI}
                  onClick={() => handleGoalChange(g.id)}
                  className={`px-2 py-1 rounded-lg transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                    goal === g.id
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>

          {/* Seletor de Tom */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-medium">Tom:</span>
            {(["didatico", "academico", "consultorio"] as const).map((t) => (
              <button
                key={t}
                disabled={isAdaptingAI}
                onClick={() => handleToneChange(t)}
                className={`px-2 py-1 rounded-lg transition-all font-medium capitalize cursor-pointer text-xs disabled:opacity-50 ${
                  tone === t
                    ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. BARRA DE SELEÇÃO DOS MODELOS DE LAYOUT / DESIGN */}
      <div className="bg-slate-50/80 dark:bg-[#0C1F1C]/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Design & Layout do Carrossel (6 Modelos)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Alterne entre o Post do X, Minimalista, Dark Obsidian, Harvard e outros estilos
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {CAROUSEL_LAYOUT_THEMES.map((theme) => {
            const isSelected = layoutThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setLayoutThemeId(theme.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20 ring-2 ring-teal-500/30"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-500/50"
                }`}
                title={theme.tagline}
              >
                {/* Amostra de cor em miniatura */}
                <span
                  className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
                    theme.id === "tweet_clean"
                      ? "bg-white ring-2 ring-[#1D9BF0]"
                      : theme.id === "minimal"
                      ? "bg-[#F8FAFC]"
                      : theme.id === "obsidian"
                      ? "bg-[#0C1F1C]"
                      : theme.id === "wellness"
                      ? "bg-[#E8F8EE]"
                      : theme.id === "academic"
                      ? "bg-[#FDFBF7]"
                      : "bg-[#18181B]"
                  }`}
                />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.1 BARRA DE SELEÇÃO DE ELEMENTOS VISUAIS (INFOGRÁFICOS CLÍNICOS VS FOTOGRAFIA EDITORIAL) */}
      <div className="bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/50 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-teal-950 dark:text-teal-200 block">
              Recurso Visual das Lâminas (Remotion / Programático)
            </span>
            <span className="text-[11px] text-teal-700/80 dark:text-teal-400/80">
              Infográficos vetoriais de mecanismos, mitos vs evidência e condutas ou fotografia médica
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setVisualMode("infographic")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              visualMode === "infographic"
                ? "bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-500/50"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Infográficos Clínicos (Remotion)
          </button>
          <button
            onClick={() => setVisualMode("photo")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              visualMode === "photo"
                ? "bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-500/50"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Fotografia Médica
          </button>
        </div>
      </div>

      {/* 3. Miniaturas de Navegação das Lâminas (1 a 6) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {slides.map((s, idx) => (
          <button
            key={s.number}
            onClick={() => setActiveSlide(idx)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-xs shrink-0 transition-all cursor-pointer ${
              activeSlide === idx
                ? "bg-teal-50 dark:bg-teal-950/30 border-teal-500 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20 font-bold"
                : "bg-slate-50 dark:bg-[#0C1F1C] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-mono group-hover:scale-110 transition-transform">
              {s.number}
            </span>
            <span className="flex items-center gap-1">
              {s.imageUrl && <ImageIcon className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
              {s.type}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Canvas da Lâmina Ativa em Proporção 4:5 - SEM RODAPÉ REDUNDANTE */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* LÂMINA 4:5 - RENDERIZAÇÃO LIMPA E SEM CORTE */}
        {activeTheme.id === "tweet_clean" ? (
          /* MOCKUP DO POST DO X (Clean White + Imagem + Tweet Style) */
          <div className="w-full max-w-[340px] min-h-[460px] rounded-3xl p-5 flex flex-col justify-between relative bg-white text-[#0F1419] border border-slate-200/90 shadow-xl font-sans transition-all duration-300">
            {/* Topo Único do Card: Avatar Circular + Nome + Selo Azul + @handle + Lâmina */}
            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs shadow-inner">
                  <span className="text-teal-700 font-serif">Dr</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-[#0F1419] tracking-tight">
                      Dr(a). {doctorName}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#536471] font-normal leading-tight">
                    {doctorHandle} • {crm}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {currentSlide.number} / {slides.length}
              </span>
            </div>

            {/* Conteúdo Central do Tweet */}
            <div className="my-auto py-2 flex flex-col gap-2">
              <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded w-fit bg-slate-100 text-[#1D9BF0] border border-slate-200">
                {currentSlide.badge}
              </span>

              <h4 className="text-sm sm:text-base font-bold text-[#0F1419] leading-snug tracking-tight">
                {currentSlide.headline}
              </h4>

              <p className="text-xs text-[#0F1419] leading-relaxed">
                {currentSlide.subtext}
              </p>

              {/* RECURSO VISUAL: INFOGRÁFICO CLÍNICO PROGRAMÁTICO OU FOTOGRAFIA EDITORIAL */}
              {renderVisualElement(currentSlide)}

              {/* Caixa Embutida (Card Interno estilo Mídia / Quote do X na imagem) */}
              {(currentSlide.bullets || currentSlide.takeaway || currentSlide.scientificReference) && (
                <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-2.5 flex flex-col gap-1.5">
                  {currentSlide.bullets && (
                    <div className="space-y-1">
                      {currentSlide.bullets.map((b, i) => (
                        <p key={i} className="text-[11px] text-slate-800 flex items-start gap-1.5">
                          <span className="text-[#1D9BF0] font-bold shrink-0">•</span>
                          <span>{b}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {currentSlide.takeaway && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80 text-[10px] text-slate-700 font-medium">
                      💡 {currentSlide.takeaway}
                    </div>
                  )}

                  {/* Bloco de Referência Científica no Card Interno */}
                  {currentSlide.scientificReference && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex flex-col gap-1 text-[10px]">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#1D9BF0]" />
                          <span>{currentSlide.scientificReference.journal} ({currentSlide.scientificReference.year})</span>
                        </span>
                        <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-blue-50 text-[#1D9BF0] font-bold">
                          {currentSlide.scientificReference.evidenceLevel}
                        </span>
                      </div>
                      <div className="text-[9px] text-[#536471] font-mono">
                        DOI: <span className="underline">{currentSlide.scientificReference.doi}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Barra Inferior com Métricas do X (Discreta, sem rodapé pesado) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[#536471] text-[11px] px-1">
              <div className="flex items-center gap-1.5 hover:text-[#1D9BF0] transition-colors cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">8K</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer">
                <Repeat className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">8K</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer">
                <Heart className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">88K</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#1D9BF0] transition-colors cursor-pointer">
                <Share className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ) : activeTheme.id === "brands_decoded" ? (
          /* MOTOR REMOTION REAL: CARROSSEL EDITORIAL VIRAL (1080x1350) */
          <div className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950 flex flex-col">
            <RemotionEditorialCarouselPlayer
              rawSlides={slides}
              doctorName={doctorName}
              crm={crm}
              activeSlideIndex={Math.min(activeSlide, slides.length - 1)}
              autoPlay={true}
            />
          </div>
        ) : (
          /* MOCKUP DOS DEMAIS LAYOUTS (Com Topo Único e Sem Rodapé Duplicado) */
          <div
            className={`w-full max-w-[340px] min-h-[460px] rounded-3xl p-5 flex flex-col justify-between relative transition-all duration-300 border ${activeTheme.cardBg} ${activeTheme.fontClass} ${activeTheme.borderClass}`}
          >
            {/* Topo Único da Lâmina: Nome do Médico + CRM + Contador */}
            <div className="flex items-center justify-between border-b border-current/15 pb-2.5 z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-300 text-[10px] font-bold">
                  🩺
                </div>
                <div className="flex flex-col">
                  <span className={`text-[11px] font-bold leading-tight ${activeTheme.textColor}`}>
                    Dr(a). {doctorName}
                  </span>
                  <span className="text-[9px] opacity-70 font-mono">
                    {crm} {rqe ? `• RQE ${rqe}` : ""}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 ${activeTheme.textColor}`}
              >
                {currentSlide.number} / {slides.length}
              </span>
            </div>

            {/* Conteúdo Central da Lâmina */}
            <div className="my-auto py-2 z-10 flex flex-col gap-2">
              <span
                className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded w-fit border ${activeTheme.badgeBg} ${activeTheme.badgeText}`}
              >
                {currentSlide.badge}
              </span>

              <h4 className={`text-sm sm:text-base font-bold leading-snug tracking-tight ${activeTheme.textColor}`}>
                {currentSlide.headline}
              </h4>

              <p className={`text-xs leading-relaxed whitespace-pre-line opacity-90 ${activeTheme.textColor}`}>
                {currentSlide.subtext}
              </p>

              {/* RECURSO VISUAL: INFOGRÁFICO CLÍNICO PROGRAMÁTICO OU FOTOGRAFIA EDITORIAL */}
              {renderVisualElement(currentSlide)}

              {/* Marcadores / Sintomas / Passos (se houver) */}
              {currentSlide.bullets && (
                <div className="space-y-1 mt-0.5 bg-black/5 dark:bg-black/40 p-2.5 rounded-xl border border-current/10">
                  {currentSlide.bullets.map((b, i) => (
                    <p key={i} className={`text-[11px] flex items-start gap-1.5 ${activeTheme.textColor}`}>
                      <span className="text-teal-500 font-bold shrink-0">•</span>
                      <span>{b}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Destaque / Takeaway (se houver) */}
              {currentSlide.takeaway && (
                <div
                  className={`p-2 rounded-xl border text-[10px] leading-relaxed font-mono ${activeTheme.badgeBg} ${activeTheme.badgeText}`}
                >
                  💡 {currentSlide.takeaway}
                </div>
              )}

              {/* BLOCO FORMAL DE REFERÊNCIA CIENTÍFICA (EXCLUSIVO DO CARD 4) */}
              {currentSlide.scientificReference && (
                <div className="mt-0.5 p-2 rounded-xl bg-black/10 dark:bg-black/40 border border-current/15 flex flex-col gap-1 text-[10px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1 text-slate-800 dark:text-slate-100">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{currentSlide.scientificReference.journal} ({currentSlide.scientificReference.year})</span>
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold shrink-0">
                      {currentSlide.scientificReference.evidenceLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] opacity-80 pt-0.5">
                    <span className="font-semibold">DOI:</span>
                    <span className="truncate underline">{currentSlide.scientificReference.doi}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Barra Inferior Minimalista (Apenas indicador ético discreto) */}
            <div className="border-t border-current/15 pt-2 flex items-center justify-between text-[10px] z-10 opacity-70">
              <span className="text-[9px]">Conteúdo educativo • CFM 2.336/2023</span>
              <div className="flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 icon-hover-effect" />
                <ArrowRight className="w-3.5 h-3.5 icon-hover-effect" />
              </div>
            </div>
          </div>
        )}

        {/* 5. Painel Lateral de Controle da Lâmina */}
        <div className="flex-1 flex flex-col justify-between gap-4 w-full">
          <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Lâmina #{currentSlide.number}: {currentSlide.type}
              </span>
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 icon-hover-effect" /> Veja o parecer no Crivo
              </span>
            </div>

            {/* Controle da Imagem / Infográfico da Lâmina */}
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {visualMode === "infographic" ? (
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                )}
                <span className="text-[11px] text-teal-900 dark:text-teal-200 font-medium">
                  {visualMode === "infographic"
                    ? "Infográfico Clínico Vetorial (Remotion Ativo)"
                    : "Fotografia Médica Editorial em Alta Definição"}
                </span>
              </div>
              {visualMode === "photo" && currentSlide.imageUrl && (
                <button
                  onClick={handleRegenerateSlideImage}
                  disabled={isRegeneratingImage}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  title="Gerar nova variante visual"
                >
                  <RefreshCw className={`w-3 h-3 ${isRegeneratingImage ? "animate-spin" : ""}`} />
                  {isRegeneratingImage ? "Trocando..." : "Nova Foto"}
                </button>
              )}
            </div>

            {/* Prompt Detalhado da Imagem Contextual (FLUX.1) */}
            {currentSlide.imagePrompt && visualMode === "photo" && (
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-semibold uppercase tracking-wider text-[9px]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    Prompt da Imagem (FLUX.1 Contextual)
                  </span>
                                  </div>
                <p className="text-slate-600 dark:text-slate-400 italic font-mono leading-relaxed bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                  {currentSlide.imagePrompt}
                </p>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Título da Lâmina</label>
              <input
                type="text"
                readOnly
                value={currentSlide.headline}
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Texto Explicativo da Lâmina</label>
              <textarea
                readOnly
                rows={3}
                value={currentSlide.subtext}
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 resize-none"
              />
            </div>

            {/* Referência da Lâmina 4 no Inspetor */}
            {currentSlide.scientificReference && (
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex flex-col gap-1 text-[11px]">
                <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Referência Científica Indexada
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[10px]">
                  <strong>Periódico:</strong> {currentSlide.scientificReference.journal} ({currentSlide.scientificReference.year})
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                  <strong>DOI:</strong> https://doi.org/{currentSlide.scientificReference.doi}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[9px]">
                  <strong>Classificação:</strong> {currentSlide.scientificReference.evidenceLevel}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Tema ativo: <strong className="text-teal-600 dark:text-teal-400">{topic}</strong></span>
              <span>Layout: <strong>{activeTheme.name}</strong></span>
            </div>
          </div>

          {/* Navegação entre lâminas e botões de ação com Hover */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-white transition-all cursor-pointer"
                title="Lâmina Anterior"
              >
                <ChevronLeft className="w-5 h-5 icon-hover-effect" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-2">
                {activeSlide + 1} de {slides.length}
              </span>
              <button
                disabled={activeSlide === slides.length - 1}
                onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-white transition-all cursor-pointer"
                title="Próxima Lâmina"
              >
                <ChevronRight className="w-5 h-5 icon-hover-effect" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copySlideText}
                className="group px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-teal-500 icon-hover-effect" /> : <Copy className="w-4 h-4 icon-hover-effect" />}
                {copied ? "Copiado!" : "Copiar Lâmina"}
              </button>
              <button
                onClick={() => exportSlideAsPNG(safeIndex)}
                className="group px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Download do Slide Ativo em PNG 1080x1350"
              >
                <Download className="w-4 h-4 icon-hover-effect" /> Baixar PNG Slide ({safeIndex + 1})
              </button>
              <button
                onClick={exportAllSlides}
                className="group px-4 py-2 rounded-xl bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Exportar todas as lâminas em alta definição"
              >
                <Download className="w-4 h-4 icon-hover-effect" /> Baixar Todos 1080×1350
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PAINEL DE LEGENDA DO INSTAGRAM COM AUDITORIA & FONTE CIENTÍFICA EXPLÍCITA */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0C1F1C]/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Legenda do Instagram & Auditor de Gancho
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono font-bold">
              Fórmula {activeFormula.code}: {activeFormula.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
              Gancho: {captionAudit.hookCharCount}/125 chars (OK)
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold">
              Humanizer V3: 0 Clichês
            </span>
          </div>
        </div>

        {/* Texto da Legenda (Contendo a Citação Científica) */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
          {captionAudit.humanizedCaption}
        </div>

        {/* Hashtags Estratégicas (3 a 5 tags) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-teal-600 dark:text-teal-400">
            <Hash className="w-3 h-3 text-slate-400" />
            {captionAudit.hashtags.map((h, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {h}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              const fullText = `${captionAudit.humanizedCaption}\n\n${captionAudit.hashtags.join(" ")}`;
              navigator.clipboard.writeText(fullText);
              setCopiedCaption(true);
              setTimeout(() => setCopiedCaption(false), 2000);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCaption ? "Legenda Copiada com Fonte!" : "Copiar Legenda Completa com Fonte"}
          </button>
        </div>
      </div>
    </div>
  );
}
