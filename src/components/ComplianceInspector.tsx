"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Lock,
  Check,
  AlertCircle,
  HelpCircle,
  FileDown,
  Sparkles,
} from "lucide-react";
import {
  ComplianceAuditResult,
  HealthcareComplianceEngine,
} from "@/lib/compliance";

interface ComplianceInspectorProps {
  audit: ComplianceAuditResult;
  doctorName: string;
  crm: string;
  rqe: string;
  profession: "medico" | "dentista";
}

export function ComplianceInspector({
  audit,
  doctorName,
  crm,
  rqe,
  profession,
}: ComplianceInspectorProps) {
  // Aba ativa do Auditor
  const [subTab, setSubTab] = useState<"normas" | "casos_exames">("casos_exames");

  // O checklist reflete os achados reais do Crivo neste post (nada de status fixo).
  const hasFinding = (...prefixes: string[]) =>
    (audit.infractions ?? []).some((item) => prefixes.some((prefix) => item.ruleId.startsWith(prefix)));
  const checkStatus = (ok: boolean, okLabel: string, badLabel: string) =>
    ok ? (
      <span className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" /> {okLabel}
      </span>
    ) : (
      <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
        <AlertTriangle className="w-3.5 h-3.5" /> {badLabel}
      </span>
    );

  // Estado do Simulador de Casos Clínicos & Exames (Passo 2)
  const [caseNarrative, setCaseNarrative] = useState<string>(() =>
    profession === "dentista"
      ? "Antes e depois do tratamento realizado por mim. Selfie com a paciente após a consulta."
      : "Atendi hoje no consultório um paciente de 52 anos com dor torácica atípica. Vejam a foto da tela da tomografia dele mostrando calcificação na artéria coronária...",
  );
  const [hasExamImage, setHasExamImage] = useState<boolean>(true);
  const [examType, setExamType] = useState<"TC" | "RM" | "RAIO_X" | "ULTRASSOM" | "FOTO_CLINICA">("TC");
  const [hasDICOMMetadata, setHasDICOMMetadata] = useState<boolean>(true);
  const [hasPatientWrittenConsent, setHasPatientWrittenConsent] = useState<boolean>(false);
  const [isEducationalFocus, setIsEducationalFocus] = useState<boolean>(true);
  const [copiedTcle, setCopiedTcle] = useState<boolean>(false);
  const [copiedSanitized, setCopiedSanitized] = useState<boolean>(false);

  // Executa a validação em tempo real
  const caseEvaluation = HealthcareComplianceEngine.checkClinicalCasePublication({
    caseNarrative,
    hasExamImage,
    examType,
    hasDICOMMetadata,
    hasPatientWrittenConsent,
    isEducationalFocus,
  });
  const dentalAudit = HealthcareComplianceEngine.audit(caseNarrative, {
    profession: "dentista",
    doctorName,
    crm,
  });

  const handleCopyTcle = () => {
    navigator.clipboard.writeText(caseEvaluation.tcleTemplate);
    setCopiedTcle(true);
    setTimeout(() => setCopiedTcle(false), 2000);
  };

  const handleCopySanitized = () => {
    navigator.clipboard.writeText(caseEvaluation.sanitizedNarrative);
    setCopiedSanitized(true);
    setTimeout(() => setCopiedSanitized(false), 2000);
  };

  const loadRiskyExample = () => {
    setCaseNarrative("Atendi hoje no plantão um paciente de 48 anos com dor aguda. Vejam a foto da tela da tomografia dele com esteatose severa. Agende sua consulta no link da bio!");
    setHasExamImage(true);
    setExamType("TC");
    setHasDICOMMetadata(true);
    setHasPatientWrittenConsent(false);
    setIsEducationalFocus(false);
  };

  const loadSafeExample = () => {
    setCaseNarrative("Em casos clínicos de esteatose hepática observados na prática médica, a tomografia computadorizada é um método auxiliar relevante para estratificação de risco cardiovascular silencioso.");
    setHasExamImage(true);
    setExamType("TC");
    setHasDICOMMetadata(false);
    setHasPatientWrittenConsent(true);
    setIsEducationalFocus(true);
  };

  if (profession === "dentista") {
    return (
      <div className="bg-white/95 dark:bg-[#132D29]/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-5">
        <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Crivo de conteúdo odontológico</h3>
            <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300">
              CFO 196/2019
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Triagem textual preventiva. Não examina a mídia, não substitui análise profissional e não assegura conformidade jurídica.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-500/30 bg-teal-50/70 p-4 text-xs dark:bg-teal-950/20">
          <p className="font-bold text-teal-900 dark:text-teal-300">Escopo coberto pela fonte oficial</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
            <li>imagens durante o procedimento;</li>
            <li>divulgação condicionada de diagnóstico e resultado final;</li>
            <li>selfie com paciente e autorização escrita;</li>
            <li>nome do profissional e CRO nas imagens reguladas.</li>
          </ul>
          <a
            href="https://website.cfo.org.br/resolucao-cfo-196-2019/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-semibold text-teal-700 underline dark:text-teal-300"
          >
            Fonte oficial: esclarecimentos do CFO sobre a Resolução 196/2019
          </a>
        </div>

        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Texto a revisar
          <textarea
            value={caseNarrative}
            onChange={(event) => setCaseNarrative(event.target.value)}
            className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-normal normal-case tracking-normal text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>

        {dentalAudit.infractions.length === 0 ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
            Nenhum gatilho textual coberto por estas regras foi encontrado. Isso não valida imagens nem outros requisitos do caso concreto.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {dentalAudit.infractions.map((infraction, index) => (
              <li key={infraction.ruleId + "-" + index} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <p><strong>{infraction.severity === "CRITICAL" ? "Bloqueio automático" : "Revisão necessária"}:</strong> {infraction.reason}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {infraction.legalReference}
                  {infraction.sourceUrl && <> · <a href={infraction.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline">Fonte oficial</a></>}
                  {" · Orientação: "}{infraction.suggestion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-[#132D29]/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-md shadow-teal-500/10">
            <ShieldCheck className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Parecer do Crivo · normas do CFM e LGPD
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-mono font-bold">
                CFM 2.336/2023 & 2.380/2024
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Triagem de publicações pelas normas do CFM e pela LGPD, com atenção a exames e relatos de caso. Não é parecer jurídico.
            </p>
          </div>
        </div>

        {/* Sub-Tabs de Navegação */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSubTab("casos_exames")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              subTab === "casos_exames"
                ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Casos Clínicos & Imagens (TC/RM)
          </button>
          <button
            onClick={() => setSubTab("normas")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              subTab === "normas"
                ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Checklist Geral do CFM
          </button>
        </div>
      </div>

      {/* ABA 1: SIMULADOR DE CASOS CLÍNICOS & IMAGENS DE EXAMES (PASSO 2) */}
      {subTab === "casos_exames" && (
        <div className="flex flex-col gap-6">
          {/* Card informativo sobre exames e relatos de caso */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-300">
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Pode postar imagens de TC, RM ou relatos de “Atendi hoje”? O que diz a Lei e o CFM:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>1. Relato “Atendi hoje”:</strong> É expressamente <strong className="text-rose-600 dark:text-rose-400">VEDADO</strong> no formato circunstanciado em tempo real. O cruzamento de data, bairro e hospital gera risco iminente de reidentificação indireta (infringindo o Art. 75 do Código de Ética Médica e a LGPD). A narrativa deve ser sempre atemporal e didática.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>2. Imagens de Exames (Tomografia, Ressonância, Raio-X):</strong> São <strong className="text-teal-700 dark:text-teal-300">PERMITIDAS</strong> se forem 100% didáticas, sem autopromoção, com metadados DICOM eliminados (crop das bordas) e sem marcas corporais singulares identificáveis.
            </p>
          </div>

          {/* Simulador Interativo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna da Esquerda: Entrada e Parâmetros */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Narrativa ou Ideia de Post
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={loadRiskyExample}
                    className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Testar Exemplo Arriscado
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    onClick={loadSafeExample}
                    className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Testar Exemplo Seguro
                  </button>
                </div>
              </div>

              <textarea
                value={caseNarrative}
                onChange={(e) => setCaseNarrative(e.target.value)}
                rows={3}
                placeholder="Ex: Atendi hoje um paciente com a condição X..."
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0B0F17] p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none font-sans leading-relaxed"
              />

              {/* Toggles Regulatórios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Imagem do Exame */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Inclui Imagem Diagnóstica?</span>
                    <input
                      type="checkbox"
                      checked={hasExamImage}
                      onChange={(e) => setHasExamImage(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                  </div>
                  {hasExamImage && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500">Tipo:</span>
                      {(["TC", "RM", "RAIO_X", "ULTRASSOM", "FOTO_CLINICA"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setExamType(t)}
                          className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                            examType === t
                              ? "bg-teal-600 text-white font-bold"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metadados DICOM */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="pr-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">Metadados DICOM</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Nome, data, hospital no exame?</span>
                  </div>
                  <button
                    onClick={() => setHasDICOMMetadata(!hasDICOMMetadata)}
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded cursor-pointer ${
                      hasDICOMMetadata
                        ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                        : "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-500/30"
                    }`}
                  >
                    {hasDICOMMetadata ? "EXPOSTO" : "PURGADO"}
                  </button>
                </div>

                {/* Termo de Consentimento TCLE */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="pr-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">TCLE Assinado</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Autorização escrita do paciente?</span>
                  </div>
                  <button
                    onClick={() => setHasPatientWrittenConsent(!hasPatientWrittenConsent)}
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded cursor-pointer ${
                      hasPatientWrittenConsent
                        ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-500/30"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {hasPatientWrittenConsent ? "SIM (ARQUIVADO)" : "NÃO"}
                  </button>
                </div>

                {/* Finalidade Educativa */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="pr-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">Foco Estritamente Educativo</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Sem apelo de venda ou autopromoção?</span>
                  </div>
                  <button
                    onClick={() => setIsEducationalFocus(!isEducationalFocus)}
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded cursor-pointer ${
                      isEducationalFocus
                        ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-500/30"
                        : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {isEducationalFocus ? "EDUCATIVO" : "COMERCIAL"}
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Parecer de Conformidade em Tempo Real */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Veredito do Auditor
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      caseEvaluation.canPublish
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {caseEvaluation.canPublish ? "SEM BLOQUEIO NA TRIAGEM" : "REVISE ANTES DE PUBLICAR"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {caseEvaluation.riskSummary}
                </p>

                {/* Checklist de Itens */}
                <div className="space-y-2 pt-1">
                  {caseEvaluation.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5"
                    >
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                          {item.item}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {item.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações de Correção */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={handleCopySanitized}
                  className="w-full py-2 px-3 rounded-xl bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedSanitized ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {copiedSanitized ? "Copiado!" : "Copiar Versão Higienizada com IA"}
                </button>

                <button
                  onClick={handleCopyTcle}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedTcle ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <FileDown className="w-3.5 h-3.5" />}
                  {copiedTcle ? "TCLE Copiado para a Área de Transferência!" : "Copiar Modelo de TCLE para Prontuário"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CHECKLIST GERAL DAS RESOLUÇÕES DO CFM (2.336/2023 & 2.380/2024) */}
      {subTab === "normas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bloco 1: Checklist das Resoluções do CFM */}
          <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors duration-300">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 icon-hover-effect" />
              Checklist Normativo Obrigatório (CFM 2.336/2023)
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Identificação (Nome + Palavra MÉDICO + CRM/UF)</span>
                {checkStatus(!hasFinding("CFM-000", "CFO-000"), "Sem achado", "Conferir rodapé")}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">
                  Especialidade anunciada só com RQE
                </span>
                {checkStatus(!hasFinding("CFM-003"), rqe ? `RQE ${rqe}` : "Sem RQE: não anuncie especialidade", "Revisar menção a especialidade")}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Vedação a Garantia de Resultados e Cura</span>
                {checkStatus(!hasFinding("CFM-001"), "Sem achado", "Revisar promessa")}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Ausência de Sensacionalismo ou Método Exclusivo</span>
                {checkStatus(!hasFinding("CFM-002", "CFM-005"), "Sem achado", "Revisar trecho")}
              </div>
            </div>
          </div>

          {/* Bloco 2: Regras da LGPD de Saúde */}
          <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors duration-300">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 icon-hover-effect" />
              Diretrizes LGPD (Lei 13.709/2018, Art. 5º e 11)
            </h4>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Proteção de Dados Pessoais Sensíveis:</span>
                <span className="text-teal-700 dark:text-teal-400 font-bold">Atenção redobrada</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Dados de saúde e exames pertencem ao paciente. Qualquer exposição requer anonimização irreversível ou consentimento formal específico.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Responsabilidade Civil & Ética:</span>
                <span className="text-teal-700 dark:text-teal-400 font-bold">Risco Zero</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Protege o médico contra sindicâncias na CODAME do CRM e ações de reparação civil por vazamento de dados de prontuário.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
