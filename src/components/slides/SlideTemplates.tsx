"use client";

/* eslint-disable @next/next/no-img-element -- imagens geradas externamente, sem otimização do Next */
import React, { useEffect, useRef, useState } from "react";
import type { PostSlide } from "@/lib/content/schema";
import { identificationLine, showsSpecialty, type BrandKit, type DoctorProfile } from "@/lib/profile";

/** Os slides são desenhados em 1080x1350 (4:5 do Instagram) e escalados para o espaço disponível. */
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Cor de texto legível sobre um fundo. */
function onColor(bg: string): string {
  return luminance(bg) > 0.45 ? "#0B0F17" : "#FFFFFF";
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Pinta as palavras de destaque do título com a cor de acento. */
function Highlighted({ text, words, color, italic }: { text: string; words: string[]; color: string; italic?: boolean }) {
  const clean = words.filter(Boolean);
  if (clean.length === 0) return <>{text}</>;
  const re = new RegExp(`(${clean.map(escapeRegExp).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        clean.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} style={{ color, fontStyle: italic ? "italic" : undefined }}>
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

const CONDENSED = "var(--font-barlow-condensed), 'Arial Narrow', sans-serif";
const SANS = "var(--font-plus-jakarta), system-ui, sans-serif";
const SERIF = "var(--font-source-serif), Georgia, serif";

interface SlideProps {
  slide: PostSlide;
  total: number;
  profile: DoctorProfile;
  brand: BrandKit;
}

function TopBar({ profile, color }: { profile: DoctorProfile; color: string }) {
  const handle = profile.instagram ? (profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`) : "";
  return (
    <div style={{ position: "absolute", top: 36, left: 48, right: 48, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 1, textTransform: "uppercase", color, opacity: 0.85 }}>
      <span>{handle}</span>
      <span>{profile.name}</span>
      {/* Especialidade só aparece para quem tem RQE (Res. CFM 2.336/2023). */}
      <span>{showsSpecialty(profile) ? profile.specialty : ""}</span>
    </div>
  );
}

/** Rodapé com identificação obrigatória e numeração. */
function Footer({ profile, n, total, color }: { profile: DoctorProfile; n: number; total: number; color: string }) {
  return (
    <div style={{ position: "absolute", bottom: 34, left: 48, right: 48, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 22, color, opacity: 0.8 }}>
      <span>{identificationLine(profile)}</span>
      <span>
        {n}/{total}
      </span>
    </div>
  );
}

function Avatar({ profile, accent }: { profile: DoctorProfile; accent: string }) {
  const initials = (profile.name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const handle = profile.instagram ? (profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`) : profile.name;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: "#000", border: `3px solid ${accent}`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28 }}>
        {initials}
      </div>
      <span style={{ fontFamily: SANS, fontSize: 36, color: "#fff", fontWeight: 500 }}>{handle}</span>
    </div>
  );
}

/** Foto quando houver; sem foto, fundo gerado com as cores da marca (gradiente + textura de pontos). */
function PhotoBackground({ url, darken, brand }: { url?: string; darken: string; brand: BrandKit }) {
  return (
    <>
      {url ? (
        <img src={url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(120% 80% at 85% 10%, ${brand.accent}55 0%, transparent 55%), linear-gradient(160deg, ${brand.primary} 0%, #050f0d 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.14,
              backgroundImage: `radial-gradient(${brand.accent} 2px, transparent 2.6px)`,
              backgroundSize: "36px 36px",
            }}
          />
        </>
      )}
      <div style={{ position: "absolute", inset: 0, background: url ? darken : "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
    </>
  );
}

function CapaNoticia({ slide, total, profile, brand }: SlideProps) {
  return (
    <>
      <PhotoBackground brand={brand} url={slide.imageUrl} darken="linear-gradient(180deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.85) 62%, #000 100%)" />
      <TopBar profile={profile} color="#fff" />
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 150 }}>
        <Avatar profile={profile} accent={brand.accent} />
        <h2 style={{ fontFamily: CONDENSED, fontWeight: 900, fontSize: 104, lineHeight: 0.95, textTransform: "uppercase", color: "#fff", margin: 0 }}>
          <Highlighted text={slide.headline} words={slide.highlight} color={brand.accent} />
        </h2>
        {slide.body && (
          <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.25, textTransform: "uppercase", color: "#fff", marginTop: 32 }}>{slide.body}</p>
        )}
      </div>
      <Footer profile={profile} n={slide.number} total={total} color="#fff" />
    </>
  );
}

function Conteudo({ slide, total, profile, brand }: SlideProps) {
  const fg = onColor(brand.background);
  return (
    <div style={{ position: "absolute", inset: 0, background: brand.background }}>
      <TopBar profile={profile} color={fg} />
      <div style={{ position: "absolute", top: 110, left: 56, right: 56, bottom: 110, display: "flex", flexDirection: "column", gap: 28 }}>
        {slide.kicker && <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: brand.primary === brand.background ? fg : brand.primary }}>{slide.kicker}</span>}
        <h2 style={{ fontFamily: CONDENSED, fontWeight: 900, fontSize: 88, lineHeight: 0.95, textTransform: "uppercase", color: fg, margin: 0 }}>
          <Highlighted text={slide.headline} words={slide.highlight} color={brand.primary} />
        </h2>
        {slide.imageUrl && (
          <div style={{ flex: 1, minHeight: 0, borderRadius: 16, overflow: "hidden", background: "#0002" }}>
            <img src={slide.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        {slide.body && <p style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: fg, margin: 0 }}>{slide.body}</p>}
      </div>
      <Footer profile={profile} n={slide.number} total={total} color={fg} />
    </div>
  );
}

function Passo({ slide, total, profile, brand }: SlideProps) {
  const fg = onColor(brand.background);
  return (
    <div style={{ position: "absolute", inset: 0, background: brand.background }}>
      <TopBar profile={profile} color={fg} />
      <div style={{ position: "absolute", top: 200, left: 56, right: 56 }}>
        <span style={{ display: "inline-block", fontFamily: CONDENSED, fontWeight: 900, fontSize: 64, textTransform: "uppercase", background: brand.accent, color: onColor(brand.accent), padding: "4px 20px", borderRadius: 8 }}>
          {slide.kicker || `Passo ${slide.number - 1}`}
        </span>
        <h2 style={{ fontFamily: CONDENSED, fontWeight: 900, fontSize: 104, lineHeight: 0.95, textTransform: "uppercase", color: fg, margin: "40px 0 0" }}>
          <Highlighted text={slide.headline} words={slide.highlight} color={brand.primary} />
        </h2>
        {slide.body && <p style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: fg, marginTop: 40 }}>{slide.body}</p>}
      </div>
      <Footer profile={profile} n={slide.number} total={total} color={fg} />
    </div>
  );
}

function Frase({ slide, total, profile, brand }: SlideProps) {
  const fg = onColor(brand.primary);
  const handle = profile.instagram ? (profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`) : profile.name;
  return (
    <div style={{ position: "absolute", inset: 0, background: brand.primary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 110, textAlign: "center" }}>
      <p style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.18, color: fg, margin: 0 }}>
        <Highlighted text={slide.headline} words={slide.highlight} color={brand.accent} italic />
      </p>
      {slide.body && <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: fg, opacity: 0.85, marginTop: 40 }}>{slide.body}</p>}
      <span style={{ position: "absolute", bottom: 110, fontFamily: SERIF, fontSize: 30, letterSpacing: 8, color: brand.accent }}>{handle}</span>
      <Footer profile={profile} n={slide.number} total={total} color={fg} />
    </div>
  );
}

function Lista({ slide, total, profile, brand }: SlideProps) {
  const fg = onColor(brand.primary);
  return (
    <div style={{ position: "absolute", inset: 0, background: brand.primary }}>
      <TopBar profile={profile} color={fg} />
      <div style={{ position: "absolute", top: 120, left: 64, right: 64 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 220, lineHeight: 1, color: brand.accent }}>{slide.items.length}</div>
        <h2 style={{ fontFamily: SANS, fontWeight: 900, fontSize: 72, lineHeight: 1.02, letterSpacing: -1, color: fg, margin: "8px 0 40px" }}>
          <Highlighted text={slide.headline} words={slide.highlight} color={brand.accent} />
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          {slide.items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 20, fontFamily: SANS, fontSize: 38, lineHeight: 1.25, color: fg }}>
              <span style={{ color: brand.accent, fontWeight: 900, minWidth: 48 }}>{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <Footer profile={profile} n={slide.number} total={total} color={fg} />
    </div>
  );
}

function Cta({ slide, total, profile, brand }: SlideProps) {
  return (
    <>
      <PhotoBackground brand={brand} url={slide.imageUrl} darken="linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.88) 70%)" />
      <TopBar profile={profile} color="#fff" />
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 170 }}>
        <Avatar profile={profile} accent={brand.accent} />
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.08, letterSpacing: -1.5, color: "#fff", margin: 0 }}>
          <Highlighted text={slide.headline} words={slide.highlight} color={brand.accent} />
        </h2>
        {slide.body && <p style={{ fontFamily: SANS, fontSize: 36, color: "#fff", opacity: 0.9, marginTop: 28 }}>{slide.body}</p>}
      </div>
      <Footer profile={profile} n={slide.number} total={total} color="#fff" />
    </>
  );
}

const RENDERERS: Record<PostSlide["template"], (p: SlideProps) => React.JSX.Element> = {
  capa_noticia: CapaNoticia,
  conteudo: Conteudo,
  passo: Passo,
  frase: Frase,
  lista: Lista,
  cta: Cta,
};

/** Slide em resolução real (1080x1350), escalado para a largura do contêiner. */
export function SlideCanvas({ slide, total, profile, className }: { slide: PostSlide; total: number; profile: DoctorProfile; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SLIDE_W));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Renderer = RENDERERS[slide.template] ?? Conteudo;
  return (
    <div ref={ref} className={className} style={{ position: "relative", width: "100%", aspectRatio: `${SLIDE_W} / ${SLIDE_H}`, overflow: "hidden" }}>
      {scale > 0 && (
        <div
          role="img"
          aria-label={`Slide ${slide.number}: ${slide.headline}`}
          style={{ position: "absolute", top: 0, left: 0, width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, transformOrigin: "top left", overflow: "hidden", background: "#000" }}
        >
          <Renderer slide={slide} total={total} profile={profile} brand={profile.brand} />
        </div>
      )}
    </div>
  );
}
