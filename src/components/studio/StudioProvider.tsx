"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DoctorProfile } from "@/lib/profile";
import { EMPTY_PROFILE } from "@/lib/profile";
import type { PostDraft } from "@/lib/content/schema";
import type { ComplianceAuditResult } from "@/lib/compliance";
import type { ScientificEvidence } from "@/lib/consensus";
import type { VideoScript } from "@/lib/vturbVideo";
import type { CarouselSlide } from "@/lib/carouselEngine";
import type { JobProgress } from "@/components/PostStudio";
import { getSpecialtyById } from "@/data/medicalSpecialtiesData";
import { STUDIO_ROUTES } from "./routes";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const TEMPLATE_LABELS: Record<string, string> = {
  capa_noticia: "Capa / Gancho",
  conteudo: "Conteúdo",
  passo: "Passo a passo",
  frase: "Reflexão",
  lista: "Checklist",
  cta: "Conclusão & CTA",
};

/** Converte o rascunho novo para o formato dos layouts clássicos do CarouselStudio. */
function toLegacySlides(draft: PostDraft): CarouselSlide[] {
  return draft.slides.map((s) => ({
    number: s.number,
    type: TEMPLATE_LABELS[s.template] ?? s.template,
    badge: s.kicker,
    headline: s.headline,
    subtext: s.body,
    bullets: s.items.length ? s.items : undefined,
    imageUrl: s.imageUrl,
    imagePrompt: s.imagePrompt || undefined,
  }));
}

export type SuggestedTopic = { name: string; category: string };

/** Pautas sugeridas a partir dos interesses do perfil e dos temas da especialidade (sem nota de "viralidade"). */
function suggestTopics(interests: string[], specialtyName?: string): SuggestedTopic[] {
  const spec = getSpecialtyById(specialtyName || "Clínico Geral");
  const category = specialtyName?.split(" ")[0] || spec.name.split(" ")[0];
  const results: SuggestedTopic[] = interests.map((name) => ({ name, category }));
  for (const t of spec.trendingTopics) {
    if (results.length >= 6) break;
    if (!results.some((r) => r.name === t.title)) results.push({ name: t.title, category: spec.name.split(" ")[0] });
  }
  return results.slice(0, 6);
}

type StudioContextValue = {
  profile: DoctorProfile;
  setProfile: React.Dispatch<React.SetStateAction<DoctorProfile>>;
  saveProfile: (profile: DoctorProfile) => Promise<void>;
  storeMode: "supabase" | "local" | null;
  isProfileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  topic: string;
  setTopic: (topic: string) => void;
  suggestedTopics: SuggestedTopic[];
  isLoading: boolean;
  variationSeed: number;
  postDraft: PostDraft | null;
  postTitle: string;
  postHook: string;
  audit: ComplianceAuditResult | null;
  evidence: ScientificEvidence[];
  videoScript: VideoScript | null;
  carouselSlides: CarouselSlide[] | null;
  setCarouselSlides: (slides: CarouselSlide[]) => void;
  jobProgress: JobProgress | null;
  generate: () => Promise<void>;
  startFromTopic: (topic: string) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio precisa estar dentro de <StudioProvider>.");
  return ctx;
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Tema: claro por padrão.
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  // Perfil vem do servidor (Supabase ou armazenamento local de desenvolvimento).
  const [profile, setProfile] = useState<DoctorProfile>(EMPTY_PROFILE);
  const [storeMode, setStoreMode] = useState<"supabase" | "local" | null>(null);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setStoreMode(data.mode ?? null);
        if (data.profile) setProfile(data.profile);
        // Primeiro acesso: wizard de onboarding em tela cheia.
        if (!data.profile?.onboarded) router.replace("/onboarding");
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const saveProfile = useCallback(async (next: DoctorProfile) => {
    setProfile(next);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json().catch(() => null);
    if (data?.success && data.profile) setProfile(data.profile);
    else console.warn("Perfil não foi salvo:", data?.error ?? res.status);
  }, []);

  // Conteúdo gerado: começa vazio. Nada de estudo, número ou DOI de exemplo.
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [variationSeed, setVariationSeed] = useState(0);
  const [postDraft, setPostDraft] = useState<PostDraft | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postHook, setPostHook] = useState("");
  const [audit, setAudit] = useState<ComplianceAuditResult | null>(null);
  const [evidence, setEvidence] = useState<ScientificEvidence[]>([]);
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[] | null>(null);
  const [jobProgress, setJobProgress] = useState<JobProgress | null>(null);

  /** Cria o job de carrossel e acompanha até concluir. */
  const runCarouselJob = useCallback(
    async (activeTopic: string, sourceContext?: string) => {
      setJobProgress({ status: "queued", progress: 0, step: "Enviando pedido", error: null });
      const res = await fetch("/api/jobs/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeTopic, sourceContext, tone: profile.tone }),
      });
      const created = await res.json().catch(() => null);
      if (!res.ok || !created?.jobId) {
        setJobProgress({ status: "failed", progress: 0, step: "Falhou", error: created?.error ?? `HTTP ${res.status}` });
        return;
      }

      const startedAt = Date.now();
      while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        const poll = await fetch(`/api/jobs/${created.jobId}`).then((r) => r.json()).catch(() => null);
        if (!poll?.success) continue;
        setJobProgress(poll.job);
        if (poll.job.status === "failed") return;
        if (poll.job.status === "done" && poll.post) {
          const draft: PostDraft = poll.post.draft;
          setPostDraft(draft);
          setCarouselSlides(toLegacySlides(draft));
          setAudit({
            isCompliant: draft.audit.isApproved,
            score: draft.audit.score,
            issues: draft.audit.infractions.map((i) => i.reason),
            detectedTerms: draft.audit.infractions.map((i) => i.detectedText),
            suggestions: draft.audit.infractions.map((i) => i.suggestion),
            infractions: draft.audit.infractions,
            sanitizedText: draft.audit.sanitizedText,
            timestamp: new Date().toISOString(),
          });
          setEvidence(
            draft.evidence.map((p) => ({
              title: p.title,
              journal: p.journal,
              year: p.year,
              doi: p.doi,
              takeaway: p.takeaway,
              evidenceLevel: p.studyType,
              authors: p.authors,
              url: p.url,
              citationAbnt: p.citationAbnt,
            })),
          );
          setPostTitle(draft.slides[0]?.headline ?? draft.topic);
          setPostHook(draft.slides[0]?.body ?? "");
          setJobProgress(null);
          return;
        }
      }
      setJobProgress({ status: "failed", progress: 0, step: "Falhou", error: "Tempo esgotado aguardando a geração." });
    },
    [profile.tone],
  );

  /** Gera carrossel e roteiro a partir do tema (ou de um link de notícia/artigo). */
  const generate = useCallback(async () => {
    let activeTopic = topic.trim();
    if (!activeTopic) return;
    setIsLoading(true);
    setVariationSeed((s) => s + 1);
    router.push(STUDIO_ROUTES.carousel);
    try {
      let sourceContext: string | undefined;
      if (activeTopic.startsWith("http://") || activeTopic.startsWith("https://")) {
        try {
          const extractRes = await fetch("/api/extract-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: activeTopic }),
          });
          const extractData = await extractRes.json();
          if (extractData.success && extractData.data) {
            const d = extractData.data;
            sourceContext = [d.title, d.description, `Fonte: ${d.url}`].filter(Boolean).join("\n");
            activeTopic = d.clinicalTopic || d.title;
            setTopic(activeTopic);
          }
        } catch (linkErr) {
          console.warn("Extração de link falhou, usando URL como texto:", linkErr);
        }
      }

      // Roteiro de vídeo em paralelo (não bloqueia o carrossel).
      const scriptPromise = fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeTopic,
          specialty: profile.specialty,
          doctorName: profile.name,
          crm: profile.crm,
          profession: profile.profession,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.script) setVideoScript(data.script);
        })
        .catch((e) => console.warn("Roteiro de vídeo indisponível:", e));

      await runCarouselJob(activeTopic, sourceContext);
      await scriptPromise;
    } finally {
      setIsLoading(false);
    }
  }, [topic, profile, router, runCarouselJob]);

  const startFromTopic = useCallback(
    (next: string) => {
      setTopic(next);
      router.push(STUDIO_ROUTES.carousel);
    },
    [router],
  );

  const value: StudioContextValue = {
    profile,
    setProfile,
    saveProfile,
    storeMode,
    isProfileOpen,
    setProfileOpen,
    theme,
    toggleTheme,
    topic,
    setTopic,
    suggestedTopics: suggestTopics(profile.interests, profile.specialty),
    isLoading,
    variationSeed,
    postDraft,
    postTitle,
    postHook,
    audit,
    evidence,
    videoScript,
    carouselSlides,
    setCarouselSlides,
    jobProgress,
    generate,
    startFromTopic,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
