"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CarouselSlide } from "@/lib/carouselEngine";

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

// Converte qualquer CarouselSlide comum da IA em dados cinematográficos para o Player
export function mapCarouselSlideToViralData(
  slide: CarouselSlide,
  index: number,
  totalSlides: number,
  doctorName: string,
  crm: string
): ViralSlideData {
  const num = index + 1;
  const isCover = num === 1;
  const isCta = num === totalSlides;
  const isMyth = num === 3 || slide.type.toLowerCase().includes("mito");

  // Divide a headline se for longa para criar destaque visual com amarelo neon
  const words = slide.headline.split(" ");
  let headline = slide.headline;
  let headlineHighlight = "";
  let headlineContinuation = "";

  if (words.length > 5) {
    headline = words.slice(0, Math.floor(words.length / 2)).join(" ");
    headlineHighlight = words.slice(Math.floor(words.length / 2), Math.floor(words.length / 2) + 2).join(" ");
    headlineContinuation = words.slice(Math.floor(words.length / 2) + 2).join(" ");
  }

  const details = slide.bullets?.map((b, bIdx) => ({
    tag: `0${bIdx + 1}`,
    title: b.substring(0, 35) + (b.length > 35 ? "..." : ""),
    text: b,
  }));

  return {
    number: num,
    totalSlides,
    type: isCover ? "cover" : isCta ? "cta" : isMyth ? "myth" : "rule",
    badge: slide.badge || `0${num} // DIRETRIZ CLÍNICA`,
    categoryTag: isCover ? "EVIDÊNCIA & PRÁTICA" : undefined,
    headline,
    headlineHighlight: headlineHighlight || undefined,
    headlineContinuation: headlineContinuation || undefined,
    subtext: slide.subtext,
    details: details && details.length > 0 ? details : undefined,
    highlightBox: slide.takeaway
      ? {
          type: "neon",
          title: "CONCLUSÃO BASEADA EM EVIDÊNCIAS",
          text: slide.takeaway,
        }
      : undefined,
    sourceText: slide.scientificReference
      ? `${slide.scientificReference.journal} (${slide.scientificReference.year}) • DOI: ${slide.scientificReference.doi}`
      : undefined,
    doctorName,
    crm,
    footerNote: `${String(num).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`,
  };
}

export const RemotionEditorialSlide: React.FC<{
  slide: ViralSlideData;
  doctorName?: string;
  crm?: string;
}> = ({ slide, doctorName = "Médico", crm = "CRM" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 140,
      mass: 0.8,
    },
    from: 25,
    to: 0,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
        padding: "70px 65px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        border: "1px solid #1E1E1E",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Topo: Tag de Categoria + Contador de Slide */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #222222",
          paddingBottom: "22px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(255, 230, 0, 0.12)",
            border: "1px solid rgba(255, 230, 0, 0.4)",
            color: "#FFE600",
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "1.5px",
            padding: "6px 16px",
            borderRadius: "6px",
            textTransform: "uppercase",
          }}
        >
          {slide.badge}
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: "900",
            fontFamily: "monospace",
            color: "#888888",
            letterSpacing: "2px",
          }}
        >
          {String(slide.number).padStart(2, "0")} / {String(slide.totalSlides).padStart(2, "0")}
        </div>
      </div>

      {/* Meio: Headline Principal + Destaques + Bullets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          margin: "auto 0",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            fontWeight: "900",
            lineHeight: "1.08",
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
          }}
        >
          <span>{slide.headline} </span>
          {slide.headlineHighlight && (
            <span style={{ color: "#FFE600" }}>{slide.headlineHighlight} </span>
          )}
          {slide.headlineContinuation && (
            <span>{slide.headlineContinuation}</span>
          )}
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "#CCCCCC",
            lineHeight: "1.4",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "400",
          }}
        >
          {slide.subtext}
        </div>

        {/* Bullets ou Detalhes */}
        {slide.details && slide.details.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "10px" }}>
            {slide.details.map((d, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #242424",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#FFE600",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: "20px",
                    color: "#EEEEEE",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: "1.35",
                  }}
                >
                  {d.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Highlight Box se existir */}
        {slide.highlightBox && (
          <div
            style={{
              backgroundColor: "rgba(255, 230, 0, 0.08)",
              borderLeft: "6px solid #FFE600",
              borderTop: "1px solid rgba(255, 230, 0, 0.2)",
              borderRight: "1px solid rgba(255, 230, 0, 0.2)",
              borderBottom: "1px solid rgba(255, 230, 0, 0.2)",
              borderRadius: "10px",
              padding: "18px 22px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: "#FFE600",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              {slide.highlightBox.title}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#E2E8F0",
                fontFamily: "'Inter', sans-serif",
                lineHeight: "1.35",
              }}
            >
              {slide.highlightBox.text}
            </div>
          </div>
        )}
      </div>

      {/* Rodapé: Identificação do Médico + Nota de Rodapé */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #222222",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: "0.5px",
            }}
          >
            Dr(a). {slide.doctorName || doctorName}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#888888",
              fontFamily: "monospace",
            }}
          >
            {slide.crm || crm} • CFM 2.336/2023
          </span>
        </div>

        <div
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#FFE600",
            letterSpacing: "1.5px",
          }}
        >
          {slide.number === 1 ? "ARRASTE PARA O LADO →" : slide.number === slide.totalSlides ? "SALVE ESTE POST ♥" : "CONTINUE LENDO →"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export interface RemotionEditorialCarouselPlayerProps {
  slides?: ViralSlideData[];
  rawSlides?: CarouselSlide[];
  doctorName?: string;
  crm?: string;
  activeSlideIndex?: number;
  autoPlay?: boolean;
}

export function RemotionEditorialCarouselPlayer({
  slides,
  rawSlides,
  doctorName = "Médico",
  crm = "CRM",
  activeSlideIndex = 0,
  autoPlay = true,
}: RemotionEditorialCarouselPlayerProps) {
  // Converte rawSlides da IA se fornecidos, garantindo que o tema ativo seja renderizado com 100% de nexo
  const effectiveSlides: ViralSlideData[] = useMemo(() => {
    if (slides && slides.length > 0) return slides;
    if (rawSlides && rawSlides.length > 0) {
      return rawSlides.map((s, idx) =>
        mapCarouselSlideToViralData(s, idx, rawSlides.length, doctorName, crm)
      );
    }
    return [
      {
        number: 1,
        totalSlides: 6,
        type: "cover",
        badge: "CONSENSO CLÍNICO // EVIDÊNCIA",
        headline: "CARROSSEL EDITORIAL DE ALTO IMPACTO",
        subtext: "Geração contextual baseada em literatura médica indexada.",
      },
    ];
  }, [slides, rawSlides, doctorName, crm]);

  const currentSlide = effectiveSlides[Math.min(activeSlideIndex, effectiveSlides.length - 1)] || effectiveSlides[0];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950">
      <Player
        component={RemotionEditorialSlide}
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

// Manter export compatível sem menções a marcas externas
export const RemotionBrandsCarouselPlayer = RemotionEditorialCarouselPlayer;
