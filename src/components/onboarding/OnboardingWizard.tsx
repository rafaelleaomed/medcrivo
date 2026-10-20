"use client";

/* eslint-disable @next/next/no-img-element -- foto pública do Instagram vinda da prévia */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, BadgeCheck, Check, Loader2, Plus, Smile, Stethoscope, X } from "lucide-react";
import {
  CAREER_STAGE_HINTS,
  CAREER_STAGE_LABELS,
  DEFAULT_BRAND,
  EMPTY_PROFILE,
  councilLabel,
  greetingName,
  requiresCouncilId,
  requiresRqe,
  type DoctorProfile,
} from "@/lib/profile";
import { MEDICAL_SPECIALTIES, getSpecialtyById } from "@/data/medicalSpecialtiesData";
import { PAINS_MAX, PALETTES, PAIN_SUGGESTIONS, STEPS, STEP_STORAGE_KEY, TONE_OPTIONS, validateStep } from "@/lib/onboarding/steps";
import type { InstagramPreview } from "@/app/api/onboarding/instagram/route";
import { cn } from "@/lib/utils";
import { WizardShell } from "./WizardShell";
import { BrandPreview } from "./BrandPreview";

const INPUT =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-teal-600 focus:outline-none dark:focus:border-lima";
const LABEL = "mb-1.5 block text-xs font-semibold text-[var(--text-main)]";

function Option({ selected, onClick, title, hint, icon }: { selected: boolean; onClick: () => void; title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-teal-600",
        selected
          ? "border-teal-600 bg-teal-50 dark:border-lima dark:bg-marfim/5"
          : "border-[var(--border-subtle)] hover:border-teal-600/50 dark:hover:border-lima/50",
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        {hint && <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
          selected ? "border-teal-600 bg-teal-600 text-marfim dark:border-lima dark:bg-lima dark:text-pinho" : "border-[var(--border-subtle)]",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer",
        active
          ? "border-pinho bg-pinho text-marfim dark:border-lima dark:bg-lima dark:text-pinho"
          : "border-[var(--border-subtle)] text-[var(--text-main)] hover:border-teal-600 dark:hover:border-lima",
      )}
    >
      {active && <Check className="h-3 w-3" aria-hidden />}
      {children}
    </button>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);
  // Quem já concluiu e volta para revisar continua concluído durante as etapas.
  const [wasOnboarded, setWasOnboarded] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPain, setCustomPain] = useState("");
  const [ig, setIg] = useState<{ state: "idle" | "loading" | "ok" | "unavailable" | "notfound" | "error"; preview?: InstagramPreview }>({ state: "idle" });

  const update = (patch: Partial<DoctorProfile>) => setProfile((p) => ({ ...p, ...patch }));

  // Carrega o perfil e retoma a etapa salva.
  useEffect(() => {
    let live = true;
    (async () => {
      const res = await fetch("/api/profile").catch(() => null);
      if (!live) return;
      if (res?.status === 401) {
        router.replace("/login");
        return;
      }
      const data = await res?.json().catch(() => null);
      if (data?.profile) {
        setProfile(data.profile);
        setWasOnboarded(Boolean(data.profile.onboarded));
      }
      const saved = Number(window.localStorage.getItem(STEP_STORAGE_KEY));
      if (!data?.profile?.onboarded && Number.isInteger(saved) && saved > 0 && saved < STEPS.length) setStep(saved);
      setLoaded(true);
    })();
    return () => {
      live = false;
    };
  }, [router]);

  const save = async (next: DoctorProfile) => {
    const res = await fetch("/api/onboarding/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json().catch(() => null);
    if (!data?.success) throw new Error(data?.error ?? "Não foi possível salvar.");
    return data.profile as DoctorProfile;
  };

  const goNext = async () => {
    if (done) {
      window.localStorage.removeItem(STEP_STORAGE_KEY);
      router.push("/app");
      return;
    }
    const problem = validateStep(STEPS[step].id, profile);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const last = step === STEPS.length - 1;
      const saved = await save({ ...profile, onboarded: last || wasOnboarded });
      setProfile(saved);
      if (last) {
        setDone(true);
      } else {
        window.localStorage.setItem(STEP_STORAGE_KEY, String(step + 1));
        setStep(step + 1);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    setError(null);
    if (done) {
      setDone(false);
      return;
    }
    const prev = Math.max(0, step - 1);
    window.localStorage.setItem(STEP_STORAGE_KEY, String(prev));
    setStep(prev);
  };

  const checkInstagram = async () => {
    const handle = profile.instagram.trim().replace(/^@/, "");
    if (!handle) return;
    setIg({ state: "loading" });
    try {
      const res = await fetch(`/api/onboarding/instagram?handle=${encodeURIComponent(handle)}`);
      const data = await res.json();
      if (!data.success) setIg({ state: "error" });
      else if (!data.available) setIg({ state: "unavailable" });
      else if (!data.found) setIg({ state: "notfound" });
      else setIg({ state: "ok", preview: data.preview });
    } catch {
      setIg({ state: "error" });
    }
  };

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg-main)]">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-label="Carregando" />
      </div>
    );
  }

  const isDentist = profile.profession === "dentista";
  const council = councilLabel(profile);
  const specialtyNames = MEDICAL_SPECIALTIES.filter((s) => s.id !== "academico_medicina").map((s) => s.name);
  const interestSuggestions = getSpecialtyById(profile.specialty || (profile.careerStage === "estudante" ? "academico_medicina" : "Clínico Geral"))
    .trendingTopics.map((t) => t.title)
    .slice(0, 5);
  const pains = profile.audiencePains;
  // Atualização funcional: cliques rápidos não se sobrescrevem com um estado antigo.
  const togglePain = (pain: string) =>
    setProfile((p) => {
      const cur = p.audiencePains;
      const next = cur.includes(pain) ? cur.filter((x) => x !== pain) : cur.length < PAINS_MAX ? [...cur, pain] : cur;
      return { ...p, audiencePains: next };
    });
  const toggleInterest = (topic: string) =>
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(topic) ? p.interests.filter((i) => i !== topic) : [...p.interests, topic],
    }));

  const stepId = STEPS[step].id;

  return (
    <WizardShell
      steps={STEPS}
      current={step}
      done={done}
      onBack={step > 0 || done ? goBack : undefined}
      onNext={goNext}
      busy={busy}
      error={error}
      nextLabel={done ? "Entrar no estúdio" : step === STEPS.length - 1 ? "Concluir" : "Continuar"}
    >
      {done ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pinho text-lima dark:bg-lima dark:text-pinho">
            <BadgeCheck className="h-8 w-8" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Tudo pronto{greetingName(profile) ? `, ${greetingName(profile)}` : ""}.</h1>
            <p className="text-sm text-[var(--text-muted)]">Seu estúdio já usa este perfil.</p>
          </div>
          <BrandPreview profile={profile} />
        </div>
      ) : stepId === "voce" ? (
        <div className="space-y-6">
          <div role="radiogroup" aria-label="Profissão" className="grid gap-3 sm:grid-cols-2">
            <Option
              selected={!isDentist}
              onClick={() => update({ profession: "medico" })}
              title="Medicina"
              hint="Regras do CFM"
              icon={<Stethoscope className="h-5 w-5 text-teal-700 dark:text-lima" aria-hidden />}
            />
            <Option
              selected={isDentist}
              onClick={() => update({ profession: "dentista", careerStage: profile.careerStage === "estudante" ? "medico" : profile.careerStage })}
              title="Odontologia"
              hint="Regras do CFO"
              icon={<Smile className="h-5 w-5 text-teal-700 dark:text-lima" aria-hidden />}
            />
          </div>

          {!isDentist && (
            <div role="radiogroup" aria-label="Situação profissional" className="grid gap-3">
              {(["estudante", "medico", "especialista"] as const).map((stage) => (
                <Option
                  key={stage}
                  selected={profile.careerStage === stage}
                  onClick={() => update({ careerStage: stage })}
                  title={CAREER_STAGE_LABELS[stage]}
                  hint={CAREER_STAGE_HINTS[stage]}
                />
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ob-name" className={LABEL}>
                Nome
              </label>
              <input id="ob-name" className={INPUT} value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ana Lima" autoComplete="name" />
            </div>
            {requiresCouncilId(profile) && (
              <div>
                <label htmlFor="ob-council" className={LABEL}>
                  {council} com UF
                </label>
                <input id="ob-council" className={INPUT} value={profile.crm} onChange={(e) => update({ crm: e.target.value })} placeholder={`${council}/SP 000000`} />
              </div>
            )}
            {requiresRqe(profile) && !isDentist && (
              <div>
                <label htmlFor="ob-rqe" className={LABEL}>
                  RQE
                </label>
                <input id="ob-rqe" className={INPUT} value={profile.rqe} onChange={(e) => update({ rqe: e.target.value })} placeholder="00000" inputMode="numeric" />
              </div>
            )}
            {(requiresRqe(profile) || isDentist) && (
              <div className="sm:col-span-2">
                <label htmlFor="ob-specialty" className={LABEL}>
                  Especialidade
                </label>
                <input
                  id="ob-specialty"
                  list="ob-specialties"
                  className={INPUT}
                  value={profile.specialty}
                  onChange={(e) => update({ specialty: e.target.value })}
                  placeholder={isDentist ? "Ex.: Ortodontia" : "Escolha ou digite"}
                />
                <datalist id="ob-specialties">
                  {!isDentist && specialtyNames.map((n) => <option key={n} value={n} />)}
                </datalist>
              </div>
            )}
          </div>
        </div>
      ) : stepId === "instagram" ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="ob-ig" className={LABEL}>
              Seu @
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
                <input
                  id="ob-ig"
                  className={cn(INPUT, "pl-10")}
                  value={profile.instagram.replace(/^@/, "")}
                  onChange={(e) => {
                    setIg({ state: "idle" });
                    update({ instagram: e.target.value.trim() ? `@${e.target.value.trim().replace(/^@/, "")}` : "" });
                  }}
                  placeholder="seuperfil"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              <button
                type="button"
                onClick={checkInstagram}
                disabled={!profile.instagram || ig.state === "loading"}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-4 text-sm font-semibold transition-colors hover:border-teal-600 disabled:opacity-40 dark:hover:border-lima cursor-pointer"
              >
                {ig.state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Verificar
              </button>
            </div>
          </div>

          <div aria-live="polite">
            {ig.state === "ok" && ig.preview && (
              <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] p-4">
                {ig.preview.picture ? (
                  <img src={ig.preview.picture} alt="" className="h-14 w-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-pinho text-lima">@</span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{ig.preview.fullName || `@${ig.preview.handle}`}</p>
                  <p className="font-mono text-[11px] text-[var(--text-muted)]">
                    {ig.preview.posts ?? "—"} posts · {ig.preview.followers ?? "—"} seguidores
                  </p>
                  {ig.preview.biography && <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">{ig.preview.biography}</p>}
                </div>
              </div>
            )}
            {ig.state === "notfound" && <p className="text-xs text-rose-700 dark:text-rose-300">Perfil não encontrado. Confira o @.</p>}
            {(ig.state === "unavailable" || ig.state === "error") && (
              <p className="text-xs text-[var(--text-muted)]">Prévia indisponível agora. Pode seguir.</p>
            )}
          </div>

          <div>
            <label htmlFor="ob-booking" className={LABEL}>
              Link de agendamento <span className="font-normal text-[var(--text-muted)]">(opcional)</span>
            </label>
            <input
              id="ob-booking"
              className={INPUT}
              value={profile.bookingLink}
              onChange={(e) => update({ bookingLink: e.target.value })}
              placeholder="https://wa.me/55…"
              inputMode="url"
            />
          </div>
        </div>
      ) : stepId === "publico" ? (
        <div className="space-y-7">
          <div>
            <p className={LABEL}>Tom</p>
            <div role="radiogroup" aria-label="Tom de voz" className="grid gap-3 sm:grid-cols-3">
              {TONE_OPTIONS.map((t) => (
                <Option key={t.id} selected={profile.tone === t.id} onClick={() => update({ tone: t.id })} title={t.label} hint={t.hint} />
              ))}
            </div>
          </div>

          <div>
            <p className={LABEL}>
              Dores do paciente <span className="font-mono font-normal text-[var(--text-muted)]">{pains.length}/{PAINS_MAX}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {[...new Set([...PAIN_SUGGESTIONS[profile.profession], ...pains])].map((pain) => (
                <Chip key={pain} active={pains.includes(pain)} onClick={() => togglePain(pain)}>
                  {pain}
                </Chip>
              ))}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = customPain.trim();
                if (v) setProfile((p) => (p.audiencePains.includes(v) || p.audiencePains.length >= PAINS_MAX ? p : { ...p, audiencePains: [...p.audiencePains, v] }));
                setCustomPain("");
              }}
            >
              <label htmlFor="ob-pain" className="sr-only">
                Outra dor
              </label>
              <input id="ob-pain" className={INPUT} value={customPain} onChange={(e) => setCustomPain(e.target.value)} placeholder="Outra dor" maxLength={200} />
              <button
                type="submit"
                aria-label="Adicionar dor"
                className="grid w-12 shrink-0 place-items-center rounded-xl border border-[var(--border-subtle)] hover:border-teal-600 dark:hover:border-lima cursor-pointer"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>

          {interestSuggestions.length > 0 && (
            <div>
              <p className={LABEL}>Temas que você quer abordar</p>
              <div className="flex flex-wrap gap-2">
                {interestSuggestions.map((topic) => {
                  const active = profile.interests.includes(topic);
                  return (
                    <Chip
                      key={topic}
                      active={active}
                      onClick={() => toggleInterest(topic)}
                    >
                      {topic}
                    </Chip>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid items-center gap-8 md:grid-cols-[1fr_260px]">
          <div className="space-y-6">
            <div role="radiogroup" aria-label="Paletas" className="grid grid-cols-5 gap-2">
              {PALETTES.map((pal) => {
                const selected = profile.brand.primary.toLowerCase() === pal.primary.toLowerCase() && profile.brand.accent.toLowerCase() === pal.accent.toLowerCase();
                return (
                  <button
                    key={pal.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={pal.label}
                    title={pal.label}
                    onClick={() => update({ brand: { ...DEFAULT_BRAND, ...profile.brand, primary: pal.primary, accent: pal.accent } })}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer",
                      selected ? "border-teal-600 dark:border-lima" : "border-transparent",
                    )}
                    style={{ background: pal.primary }}
                  >
                    <span aria-hidden className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full" style={{ background: pal.accent }} />
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  ["primary", "Principal"],
                  ["accent", "Destaque"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] p-3 text-sm font-semibold">
                  <input
                    type="color"
                    value={profile.brand[key]}
                    onChange={(e) => update({ brand: { ...profile.brand, [key]: e.target.value } })}
                    className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                  <span>
                    {label}
                    <span className="block font-mono text-[10px] font-normal uppercase text-[var(--text-muted)]">{profile.brand[key]}</span>
                  </span>
                </label>
              ))}
            </div>
            {pains.length === 0 && profile.interests.length === 0 && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <X className="h-3.5 w-3.5" aria-hidden /> Sem dores ou temas: as pautas ficam genéricas.
              </p>
            )}
          </div>
          <BrandPreview profile={profile} />
        </div>
      )}
    </WizardShell>
  );
}
