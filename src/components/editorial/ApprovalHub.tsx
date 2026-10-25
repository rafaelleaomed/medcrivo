"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderKanban,
  ImageIcon,
  Layers3,
  MessageSquareWarning,
  Play,
  Send,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { EDITORIAL_ITEMS, EDITORIAL_PROJECTS, type EditorialItem } from "@/lib/editorial/catalog";
import { countApprovalStates, mergeApprovalState, type ApprovalState, type ApprovalStatus } from "@/lib/editorial/approval";
import { cn } from "@/lib/utils";

type View = "queue" | "projects";
type Filter = "all" | ApprovalStatus | `project:${string}`;
type FeedbackMap = Record<string, string>;

const STATUS: Record<ApprovalStatus, { label: string; classes: string }> = {
  pending: { label: "Para aprovar", classes: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200" },
  approved: { label: "Aprovado", classes: "bg-teal-100 text-teal-800 dark:bg-lima/15 dark:text-lima" },
  changes: { label: "Ajustes pedidos", classes: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200" },
  scheduled: { label: "Agendado", classes: "bg-pinho text-marfim dark:bg-marfim dark:text-pinho" },
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const FORMAT_ICONS: Record<EditorialItem["format"], LucideIcon> = {
  Reel: Play,
  Carrossel: Layers3,
  Stories: Sparkles,
  Estático: ImageIcon,
};

function DraftCover({ item }: { item: EditorialItem }) {
  const Icon = FORMAT_ICONS[item.format];
  return (
    <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-pinho p-6 text-marfim">
      <div aria-hidden className="mc-dots absolute inset-0 opacity-[0.08]" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lima">Rascunho</span>
        <Icon className="h-5 w-5 text-lima" aria-hidden />
      </div>
      <p className="relative font-barlow text-[clamp(2rem,4vw,3.25rem)] font-black uppercase leading-[0.88] tracking-tight">
        {item.body}
      </p>
      <p className="relative border-t border-marfim/20 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-marfim/65">
        {item.format} · MedCrivo
      </p>
    </div>
  );
}

function ArtworkCover({ item }: { item: EditorialItem }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-pinho">
      {/* Imagens já estão versionadas e públicas; sem proxy para a prévia refletir exatamente o arquivo aprovado. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.images[0]} alt={`Capa de ${item.title}`} width={1080} height={1350} loading="lazy" className="h-full w-full object-cover" />
      {item.images.length > 1 && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-pinho/90 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-marfim">
          <Layers3 className="h-3.5 w-3.5" aria-hidden /> {item.images.length}
        </span>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: ApprovalStatus }) {
  return <span className={cn("px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]", STATUS[status].classes)}>{STATUS[status].label}</span>;
}

function ItemCard({ item, status, onOpen }: { item: EditorialItem; status: ApprovalStatus; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group mc-cell flex h-full flex-col bg-[var(--bg-card)] text-left transition-colors hover:bg-[var(--bg-card-subtle)] focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600 cursor-pointer"
    >
      {item.images.length ? <ArtworkCover item={item} /> : <DraftCover item={item} />}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <StatusPill status={status} />
          <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1" aria-hidden />
        </div>
        <div>
          <p className="mc-kicker">{item.eyebrow}</p>
          <h2 className="mt-3 text-xl font-bold leading-tight">{item.title}</h2>
        </div>
        <div className="mt-auto flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden />
          {dateLabel(item.scheduledAt)}
        </div>
      </div>
    </button>
  );
}

function DetailPanel({
  item,
  status,
  feedback,
  onClose,
  onDecision,
}: {
  item: EditorialItem;
  status: ApprovalStatus;
  feedback: string;
  onClose: () => void;
  onDecision: (status: "approved" | "changes", feedback?: string) => void;
}) {
  const [slide, setSlide] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [note, setNote] = useState(feedback);
  const image = item.images[slide];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-pinho/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-default" aria-label="Fechar detalhes" />
      <section className="relative z-10 h-full w-full max-w-5xl overflow-y-auto bg-[var(--bg-main)] shadow-2xl">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/95 px-4 py-3 backdrop-blur sm:px-7">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer">
            <X className="h-4 w-4" aria-hidden /> Fechar
          </button>
          <StatusPill status={status} />
        </header>

        <div className="grid lg:grid-cols-[minmax(320px,0.9fr)_1.1fr]">
          <div className="border-b border-[var(--border-subtle)] bg-[#091c19] p-4 sm:p-8 lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r">
            <div className="mx-auto max-w-[440px]">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={`Slide ${slide + 1} de ${item.title}`} width={1080} height={1350} className="aspect-[4/5] w-full object-cover shadow-2xl" />
              ) : (
                <DraftCover item={item} />
              )}
              {item.images.length > 1 && (
                <div className="mt-4 flex items-center justify-between text-marfim">
                  <button type="button" disabled={slide === 0} onClick={() => setSlide((n) => n - 1)} className="inline-flex h-10 w-10 items-center justify-center border border-marfim/25 disabled:opacity-30 cursor-pointer" aria-label="Slide anterior">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="font-mono text-[11px] tracking-wider">{slide + 1} / {item.images.length}</span>
                  <button type="button" disabled={slide === item.images.length - 1} onClick={() => setSlide((n) => n + 1)} className="inline-flex h-10 w-10 items-center justify-center border border-marfim/25 disabled:opacity-30 cursor-pointer" aria-label="Próximo slide">
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-full flex-col p-6 sm:p-9">
            <p className="mc-kicker">{item.eyebrow}</p>
            <h1 className="mc-display mt-5 text-5xl sm:text-6xl">{item.title}</h1>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <span className="border border-[var(--border-subtle)] px-3 py-2">{item.format}</span>
              <span className="border border-[var(--border-subtle)] px-3 py-2">{dateLabel(item.scheduledAt)}</span>
            </div>

            <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <p className="mc-kicker">Tese</p>
              <p className="mt-3 text-lg font-semibold leading-relaxed">{item.thesis}</p>
            </section>

            <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <p className="mc-kicker">Legenda</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--text-muted)]">{item.caption}</p>
            </section>

            <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <p className="mc-kicker">Antes de publicar</p>
              <ul className="mt-4 space-y-3">
                {item.dependencies.map((dependency) => (
                  <li key={dependency} className="flex items-start gap-3 text-sm">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-lima" aria-hidden /> {dependency}
                  </li>
                ))}
              </ul>
            </section>

            {feedback && status === "changes" && (
              <section className="mt-8 border border-rose-300 bg-rose-50 p-4 text-rose-900 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider">Ajuste solicitado</p>
                <p className="mt-2 text-sm leading-relaxed">{feedback}</p>
              </section>
            )}

            {status !== "scheduled" && (
              <div className="mt-auto pt-10">
                {showFeedback ? (
                  <div className="space-y-3 border-t border-[var(--border-subtle)] pt-6">
                    <label htmlFor="approval-feedback" className="mc-kicker">O que precisa mudar?</label>
                    <textarea id="approval-feedback" value={note} onChange={(e) => setNote(e.target.value)} rows={4} autoFocus className="w-full resize-none border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-sm outline-none focus:border-teal-600" placeholder="Ex.: trocar o gancho e reduzir o texto do slide 3." />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowFeedback(false)} className="h-11 flex-1 border border-[var(--border-subtle)] font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer">Cancelar</button>
                      <button type="button" disabled={!note.trim()} onClick={() => onDecision("changes", note.trim())} className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-rose-700 font-mono text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-40 cursor-pointer">
                        <Send className="h-4 w-4" aria-hidden /> Enviar ajuste
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-6">
                    <button type="button" onClick={() => setShowFeedback(true)} className="inline-flex h-12 items-center justify-center gap-2 border border-[var(--border-subtle)] font-mono text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-rose-50 dark:hover:bg-rose-400/10 cursor-pointer">
                      <MessageSquareWarning className="h-4 w-4" aria-hidden /> Pedir ajuste
                    </button>
                    <button type="button" onClick={() => onDecision("approved")} className="inline-flex h-12 items-center justify-center gap-2 bg-pinho font-mono text-[11px] font-bold uppercase tracking-wider text-marfim transition-colors hover:bg-teal-800 dark:bg-lima dark:text-pinho cursor-pointer">
                      <Check className="h-4 w-4" aria-hidden /> Aprovar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ApprovalHub() {
  const defaults = useMemo(() => mergeApprovalState(EDITORIAL_ITEMS), []);
  const [states, setStates] = useState<ApprovalState>(defaults);
  const [feedback, setFeedback] = useState<FeedbackMap>({});
  const [view, setView] = useState<View>("queue");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<EditorialItem | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/editorial/approvals")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;
        setStates(mergeApprovalState(EDITORIAL_ITEMS, data.approvals.decisions));
        setFeedback(data.approvals.feedback ?? {});
      })
      .catch(() => setNotice("O painel abriu, mas o histórico de decisões não pôde ser carregado."));
  }, []);

  const counts = countApprovalStates(states);
  const filtered = EDITORIAL_ITEMS.filter((item) => {
    if (filter === "all") return true;
    if (filter.startsWith("project:")) return item.projectId === filter.slice("project:".length);
    return states[item.id] === filter;
  });

  async function decide(item: EditorialItem, next: "approved" | "changes", note = "") {
    const previousStates = states;
    const previousFeedback = feedback;
    const decisions = { ...states, [item.id]: next };
    for (const scheduled of EDITORIAL_ITEMS.filter((entry) => entry.defaultStatus === "scheduled")) {
      delete decisions[scheduled.id];
    }
    const notes = { ...feedback, ...(note ? { [item.id]: note } : {}) };
    if (next === "approved") delete notes[item.id];
    setStates({ ...states, [item.id]: next });
    setFeedback(notes);

    const res = await fetch("/api/editorial/approvals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisions, feedback: notes }),
    }).catch(() => null);

    if (!res?.ok) {
      setStates(previousStates);
      setFeedback(previousFeedback);
      setNotice("Não foi possível salvar. A decisão anterior foi mantida.");
      return;
    }
    setNotice(next === "approved" ? "Conteúdo aprovado e salvo." : "Pedido de ajuste salvo para a produção.");
    setSelected(null);
  }

  return (
    <div className="-mx-4 sm:mx-0">
      <section className="mc-grid grid-cols-1 lg:grid-cols-12">
        <div className="mc-cell p-6 sm:p-9 lg:col-span-8">
          <p className="mc-kicker">MedCrivo · produção editorial</p>
          <h1 className="mc-display mt-6 text-6xl sm:text-8xl">Central de<br /><span className="mc-accent">aprovação</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--text-muted)]">Veja artes, leia legendas e decida o que segue para produção. Peças já agendadas aparecem apenas para consulta.</p>
        </div>
        <div className="mc-cell flex min-h-52 flex-col justify-between bg-pinho p-6 text-marfim sm:p-8 lg:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-marfim/60">Fila agora</p>
          <div>
            <span className="font-barlow text-8xl font-black leading-none text-lima">{counts.pending + counts.changes}</span>
            <p className="mt-2 font-serif text-2xl italic">decisões aguardando você</p>
          </div>
        </div>
      </section>

      <section className="mc-grid grid-cols-2 border-t-0 lg:grid-cols-4" aria-label="Resumo">
        {([
          { label: "Para aprovar", value: counts.pending, Icon: Clock3 },
          { label: "Aprovados", value: counts.approved, Icon: CheckCircle2 },
          { label: "Ajustes", value: counts.changes, Icon: MessageSquareWarning },
          { label: "Agendados", value: counts.scheduled, Icon: CalendarClock },
        ]).map(({ label, value, Icon }) => (
          <div key={label} className="mc-cell flex min-h-28 items-end justify-between p-5 sm:p-6">
            <div><p className="mc-kicker">{label}</p><p className="mc-display mt-3 text-5xl">{value}</p></div>
            <Icon className="h-5 w-5 text-[var(--text-muted)]" aria-hidden />
          </div>
        ))}
      </section>

      <nav className="mc-cell flex flex-wrap items-center justify-between gap-3 border-t-0 p-3" aria-label="Visões do painel">
        <div className="flex gap-1">
          <button type="button" onClick={() => setView("queue")} className={cn("h-10 px-4 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer", view === "queue" ? "bg-pinho text-marfim dark:bg-lima dark:text-pinho" : "hover:bg-[var(--bg-card-subtle)]")}>Fila editorial</button>
          <button type="button" onClick={() => setView("projects")} className={cn("h-10 px-4 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer", view === "projects" ? "bg-pinho text-marfim dark:bg-lima dark:text-pinho" : "hover:bg-[var(--bg-card-subtle)]")}>Projetos</button>
        </div>
        {view === "queue" && (
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="h-10 border border-[var(--border-subtle)] bg-transparent px-3 font-mono text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer" aria-label="Filtrar conteúdos">
            {filter.startsWith("project:") && <option value={filter}>Projeto selecionado</option>}
            <option value="all">Todos</option><option value="pending">Para aprovar</option><option value="approved">Aprovados</option><option value="changes">Ajustes</option><option value="scheduled">Agendados</option>
          </select>
        )}
      </nav>

      {notice && (
        <div className="flex items-center justify-between border-x border-b border-[var(--border-subtle)] bg-lima/25 px-5 py-3 text-sm">
          <span>{notice}</span><button type="button" onClick={() => setNotice(null)} className="cursor-pointer" aria-label="Fechar aviso"><X className="h-4 w-4" /></button>
        </div>
      )}

      {view === "queue" ? (
        <section className="mc-grid grid-cols-1 border-t-0 sm:grid-cols-2 xl:grid-cols-3" aria-label="Conteúdos editoriais">
          {filtered.map((item) => <ItemCard key={item.id} item={item} status={states[item.id]} onOpen={() => setSelected(item)} />)}
          {filtered.length === 0 && <div className="mc-cell col-span-full p-10 text-center text-sm text-[var(--text-muted)]">Este projeto ainda não tem peças vinculadas.</div>}
        </section>
      ) : (
        <section className="mc-grid grid-cols-1 border-t-0 lg:grid-cols-3" aria-label="Projetos editoriais">
          {EDITORIAL_PROJECTS.map((project, index) => {
            const total = EDITORIAL_ITEMS.filter((item) => item.projectId === project.id).length;
            const pending = EDITORIAL_ITEMS.filter((item) => item.projectId === project.id && ["pending", "changes"].includes(states[item.id])).length;
            return (
              <button key={project.id} type="button" onClick={() => { setView("queue"); setFilter(`project:${project.id}`); }} className={cn("mc-cell group flex min-h-80 flex-col justify-between p-6 text-left transition-transform hover:-translate-y-1 cursor-pointer", project.tone === "pinho" && "bg-pinho text-marfim", project.tone === "lima" && "bg-lima text-pinho", project.tone === "marfim" && "bg-[var(--bg-card)]")}>
                <div className="flex items-start justify-between"><FolderKanban className="h-8 w-8" aria-hidden /><span className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-60">0{index + 1}</span></div>
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-60">{project.period}</p><h2 className="mc-display mt-4 text-5xl">{project.title}</h2><p className="mt-5 max-w-sm text-sm leading-6 opacity-75">{project.description}</p></div>
                <div className="flex items-center justify-between border-t border-current/20 pt-4 font-mono text-[10px] font-bold uppercase tracking-wider"><span>{total || "Planejamento"} {total === 1 ? "item" : "itens"}{pending ? ` · ${pending} pendentes` : ""}</span><ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden /></div>
              </button>
            );
          })}
        </section>
      )}

      {selected && <DetailPanel key={selected.id} item={selected} status={states[selected.id]} feedback={feedback[selected.id] ?? ""} onClose={() => setSelected(null)} onDecision={(next, note) => void decide(selected, next, note)} />}
    </div>
  );
}
