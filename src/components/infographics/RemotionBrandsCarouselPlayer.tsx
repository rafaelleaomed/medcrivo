"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ViralSlideData {
  number: number;
  totalSlides: number;
  type: "cover" | "myth" | "mechanism" | "rule" | "data" | "action" | "synthesis" | "cta";
  badge: string;
  categoryTag?: string;
  headline: string;
  headlineHighlight?: string;
  headlineContinuation?: string;
  subtext: string;
  details?: Array<{
    tag?: string;
    title: string;
    text: string;
    icon?: string;
  }>;
  highlightBox?: {
    type: "danger" | "warning" | "success" | "neon";
    title: string;
    text: string;
  };
  metrics?: Array<{
    value: string;
    label: string;
    desc: string;
  }>;
  sourceText?: string;
  doctorName?: string;
  crm?: string;
  footerNote?: string;
}

export const MEDICAL_AI_SLIDES: ViralSlideData[] = [
  {
    number: 1,
    totalSlides: 9,
    type: "cover",
    badge: "HEALTH TECH // CLINICAL AI",
    categoryTag: "COMPLIANCE & PRODUCTIVITY",
    headline: "A IA NÃO VAI SUBSTITUIR O MÉDICO.",
    headlineHighlight: "MAS VAI DESTRUIR",
    headlineContinuation: "QUEM DIGITA PRONTUÁRIO NA MÃO.",
    subtext: "62% do tempo de atendimento é queimado com burocracia de tela. A revolução dos LLMs clínicos com escuta ambiental já começou — e é um caminho sem volta.",
    footerNote: "ARRASTE PARA O LADO →",
  },
  {
    number: 2,
    totalSlides: 9,
    type: "myth",
    badge: "01 // O DIAGNÓSTICO DO ERRO",
    headline: "O MITO DO 'COPIAR E COLAR DO CHATGPT'",
    subtext: "Mais de 90% dos profissionais acreditam erroneamente que usar IA na rotina clínica é colar anamneses e exames de pacientes em interfaces comerciais abertas.",
    highlightBox: {
      type: "danger",
      title: "RISCO JURÍDICO & CLÍNICO CRÍTICO",
      text: "Violação direta da LGPD e HIPAA com vazamento de dados sensíveis, risco de alucinações farmacológicas graves e perda integral do valor probatório em sindicâncias e auditorias.",
    },
    footerNote: "02 / 09",
  },
  {
    number: 3,
    totalSlides: 9,
    type: "mechanism",
    badge: "02 // O MECANISMO REAL",
    headline: "COMO OPERA A ESCUTA AMBIENTAL CLÍNICA (ACI)",
    subtext: "A verdadeira inteligência artificial em prontuários não é um chat de texto. É uma camada de inteligência periférica e contínua.",
    details: [
      {
        tag: "FASE 01",
        title: "Captação Contínua em Áudio Natural",
        text: "Microfone direcional capta a conversa fluida entre médico e paciente, sem necessidade de pausas forçadas ou comandos de voz artificiais.",
      },
      {
        tag: "FASE 02",
        title: "Desidentificação On-Premise / Edge",
        text: "Mecanismo criptográfico isola nomes, CPFs e dados sensíveis antes de qualquer transmissão para o cluster de linguagem.",
      },
      {
        tag: "FASE 03",
        title: "Estruturação SOAP Instantânea",
        text: "A fala coloquial é mapeada automaticamente em: Subjetivo, Objetivo, Avaliação e Conduta/Prescrição rastreável.",
      },
    ],
    highlightBox: {
      type: "neon",
      title: "O RESULTADO EM BASTIDOR",
      text: "O médico olha nos olhos do paciente durante toda a consulta enquanto o prontuário nasce estruturado em segundo plano.",
    },
    footerNote: "03 / 09",
  },
  {
    number: 4,
    totalSlides: 9,
    type: "rule",
    badge: "03 // O PILAR INEGOCIÁVEL",
    headline: "HUMAN-IN-THE-LOOP (A IA NUNCA ASSINA)",
    subtext: "Todo registro gerado por algoritmos atua estritamente como rascunho de alta densidade. A chancela ética é intransferível.",
    highlightBox: {
      type: "warning",
      title: "RESPONSABILIDADE É 100% PESSOAL",
      text: "Se a IA sugerir uma posologia inadequada ou omitir um antecedente alérgico e você validar sem conferir, a negligência médica recai integralmente sobre o seu CRM.",
    },
    details: [
      {
        title: "Revisão Visual Obrigatória",
        text: "Adote a janela de 20 segundos de varredura crítica antes de assinar digitalmente via certificado ICP-Brasil.",
      },
      {
        title: "Nenhum Envio Cego",
        text: "Bloqueie integrações diretas que publiquem dados no PEP sem o clique ativo de aprovação do médico titular.",
      },
    ],
    footerNote: "04 / 09",
  },
  {
    number: 5,
    totalSlides: 9,
    type: "rule",
    badge: "04 // O ERRO GRAVE & ALTERNATIVA",
    headline: "ALUCINAÇÃO SILENCIOSA: O PERIGO DO RESUMO EXCESSIVO",
    subtext: "O maior erro em prontuários automatizados não é inventar fatos, mas apagar negativas clínicas indispensáveis para a defesa do médico.",
    details: [
      {
        tag: "❌ O ERRO AMADOR",
        title: "Resumos Genéricos com Perda de Negativas",
        text: "Quando a IA sumariza 'paciente nega dor precordial, dor irradiada e sudorese fria' simplesmente como 'sem queixas torácicas'.",
      },
      {
        tag: "✅ A PRÁTICA CORRETA",
        title: "Grounding Clínico & Ontologias Médicas",
        text: "Exigir motores que preservem cada termo negativo rastreado e façam ancoragem visual com o áudio gravado e tabelas SNOMED/CID.",
      },
    ],
    footerNote: "05 / 09",
  },
  {
    number: 6,
    totalSlides: 9,
    type: "data",
    badge: "05 // EVIDÊNCIA CLÍNICA & DADOS",
    headline: "O RETORNO MENSURÁVEL NA ROTINA CLÍNICA",
    subtext: "A implementação correta de Inteligência Artificial em prontuários já possui validação em larga escala em redes hospitalares mundiais:",
    metrics: [
      {
        value: "-45%",
        label: "TEMPO EM TELA",
        desc: "Redução do 'EHR Pajama Time' (tempo gasto digitando relatórios fora do horário de consultório).",
      },
      {
        value: "+30%",
        label: "ACOLHIMENTO PERCEBIDO",
        desc: "Aumento nos índices de satisfação dos pacientes com a escuta ativa e contato visual pleno.",
      },
      {
        value: "2.4x",
        label: "DENSIDADE DE DEFESA",
        desc: "Prontuários mais detalhados e robustos contra glosas técnicas e questionamentos em auditorias.",
      },
    ],
    sourceText: "FONTE: ESTUDOS AGREGADOS DE AMBIENT CLINICAL INTELLIGENCE EM GRANDES CENTROS MÉDICOS (2024-2025)",
    footerNote: "06 / 09",
  },
  {
    number: 7,
    totalSlides: 9,
    type: "action",
    badge: "06 // PLANO DE IMPLEMENTAÇÃO",
    headline: "4 ETAPAS PARA ADOTAR IA NO SEU CONSULTÓRIO",
    subtext: "Um roteiro seguro para médicos e gestores de saúde que desejam modernizar sua documentação sem correr riscos.",
    details: [
      {
        tag: "PASSO 01",
        title: "Termo de Consentimento Informado",
        text: "Apresente e registre o consentimento do paciente autorizando a captura de áudio para auxílio na transcrição médica.",
      },
      {
        tag: "PASSO 02",
        title: "Validação Rigorosa de Compliance",
        text: "Exija do fornecedor BAA assinado, zero-data-retention nos servidores de treinamento e criptografia AES-256.",
      },
      {
        tag: "PASSO 03",
        title: "Ritual de Checagem Pré-Assinatura",
        text: "Institua 20 segundos de releitura direcionada a prescrições, dosagens e orientações antes de fechar o atendimento.",
      },
      {
        tag: "PASSO 04",
        title: "Amostragem de Auditoria Semanal",
        text: "Revise 3 a 5 prontuários aleatórios por semana para assegurar a precisão vocabular e a integridade dos dados.",
      },
    ],
    footerNote: "07 / 09",
  },
  {
    number: 8,
    totalSlides: 9,
    type: "synthesis",
    badge: "07 // A GRANDE SÍNTESE",
    headline: "A IA NÃO HUMANIZA A MEDICINA SOZINHA. ELA DEVOLVE O TEMPO PARA QUE VOCÊ A HUMANIZE.",
    subtext: "A mesma tecnologia que muitos julgavam impessoal e fria é hoje o único recurso capaz de resgatar o momento sagrado da consulta médica: o olhar atento, o diálogo sem pressa e a relação médico-paciente desobstruída do teclado.",
    highlightBox: {
      type: "neon",
      title: "MUDANÇA DE PARADIGMA",
      text: "Quem adotar a IA clínica liberta horas da sua semana; quem insistir na digitação manual continuará escravo da burocracia do sistema.",
    },
    footerNote: "08 / 09",
  },
  {
    number: 9,
    totalSlides: 9,
    type: "cta",
    badge: "08 // ARQUIVO TÉCNICO PERMANENTE",
    headline: "SALVE ESTE GUIA ANTES DE ESCOLHER O SOFTWARE DA SUA CLÍNICA",
    subtext: "O mercado está inundado de soluções genéricas que podem colocar a sua segurança e o sigilo dos seus pacientes em risco.",
    details: [
      {
        tag: "💾 SALVAR",
        title: "Guarde para Consulta Imediata",
        text: "Tenha este checklist e os 4 passos à mão quando for cotar ou avaliar ferramentas de prontuário com IA.",
      },
      {
        tag: "✈️ COMPARTILHAR",
        title: "Envie para sua Equipe e Colegas",
        text: "Ajude outros médicos a entender a diferença entre ferramentas seguras e o uso irresponsável de IAs abertas.",
      },
    ],
    highlightBox: {
      type: "neon",
      title: "MEDCRIVO // ÉTICA TAMBÉM NO DIGITAL",
      text: "MedCrivo Studio • Conteúdo de saúde com IA, revisado pelo Crivo",
    },
    footerNote: "09 / 09",
  },
];

interface RemotionBrandsSlideProps {
  slide: ViralSlideData;
  doctorName?: string;
  crm?: string;
}

export const RemotionBrandsSlide: React.FC<RemotionBrandsSlideProps> = ({
  slide,
  doctorName = "Lucas Carvalho",
  crm = "CRM/SP 198420",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação de entrada fluida com spring e interpolação
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  const contentTranslate = interpolate(translateY, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0B0E",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        padding: "60px 60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Grid Brutalist de Fundo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Borda técnica externa */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      />

      {/* 1. TOPO DA LÂMINA (Badge, Identificação & Contador) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          paddingBottom: "18px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              backgroundColor: "#FFE600",
              color: "#000000",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: "14px",
              padding: "5px 12px",
              borderRadius: "3px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {slide.badge}
          </div>
          {slide.categoryTag && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#94A3B8",
                letterSpacing: "1px",
              }}
            >
              {"//"} {slide.categoryTag}
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: "18px",
            color: "#FFE600",
            letterSpacing: "1px",
          }}
        >
          {String(slide.number).padStart(2, "0")} / {String(slide.totalSlides).padStart(2, "0")}
        </div>
      </div>

      {/* 2. CORPO CENTRAL DA LÂMINA */}
      <div
        style={{
          opacity,
          transform: `translateY(${contentTranslate}px)`,
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          margin: "auto 0",
        }}
      >
        {/* HEADLINE PRINCIPAL */}
        {slide.type === "cover" ? (
          <div>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "76px",
                lineHeight: "0.95",
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                color: "#FFFFFF",
                margin: "0 0 12px 0",
              }}
            >
              {slide.headline}
            </h1>
            {slide.headlineHighlight && (
              <div
                style={{
                  backgroundColor: "#FFE600",
                  color: "#000000",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "74px",
                  lineHeight: "0.95",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  display: "inline-block",
                  marginBottom: "12px",
                }}
              >
                {slide.headlineHighlight}
              </div>
            )}
            {slide.headlineContinuation && (
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "76px",
                  lineHeight: "0.95",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                {slide.headlineContinuation}
              </h2>
            )}
          </div>
        ) : (
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: slide.type === "synthesis" ? "56px" : "54px",
              lineHeight: "1.05",
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
              color: slide.type === "synthesis" ? "#FFE600" : "#FFFFFF",
              margin: 0,
            }}
          >
            {slide.headline}
          </h2>
        )}

        {/* SUBTEXTO / GAP DE CURIOSIDADE */}
        <p
          style={{
            fontSize: "23px",
            lineHeight: "1.45",
            color: "#CBD5E1",
            fontWeight: 400,
            margin: 0,
            maxWidth: "960px",
          }}
        >
          {slide.subtext}
        </p>

        {/* MÉTRICAS (Slide de Dados) */}
        {slide.metrics && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            {slide.metrics.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#11141B",
                  border: "1px solid #232936",
                  padding: "18px 24px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: "64px",
                    color: "#FFE600",
                    lineHeight: 1,
                    minWidth: "160px",
                  }}
                >
                  {m.value}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      fontSize: "17px",
                      color: "#FFFFFF",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.label}
                  </div>
                  <div style={{ fontSize: "17px", color: "#94A3B8", lineHeight: 1.35 }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARDS DETALHADOS (Mecanismo, Regras e Passos) */}
        {slide.details && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "4px" }}>
            {slide.details.map((d, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#11141B",
                  border: "1px solid #1E2533",
                  padding: "16px 20px",
                  borderRadius: "6px",
                }}
              >
                {d.tag && (
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: "12px",
                      color: d.tag.includes("❌") ? "#EF4444" : d.tag.includes("✅") ? "#10B981" : "#FFE600",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {d.tag}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "26px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {d.title}
                </div>
                <div style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.4 }}>
                  {d.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HIGHLIGHT BOX (Perigo, Alerta ou Destaque Neon) */}
        {slide.highlightBox && (
          <div
            style={{
              backgroundColor:
                slide.highlightBox.type === "danger"
                  ? "#180D10"
                  : slide.highlightBox.type === "warning"
                  ? "#17140B"
                  : "#121419",
              border:
                slide.highlightBox.type === "danger"
                  ? "2px solid #EF4444"
                  : slide.highlightBox.type === "warning"
                  ? "2px solid #F59E0B"
                  : "2px solid #FFE600",
              borderRadius: "6px",
              padding: "18px 24px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                fontSize: "15px",
                color:
                  slide.highlightBox.type === "danger"
                    ? "#EF4444"
                    : slide.highlightBox.type === "warning"
                    ? "#F59E0B"
                    : "#FFE600",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              ⚠ {slide.highlightBox.title}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#F1F5F9",
                lineHeight: "1.4",
                fontWeight: 500,
              }}
            >
              {slide.highlightBox.text}
            </div>
          </div>
        )}

        {/* FONTE CIENTÍFICA (Se houver) */}
        {slide.sourceText && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#64748B",
              letterSpacing: "0.5px",
            }}
          >
            {slide.sourceText}
          </div>
        )}
      </div>

      {/* 3. RODAPÉ TÉCNICO (Assinatura do Médico + CTA do Slide) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#94A3B8" }}>
            Dr(a). <strong style={{ color: "#FFFFFF" }}>{doctorName}</strong> • {crm}
          </span>
        </div>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: "14px",
            color: "#FFE600",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {slide.footerNote || "EDITORIAL // MEDCRIVO"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export interface RemotionBrandsCarouselPlayerProps {
  slides?: ViralSlideData[];
  doctorName?: string;
  crm?: string;
  activeSlideIndex?: number;
  autoPlay?: boolean;
}

export function RemotionBrandsCarouselPlayer({
  slides = MEDICAL_AI_SLIDES,
  doctorName = "Lucas Carvalho",
  crm = "CRM/SP 198420",
  activeSlideIndex = 0,
  autoPlay = true,
}: RemotionBrandsCarouselPlayerProps) {
  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950">
      <Player
        component={RemotionBrandsSlide}
        inputProps={{
          slide: currentSlide,
          doctorName,
          crm,
        }}
        durationInFrames={60}
        compositionWidth={1080}
        compositionHeight={1350}
        fps={30}
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
        }}
        controls={false}
        autoPlay={autoPlay}
        loop
      />
    </div>
  );
}
