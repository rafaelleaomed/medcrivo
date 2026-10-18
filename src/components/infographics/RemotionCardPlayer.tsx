"use client";

import React from "react";
import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Activity, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface RemotionSlideProps {
  title: string;
  subtext: string;
  badge: string;
  doctorName: string;
  crm: string;
  infographicType?: "mechanism" | "myth" | "risk";
  evidenceText?: string;
}

const RemotionSlideContent: React.FC<RemotionSlideProps> = ({
  title,
  subtext,
  badge,
  doctorName,
  crm,
  infographicType = "mechanism",
  evidenceText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
    },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#0F1419",
      }}
    >
      {/* Topo do Card */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#E0F2FE",
              color: "#0284C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            Dr
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold" }}>Dr(a). {doctorName}</div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>{crm}</div>
          </div>
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            padding: "2px 8px",
            backgroundColor: "#F1F5F9",
            borderRadius: "12px",
            color: "#475569",
          }}
        >
          {badge}
        </div>
      </div>

      {/* Conteúdo Central Animado */}
      <div style={{ opacity, transform: `scale(${scale})`, margin: "auto 0" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 800,
            lineHeight: 1.3,
            color: "#0F172A",
            marginBottom: "8px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#334155",
            lineHeight: 1.4,
            marginBottom: "12px",
          }}
        >
          {subtext}
        </p>

        {/* Infográfico Programático Animado */}
        {infographicType === "mechanism" && (
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#0D9488",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Progressão Fisiopatológica
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <div
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor: "#CCFBF1",
                  border: "1px solid #99F6E4",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: "bold", color: "#0F766E" }}>1. Inicial</div>
                <div style={{ fontSize: "8px", color: "#115E59" }}>Sobrecarga Subclínica</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF3C7",
                  border: "1px solid #FDE68A",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: "bold", color: "#B45309" }}>2. Transição</div>
                <div style={{ fontSize: "8px", color: "#92400E" }}>Inflamação Celular</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor: "#FFE4E6",
                  border: "1px solid #FECDD3",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: "bold", color: "#BE123C" }}>3. Clínico</div>
                <div style={{ fontSize: "8px", color: "#9F1239" }}>Alteração Exame</div>
              </div>
            </div>
          </div>
        )}

        {infographicType === "myth" && (
          <div
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "12px",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#15803D", marginBottom: "4px" }}>
              Evidência Clínica Indexada
            </div>
            <div style={{ fontSize: "11px", color: "#166534", lineHeight: 1.3 }}>
              {evidenceText || "A literatura médica comprova a eficácia da abordagem precoce."}
            </div>
          </div>
        )}
      </div>

      {/* Rodapé Clean */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "9px",
          color: "#94A3B8",
          borderTop: "1px solid #F1F5F9",
          paddingTop: "8px",
        }}
      >
        <span>CFM nº 2.336/2023 • Informativo</span>
        <span style={{ color: "#0D9488", fontWeight: "bold" }}>CuidaAI Studio</span>
      </div>
    </AbsoluteFill>
  );
};

export function RemotionCardPlayer({
  title,
  subtext,
  badge,
  doctorName,
  crm,
  infographicType = "mechanism",
  evidenceText,
}: RemotionSlideProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-white">
      <Player
        component={RemotionSlideContent}
        inputProps={{
          title,
          subtext,
          badge,
          doctorName,
          crm,
          infographicType,
          evidenceText,
        }}
        durationInFrames={60}
        compositionWidth={400}
        compositionHeight={500}
        fps={30}
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
        }}
        controls={false}
        autoPlay
        loop
      />
    </div>
  );
}
