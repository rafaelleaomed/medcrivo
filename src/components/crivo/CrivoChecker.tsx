"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCopy, Info, ShieldAlert } from "lucide-react";
import { HealthcareComplianceEngine, type AuditResult } from "@/lib/compliance";
import { Button, CrivoDisclaimer, Seal } from "@/components/ui";

const SEVERITY = {
  CRITICAL: { label: "Crítico", icon: ShieldAlert, className: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100" },
  WARNING: { label: "Atenção", icon: AlertTriangle, className: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100" },
  INFO: { label: "Informação", icon: Info, className: "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-100" },
} as const;

const EXAMPLE =
  "Esse tratamento é 100% eficaz e resolve de vez o seu problema. Atendi hoje a paciente Maria Silva e o resultado foi incrível. Agende pelo link da bio!";

/**
 * Revisão de texto pelo motor do Crivo, executada no navegador (o texto não é enviado ao servidor).
 * `hideIdentification`: no modo público, a falta de CRM não é tratada como achado (o visitante pode ser estudante).
 */
export function CrivoChecker({ hideIdentification = false, autoFocus = false }: { hideIdentification?: boolean; autoFocus?: boolean }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState(false);

  const findings = useMemo(
    () => (result?.infractions ?? []).filter((f) => !(hideIdentification && f.ruleId === "CFM-000-IDENTIFICACAO")),
    [result, hideIdentification],
  );
  const critical = findings.filter((f) => f.severity === "CRITICAL").length;

  const run = () => {
    if (!text.trim()) return;
    setResult(HealthcareComplianceEngine.audit(text, { profession: "medico" }));
    setCopied(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-white p-5 dark:bg-[#132D29]">
        <label htmlFor="crivo-text" className="text-sm font-bold text-tinta dark:text-marfim">
          Cole a legenda, o roteiro ou o texto do slide
        </label>
        <textarea
          id="crivo-text"
          value={text}
          autoFocus={autoFocus}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Ex.: Você sabia que a pressão alta pode não dar sintomas? Veja 4 sinais para conversar com seu médico…"
          className="mt-2 w-full resize-y rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-main)] p-4 text-sm leading-relaxed text-tinta placeholder:text-[var(--text-muted)] focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:bg-[#0C1F1C] dark:text-marfim"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setText(EXAMPLE);
              setResult(null);
            }}
            className="text-xs font-semibold text-teal-700 hover:underline dark:text-lima cursor-pointer"
          >
            Usar um texto de exemplo (fictício)
          </button>
          <Button onClick={run} disabled={!text.trim()}>
            Revisar no Crivo
          </Button>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          A revisão acontece no seu navegador: o texto não é enviado nem guardado. Não cole dados que identifiquem pacientes.
        </p>
      </div>

      {result && (
        <section aria-live="polite" className="space-y-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border-subtle)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-[#132D29]">
            <div className="flex items-center gap-4">
              <div
                className={`grid h-16 w-16 place-items-center rounded-2xl text-2xl font-black ${
                  critical ? "bg-rose-100 text-rose-800" : findings.length ? "bg-amber-100 text-amber-900" : "bg-lima text-pinho"
                }`}
              >
                {findings.length === 0 ? <CheckCircle2 className="h-8 w-8" aria-label="Sem achados" /> : findings.length}
              </div>
              <div>
                <p className="font-bold text-tinta dark:text-marfim">
                  {findings.length === 0
                    ? "Nenhum ponto encontrado pelo Crivo"
                    : `${findings.length} ponto${findings.length > 1 ? "s" : ""} para revisar${critical ? `, ${critical} crítico${critical > 1 ? "s" : ""}` : ""}`}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {findings.length === 0
                    ? "Ainda vale a leitura humana: o Crivo não pega promessas implícitas, como prazo de resultado."
                    : "Cada ponto mostra o trecho, a norma e uma sugestão. Você decide o que ajustar."}
                </p>
              </div>
            </div>
            {findings.length === 0 && <Seal />}
          </div>

          {findings.length > 0 && (
            <ul className="space-y-3">
              {findings.map((f, i) => {
                const sev = SEVERITY[f.severity];
                return (
                  <li key={`${f.ruleId}-${i}`} className={`rounded-2xl border p-4 ${sev.className}`}>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <sev.icon className="h-4 w-4" aria-hidden />
                      <span>{sev.label}</span>
                      <span className="opacity-60">·</span>
                      <span className="opacity-80">{f.legalReference}</span>
                    </div>
                    <p className="mt-2 text-sm">
                      Trecho: <mark className="rounded bg-white/70 px-1 font-semibold text-inherit dark:bg-black/20">{f.detectedText}</mark>
                    </p>
                    <p className="mt-1 text-sm opacity-90">{f.reason}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Sugestão:</span> {f.suggestion}
                    </p>
                    {f.sourceUrl && (
                      <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold underline">
                        Ver a fonte oficial
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {findings.length > 0 && result.sanitizedText !== text && (
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-white p-5 dark:bg-[#132D29]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-tinta dark:text-marfim">Versão com as sugestões aplicadas</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(result.sanitizedText).then(() => setCopied(true));
                  }}
                >
                  <ClipboardCopy className="h-4 w-4" aria-hidden />
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-tinta dark:text-marfim">{result.sanitizedText}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Releia antes de usar: a troca automática pode deixar a frase sem sentido.</p>
            </div>
          )}

          <CrivoDisclaimer />
        </section>
      )}
    </div>
  );
}
