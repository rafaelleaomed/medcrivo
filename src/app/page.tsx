"use client";

import React, { useState, useEffect } from "react";
import { FloatingHeader } from "@/components/FloatingHeader";
import { LandingHome } from "@/components/LandingHome";
import { WelcomeBoard, DoctorProfile } from "@/components/WelcomeBoard";
import { HeroProfile } from "@/components/HeroProfile";
import { FeedSimulator } from "@/components/FeedSimulator";
import { CarouselStudio } from "@/components/CarouselStudio";
import { ViralityRadar } from "@/components/ViralityRadar";
import { VturbVideoDirector } from "@/components/VturbVideoDirector";
import { ComplianceInspector } from "@/components/ComplianceInspector";
import { ScientificEvidenceCard } from "@/components/ScientificEvidenceCard";
import { DashboardOverview } from "@/components/DashboardOverview";
import { WordmarkFooter } from "@/components/WordmarkFooter";
import { VideoScript } from "@/lib/vturbVideo";
import { ComplianceAuditResult } from "@/lib/compliance";
import { ScientificEvidence } from "@/lib/consensus";
import { CarouselSlide } from "@/lib/carouselEngine";

import { MEDICAL_SPECIALTIES, getSpecialtyById } from "@/data/medicalSpecialtiesData";

// Helper para calcular pautas dinâmicas baseadas nos interesses e especialidade do médico
function getTrendingTopicsForInterests(interests: string[], specialtyName?: string) {
  const results: { name: string; category: string; score: number }[] = [];

  for (const interest of interests) {
    results.push({
      name: interest,
      category: specialtyName?.split(" ")[0] || "Clínica",
      score: 96,
    });
  }

  // Complementa com as pautas em alta da especialidade selecionada
  const spec = getSpecialtyById(specialtyName || "Clínico Geral");
  for (const t of spec.trendingTopics) {
    if (!results.some((r) => r.name === t.title)) {
      results.push({
        name: t.title,
        category: t.badge.replace(/[^\w\sáéíóúãõâêîôûç]/gi, "").trim() || spec.name.split(" ")[0],
        score: 94,
      });
    }
    if (results.length >= 6) break;
  }

  return results.slice(0, 6);
}

export default function CuidaAIStudioPage() {
  // 1. TEMA PADRÃO: INICIA SEMPRE NO MODO CLARO
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 2. PERFIL DO MÉDICO & WELCOME BOARD
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>({
    name: "Lucas Carvalho",
    specialty: "Cardiologia & Longevidade",
    crm: "CRM/SP 198420",
    rqe: "89412",
    instagram: "@dr.lucascarvalho",
    tiktok: "@drlucas.saude",
    youtube: "youtube.com/@drlucascarvalho",
    bookingLink: "https://wa.me/5511999998888",
    interests: ["Saúde Cardiovascular", "Longevidade Saudável", "Esteatose Hepática & Metabolismo"],
  });

  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);

  // Carrega perfil persistido no localStorage ou abre o Welcome Board na 1ª visita
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("cuidaai_profile");
      const isOnboarded = localStorage.getItem("cuidaai_onboarded");

      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setDoctorProfile(parsed);
        } catch (e) {
          console.error("Erro ao carregar perfil:", e);
        }
      }

      // Se for a primeira vez que o médico entra, abre o Welcome Board automaticamente
      if (!isOnboarded) {
        setIsWelcomeOpen(true);
      }
    }
  }, []);

  // 3. ESTADO DE NAVEGAÇÃO: INICIA NA PÁGINA INICIAL ("home")
  const [activeTab, setActiveTab] = useState<
    "home" | "dashboard" | "feed" | "carousel" | "virality" | "vturb" | "compliance" | "evidence"
  >("home");

  const [topic, setTopic] = useState<string>("Esteatose Hepática e Risco Cardiovascular Silencioso");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [variationSeed, setVariationSeed] = useState<number>(0);

  // Pautas dinâmicas calculadas pelos interesses do médico
  const trendingTopics = getTrendingTopicsForInterests(doctorProfile.interests, doctorProfile.specialty);

  // Estado dos Dados Gerados
  const [viralityScore, setViralityScore] = useState<number>(94);
  const [postTitle, setPostTitle] = useState<string>("A verdade sobre a gordura no fígado que quase ninguém te conta");
  const [postHook, setPostHook] = useState<string>("Se você tem cansaço frequente após as refeições, seu fígado pode estar enviando alertas.");

  const [audit, setAudit] = useState<ComplianceAuditResult>({
    isCompliant: true,
    score: 100,
    issues: [],
    detectedTerms: [],
    suggestions: [
      "Mantenha sempre visível o CRM e RQE em todas as lâminas e vídeos.",
      "A Resolução CFM nº 2.336/2023 autoriza antes/depois exclusivamente com caráter educativo coletivo.",
    ],
    timestamp: "2026-10-15T00:00:00.000Z",
  });

  const [evidence, setEvidence] = useState<ScientificEvidence[]>([
    {
      title: "Non-alcoholic fatty liver disease and subclinical cardiovascular disease: A systematic review and meta-analysis",
      journal: "The Lancet Gastroenterology & Hepatology",
      year: 2024,
      doi: "10.1016/S2468-1253(24)00089-2",
      takeaway: "Pacientes com esteatose hepática grau II apresentam aumento de 64% no risco de eventos coronarianos subclínicos, mesmo com lipídios plasmáticos aparentemente compensados.",
      evidenceLevel: "Meta-análise / Nível 1A",
    },
  ]);

  const [videoScript, setVideoScript] = useState<VideoScript>({
    title: "O detalhe silencioso que muitos ignoram na gordura no fígado",
    hookScore: 96,
    durationEstimate: "58 segundos",
    hook3s: {
      speech: "Se você sente esse peso do lado direito ou cansaço inexplicável, preste atenção nisso.",
      visualAction: "Médico apontando para a câmera com postura de consultório.",
      onScreenText: "NÃO IGNORE ESSE SINAL",
    },
    retentionBody: {
      speech: "No consultório, vejo pessoas achando que gordura no fígado é só excesso de peso estético. A The Lancet acabou de demonstrar que a esteatose hepática subclínica acelera a inflamação arterial coronariana em até 64%. O tratamento real exige precisão diagnóstica individualizada.",
      mechanismExplanation: "Lipoproteínas ricas em triglicerídeos gerando disfunção endotelial progressiva.",
      scientificCitation: "The Lancet Gastroenterology & Hepatology (2024)",
    },
    conversionCta: {
      speech: "Se você fez um ultrassom recente ou quer investigar sua saúde metabólica a fundo, agende sua avaliação pelo link da bio.",
      direction: "Gesto sóbrio indicando o perfil com simpatia e acolhimento.",
    },
    selectedFormulaId: "0",
    teleprompterFormattedText: "Se você sente esse peso do lado direito ou cansaço inexplicável, preste atenção nisso...",
    humanizerPassAudit: true,
  });

  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[] | null>(null);

  // Função disparada ao clicar no botão Gerar Conteúdo (com suporte a temas ou links de notícias)
  const handleGenerate = async () => {
    setIsLoading(true);
    setVariationSeed((prev) => prev + 1);
    try {
      let activeTopic = topic.trim();
      let extractedCitation: any = null;

      // 1. Detecção e Extração Automática de Artigo ou Notícia via Link
      if (activeTopic.startsWith("http://") || activeTopic.startsWith("https://")) {
        try {
          const extractRes = await fetch("/api/extract-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: activeTopic }),
          });
          const extractData = await extractRes.json();
          if (extractData.success && extractData.data) {
            activeTopic = extractData.data.clinicalTopic || extractData.data.title;
            extractedCitation = extractData.data.suggestedCitation;
            setTopic(activeTopic);
          }
        } catch (linkErr) {
          console.warn("Extração de link falhou, usando URL como texto:", linkErr);
        }
      }

      // 2. Dispara a geração de conteúdo clínico completo
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeTopic,
          specialty: doctorProfile.specialty,
          doctorName: doctorProfile.name,
          crm: doctorProfile.crm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.audit) setAudit(data.audit);
        if (extractedCitation) {
          setEvidence([
            {
              title: extractedCitation.takeaway || activeTopic,
              journal: extractedCitation.journal,
              year: extractedCitation.year,
              doi: extractedCitation.doi,
              takeaway: extractedCitation.takeaway,
              evidenceLevel: "Notícia Indexada / Relato Clínico",
            },
            ...(data.evidence || []),
          ]);
        } else if (data.evidence) {
          setEvidence(data.evidence);
        }
        if (data.script) setVideoScript(data.script);
        if (data.viralityScore) setViralityScore(data.viralityScore);
        if (data.script?.title) setPostTitle(data.script.title);
        if (data.script?.hook3s?.speech) setPostHook(data.script.hook3s.speech);
      }

      // 3. Dispara a geração de carrossel de IA contextual
      try {
        const carouselRes = await fetch("/api/generate-carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: activeTopic,
            specialty: doctorProfile.specialty,
            doctorName: doctorProfile.name,
            crm: doctorProfile.crm,
            rqe: doctorProfile.rqe,
            tone: "didatico",
            goal: "saves",
          }),
        });
        const carouselData = await carouselRes.json();
        if (carouselData.success && carouselData.slides) {
          setCarouselSlides(carouselData.slides);
        }
      } catch (carouselErr) {
        console.warn("Falha na geração do carrossel por IA, usando heurística resiliente:", carouselErr);
      }
    } catch (e) {
      console.warn("Usando heurística local inteligente:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans transition-colors duration-300 selection:bg-teal-500/20 selection:text-teal-800 dark:selection:text-teal-300">
      {/* 1. FLOATING HEADER (Dual Desktop macOS Dock + Mobile Responsive Dock) */}
      <FloatingHeader
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        doctorName={doctorProfile.name}
        crm={doctorProfile.crm}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsWelcomeOpen(true)}
      />

      {/* 2. WELCOME BOARD (Modal de Primeira Visita / Edição de Perfil & Interesses) */}
      <WelcomeBoard
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        initialProfile={doctorProfile}
        onSave={(newProfile) => {
          setDoctorProfile(newProfile);
        }}
      />

      {/* 3. HERO DE COMANDO & CRIAÇÃO (Exibido nas abas de criação, fora da Home) */}
      {activeTab !== "home" && (
        <HeroProfile
          doctorName={doctorProfile.name}
          setDoctorName={(n) => setDoctorProfile((p) => ({ ...p, name: n }))}
          specialty={doctorProfile.specialty}
          setSpecialty={(s) => setDoctorProfile((p) => ({ ...p, specialty: s }))}
          crm={doctorProfile.crm}
          setCrm={(c) => setDoctorProfile((p) => ({ ...p, crm: c }))}
          rqe={doctorProfile.rqe}
          setRqe={(r) => setDoctorProfile((p) => ({ ...p, rqe: r }))}
          topic={topic}
          setTopic={setTopic}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          trendingTopics={trendingTopics.map((t) => ({ name: t.name, specialty: t.category, score: t.score }))}
        />
      )}

      {/* 4. CANVAS PRINCIPAL DE CONTEÚDO */}
      <main className="max-w-5xl mx-auto px-4 w-full flex-1 py-4 pb-28 md:pb-8">
        {/* PÁGINA INICIAL (Painel de Funções & Guia de Ícones) */}
        {activeTab === "home" && (
          <LandingHome
            doctorProfile={doctorProfile}
            onOpenProfileSettings={() => setIsWelcomeOpen(true)}
            onNavigateTab={(tabId) => setActiveTab(tabId as any)}
            onSelectTopicAndCreate={(selectedTopic) => {
              setTopic(selectedTopic);
              setActiveTab("carousel");
            }}
            trendingTopics={trendingTopics}
          />
        )}

        {/* VISÃO GERAL DETALHADA */}
        {activeTab === "dashboard" && (
          <DashboardOverview
            doctorName={doctorProfile.name}
            specialty={doctorProfile.specialty}
            crm={doctorProfile.crm}
            rqe={doctorProfile.rqe}
            viralityScore={viralityScore}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectTopic={(selectedTopic) => {
              setTopic(selectedTopic);
              setActiveTab("carousel");
            }}
          />
        )}

        {/* SIMULADOR DE FEED 3X3 */}
        {activeTab === "feed" && (
          <FeedSimulator
            doctorName={doctorProfile.name}
            specialty={doctorProfile.specialty}
            crm={doctorProfile.crm}
            rqe={doctorProfile.rqe}
            currentPostTitle={postTitle}
            currentPostHook={postHook}
            viralityScore={viralityScore}
          />
        )}

        {/* ESTÚDIO DE CARROSSEL 4:5 */}
        {activeTab === "carousel" && (
          <CarouselStudio
            topic={topic}
            specialty={doctorProfile.specialty}
            doctorName={doctorProfile.name}
            crm={doctorProfile.crm}
            rqe={doctorProfile.rqe}
            scientificCitation={evidence[0]?.takeaway}
            doctorInstagram={doctorProfile.instagram}
            variationSeed={variationSeed}
            initialSlides={carouselSlides || undefined}
            onSlidesUpdated={(s) => setCarouselSlides(s)}
          />
        )}

        {/* RADAR DE TENDÊNCIAS */}
        {activeTab === "virality" && (
          <ViralityRadar
            score={viralityScore}
            onSelectHook={(hTitle, hSpeech) => {
              setPostTitle(hTitle);
              setPostHook(hSpeech);
              setActiveTab("feed");
            }}
          />
        )}

        {/* ROTEIRO DE VÍDEO & REELS */}
        {activeTab === "vturb" && (
          <VturbVideoDirector
            script={videoScript}
            doctorName={doctorProfile.name}
            crm={doctorProfile.crm}
          />
        )}

        {/* AUDITOR DE COMPLIANCE CFM */}
        {activeTab === "compliance" && (
          <ComplianceInspector
            audit={audit}
            doctorName={doctorProfile.name}
            crm={doctorProfile.crm}
            rqe={doctorProfile.rqe}
          />
        )}

        {/* EVIDÊNCIAS CONSENSUS CIENTÍFICO */}
        {activeTab === "evidence" && (
          <ScientificEvidenceCard
            evidence={evidence}
            topic={topic}
          />
        )}
      </main>

      {/* 5. WORDMARK FOOTER (Ruixen UI Minimal Style) */}
      <WordmarkFooter />
    </div>
  );
}
