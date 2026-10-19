"use client";

import React, { useState, useEffect } from "react";
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Minimize2,
  Video,
  Clock,
  ShieldCheck,
  Sparkles,
  Zap,
  Repeat,
  CheckCircle2,
  Award,
  Sliders,
  Maximize2,
} from "lucide-react";
import {
  VideoScript,
  VTURB_HOOK_FORMULAS,
  HookFormula,
} from "@/lib/vturbVideo";

interface VturbVideoDirectorProps {
  script: VideoScript;
  doctorName: string;
  crm: string;
}

export function VturbVideoDirector({
  script,
  doctorName,
  crm,
}: VturbVideoDirectorProps) {
  const [teleprompterOpen, setTeleprompterOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);

  // Fórmula de Gancho Ativa
  const [selectedFormula, setSelectedFormula] = useState<HookFormula>(
    VTURB_HOOK_FORMULAS.find((f) => f.id === script.selectedFormulaId) ||
      VTURB_HOOK_FORMULAS[0]
  );

  // Efeito do cronômetro do teleprompter
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && seconds < 60) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seconds, speed]);

  const resetTimer = () => {
    setIsPlaying(false);
    setSeconds(0);
  };

  // Atualiza o texto do teleprompter com base na fórmula selecionada
  const activeTeleprompterText = `${selectedFormula.speech} [PAUSA]\n\nNa maioria das vezes que recebo pessoas no consultório com essa queixa, vejo o mesmo equívoco repetido.\n\nEstudos clínicos recentes demonstram que as intervenções individualizadas alteram profundamente o curso da condição.\n\nO mecanismo biológico não responde a tratamentos genéricos: ele exige precisão diagnóstica.\n\n[PAUSA]\n\nSe você quer investigar sua saúde com base na ciência médica, toque no link da minha bio e agende sua consulta particular.`;

  return (
    <div className="bg-white/95 dark:bg-[#132D29]/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white dark:text-slate-950 font-bold shadow-md shadow-teal-500/10">
            <Film className="w-5 h-5 icon-hover-effect" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Roteiro de Vídeo & Reels Médicos
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-mono font-bold">
                Reels / TikTok / Shorts (60s)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estrutura segundo a segundo: gancho, desenvolvimento e CTA ético. Revise a fala antes de gravar.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTeleprompterOpen(true);
            resetTimer();
          }}
          className="group px-4 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Video className="w-4 h-4 icon-hover-effect" /> Abrir Teleprompter de Gravação
        </button>
      </div>

      {/* BANNER DE NOTIFICAÇÃO E AUDITORIA DE MARKETING (INFORMA AO MÉDICO) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Como usar este roteiro
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Leia em voz alta e troque o que não soa como você. Números e estudos só entram se você conferiu a fonte.
            </p>
          </div>
        </div>

      </div>

      {/* SELETOR INTERATIVO DAS FÓRMULAS DE GANCHOS (YOUTUBE AGENT SKILL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Escolha o gancho de abertura
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {VTURB_HOOK_FORMULAS.map((formula) => {
            const isSelected = selectedFormula.id === formula.id;
            return (
              <button
                key={formula.id}
                onClick={() => setSelectedFormula(formula)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-end w-full min-h-3.5">
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </div>
                <div className="text-xs font-bold leading-tight">
                  {formula.name.split("(")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROTEIRO ESTRUTURADO POR LINHA DO TEMPO (VTURB PACING) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bloco 1: Gancho 0 a 3s */}
        <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-teal-500/40 rounded-2xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 border border-teal-500/40 text-teal-700 dark:text-teal-300 font-bold font-mono">
              00:00 - 00:03 (GANCHO)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Fala nos primeiros 3s:
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
              "{selectedFormula.speech}"
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="text-amber-600 dark:text-amber-400 font-bold">Ação Visual: </span>
            {selectedFormula.visualDirection}
          </div>

          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-mono mt-auto">
            Texto na tela: <strong>"{selectedFormula.onScreenText}"</strong>
          </div>
        </div>

        {/* Bloco 2: Retenção 4 a 45s */}
        <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold font-mono">
              00:04 - 00:45 (MECANISMO)
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-bold">Retenção de Audiência</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Desenvolvimento do Conteúdo:
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
              {script.retentionBody?.speech ||
                "A maioria das pessoas trata o sintoma de superfície e ignora a inflamação vascular silenciosa."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="text-teal-700 dark:text-teal-400 font-bold">Evidência: </span>
            {script.retentionBody?.scientificCitation || "Sem referência. Só cite estudos que você conferiu."}
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-auto">
            Loop: {selectedFormula.curiosityLoop}
          </div>
        </div>

        {/* Bloco 3: CTA Ético 46 a 60s */}
        <div className="bg-slate-50 dark:bg-[#0C1F1C] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold font-mono">
              00:46 - 00:60 (CTA ÉTICO)
            </span>
            <span className="text-teal-700 dark:text-teal-400 font-bold">CFM 2.336</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Chamada para Ação Médica:
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
              "{script.conversionCta?.speech ||
                "Se você ou alguém da sua família convive com esse quadro, agende sua avaliação pelo link da bio."}"
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="text-teal-700 dark:text-teal-400 font-bold">Direção de Cena: </span>
            {script.conversionCta?.direction || "Gesto sóbrio indicando o perfil com simpatia e acolhimento."}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-teal-700 dark:text-teal-400 font-mono mt-auto">
            <ShieldCheck className="w-3.5 h-3.5 icon-hover-effect" /> Revise no Crivo antes de gravar
          </div>
        </div>
      </div>

      {/* MODAL DO TELEPROMPTER DE GRAVAÇÃO PROFISSIONAL */}
      {teleprompterOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-200">
          {/* Top Bar do Teleprompter */}
          <div className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Teleprompter Médico Studio
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Dr(a). {doctorName} ({crm})
              </span>
            </div>

            {/* Controles de Gravação */}
            <div className="flex items-center gap-3">
              {/* Botão de Modo Espelho (para usar com espelhos de teleprompter físicos) */}
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors ${
                  isMirrored
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
                title="Espelhar texto horizontalmente para refletor de câmera"
              >
                Espelho: {isMirrored ? "ATIVO" : "DESLIGADO"}
              </button>

              {/* Cronômetro */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-sm text-teal-400 font-bold">
                <Clock className="w-4 h-4 text-teal-400 icon-hover-effect" />
                <span>
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")} / 01:00
                </span>
              </div>

              {/* Velocidade de Leitura */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                {[1, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-lg font-mono cursor-pointer transition-colors ${
                      speed === s ? "bg-teal-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTeleprompterOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Fechar Teleprompter"
              >
                <Minimize2 className="w-5 h-5 icon-hover-effect" />
              </button>
            </div>
          </div>

          {/* Área de Texto Contínuo do Teleprompter */}
          <div className="w-full max-w-3xl my-auto py-8 text-center flex flex-col items-center justify-center">
            <div
              className={`w-full bg-[#0C1F1C] border border-slate-800/80 rounded-3xl p-8 max-h-[60vh] overflow-y-auto space-y-6 shadow-2xl transition-transform ${
                isMirrored ? "-scale-x-100" : ""
              }`}
            >
              <p className="text-2xl md:text-3xl font-bold text-teal-300 leading-relaxed font-sans select-none tracking-wide whitespace-pre-line">
                {activeTeleprompterText}
              </p>
            </div>
          </div>

          {/* Barra de Controles Inferiores */}
          <div className="w-full max-w-4xl flex items-center justify-center gap-4 border-t border-slate-800 pt-4">
            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reiniciar Cronômetro"
            >
              <RotateCcw className="w-5 h-5 icon-hover-effect" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="group px-8 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current icon-hover-effect" />
              ) : (
                <Play className="w-5 h-5 fill-current icon-hover-effect" />
              )}
              {isPlaying ? "Pausar Gravação" : "Iniciar Gravação"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
