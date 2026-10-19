import Link from "next/link";
import { BookOpen, FileText, Film, GraduationCap, Layers, MessageCircle, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Card, Headline, Kicker, Seal, buttonClass } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";

const STEPS = [
  { n: "1", title: "Você escolhe o tema", text: "Uma dúvida frequente do consultório, um tema da sua área ou o link de uma notícia. Sem dados de paciente." },
  { n: "2", title: "O Crivo revisa", text: "O texto passa pela Res. CFM 2.336/2023 e pela LGPD, e as referências citadas são conferidas. Você vê o que ele apontou e por quê." },
  { n: "3", title: "Você publica", text: "Carrossel com a sua identidade visual, legenda pronta e roteiro de vídeo. A decisão final é sempre sua." },
];

const CHECKS = [
  { icon: ShieldCheck, title: "Promessa e sensacionalismo", text: "Promessa de resultado ou de cura, superlativos e método exclusivo." },
  { icon: UserRound, title: "Identificação", text: "Nome, CRM/UF e RQE quando há especialidade anunciada." },
  { icon: FileText, title: "Dados de pacientes", text: "Nome, documento, exame com metadados e relato com data e lugar." },
  { icon: BookOpen, title: "Fonte", text: "Referência real encontrada na busca, ou nenhuma. Nada inventado." },
];

const DELIVERABLES = [
  { icon: Layers, title: "Carrossel 4:5", text: "Slides com a sua paleta, manchete e rodapé de identificação." },
  { icon: FileText, title: "Legenda", text: "Pronta para copiar, com CTA ético no final." },
  { icon: Film, title: "Roteiro de vídeo", text: "Gancho, desenvolvimento e CTA, com teleprompter." },
  { icon: MessageCircle, title: "Funil “Comente PALAVRA”", text: "Palavra-chave, isca e mensagem de DM para quem comenta." },
];

const AUDIENCE = [
  { icon: Stethoscope, title: "Médico(a)", text: "Com CRM, ainda sem RQE, inclusive residentes. Conteúdo educativo sem anunciar especialidade." },
  { icon: ShieldCheck, title: "Médico(a) especialista", text: "Com CRM e RQE. A especialidade aparece no post junto com o registro." },
  { icon: GraduationCap, title: "Estudante de medicina", text: "Sem CRM. O Crivo ajuda a divulgar com cuidado, sem se apresentar como médico." },
];

const FAQ = [
  {
    q: "O Crivo garante que não vou ter problema com o conselho?",
    a: "Não, e ninguém pode garantir isso. O Crivo é uma segunda leitura automatizada: aponta o trecho, a norma e uma sugestão de ajuste. A decisão e a responsabilidade continuam com você.",
  },
  {
    q: "O CFM aprova a MedCrivo?",
    a: "Não. O CFM não aprova ferramentas nem posts. O selo “Revisado pelo Crivo” quer dizer que o texto passou pela nossa revisão, e só isso.",
  },
  {
    q: "IA não deixa tudo genérico?",
    a: "Genérico é texto sem briefing e sem revisão. Você parte do seu tema e do seu público, com a sua identidade visual, e edita antes de publicar.",
  },
  {
    q: "Sou estudante, não tenho CRM. Serve para mim?",
    a: "Serve. O app não cobra o número de quem é estudante e não escreve “Médico” no rodapé. Enquanto for estudante, não se apresente como médico(a) nem como especialista.",
  },
  {
    q: "E os dados dos meus pacientes?",
    a: "Não envie dados que identifiquem pacientes. O Crivo procura sinais como documento, exame com metadados e relato com data e lugar, mas não pega tudo: a última checagem é sua.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-pinho text-marfim">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div className="space-y-6">
            <Kicker onDark>Para médicos e estudantes de medicina</Kicker>
            <Headline onDark className="text-5xl sm:text-6xl lg:text-7xl">
              Conteúdo de saúde com IA, <em>revisado pelo Crivo</em>.
            </Headline>
            <p className="max-w-xl text-base leading-relaxed text-[#cfe0d9] sm:text-lg">
              Você escolhe o tema e recebe o carrossel com a sua identidade visual, a legenda e o roteiro de vídeo. Antes de
              chegar até você, o {BRAND.auditorName} revisa as normas do CFM e as referências citadas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/crivo" className={buttonClass("lima", "lg")}>
                Testar o Crivo grátis
              </Link>
              <Link
                href="/checklist"
                className="inline-flex h-13 items-center justify-center rounded-full border border-marfim/30 px-7 text-base font-bold text-marfim hover:bg-marfim/10"
              >
                Receber o checklist
              </Link>
            </div>
            <p className="font-serif text-xl text-marfim/90">{BRAND.tagline}</p>
          </div>

          {/* Exemplo de parecer (fictício) */}
          <div className="rounded-3xl bg-white p-6 text-tinta shadow-2xl md:rotate-[-1.5deg]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Legenda · exemplo fictício</p>
            <p className="mt-3 text-lg leading-snug">
              Esse tratamento{" "}
              <span className="underline decoration-teal-600 decoration-wavy decoration-2 underline-offset-4">é 100% eficaz</span> para o
              seu problema. Agende!
            </p>
            <div className="mt-4 flex gap-3 rounded-2xl bg-marfim p-4 text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-teal-700" aria-hidden />
              <p>
                <strong className="text-teal-800">Promessa de resultado</strong> · Res. CFM 2.336/2023, art. 11. Sugestão: troque
                por informação e um próximo passo responsável.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Seal size="sm" />
              <span className="text-[11px] text-[var(--text-muted)]">Crivo, o revisor ético e científico da MedCrivo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dor */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <Headline as="h2" className="text-4xl sm:text-5xl">
            Você revisa a dose, o exame e a conduta. <em>E a legenda?</em>
          </Headline>
          <p className="text-base leading-relaxed text-[var(--text-muted)]">
            Estar nas redes pede tempo e cuidado com as regras do conselho. A MedCrivo junta as duas coisas: cria o post e faz a
            segunda leitura que todo post merece, antes de ele ir ao ar.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:py-20">
          <div className="space-y-2">
            <Kicker>Como funciona</Kicker>
            <Headline as="h2" className="text-4xl">
              Três passos, <em>um critério</em>.
            </Headline>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="space-y-3">
                <span className="font-display text-7xl font-black leading-none text-teal-700">{s.n}</span>
                <h3 className="text-lg font-bold text-tinta">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* O que o Crivo revisa */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Kicker>O que o Crivo revisa</Kicker>
            <Headline as="h2" className="text-4xl">
              A segunda leitura <em>de todo post</em>.
            </Headline>
          </div>
          <Link href="/crivo" className={buttonClass("primary", "md")}>
            Revisar um texto agora
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map((c) => (
            <Card key={c.title} className="space-y-3">
              <c.icon className="h-6 w-6 text-teal-700" aria-hidden />
              <h3 className="font-bold text-tinta">{c.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{c.text}</p>
            </Card>
          ))}
        </div>
        <Card tone="subtle" className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Seal />
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            O selo indica que o texto passou pela revisão do Crivo. É um controle de qualidade da MedCrivo, <strong>não</strong> uma
            certificação nem uma aprovação do CFM, e nunca substitui a sua identificação profissional.
          </p>
        </Card>
      </section>

      {/* O que você recebe */}
      <section className="bg-pinho text-marfim">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:py-20">
          <div className="space-y-2">
            <Kicker onDark>No estúdio</Kicker>
            <Headline as="h2" onDark className="text-4xl">
              Do tema ao post, <em>no seu tempo</em>.
            </Headline>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((d) => (
              <div key={d.title} className="space-y-3 rounded-3xl bg-marfim/5 p-6">
                <d.icon className="h-6 w-6 text-lima" aria-hidden />
                <h3 className="font-bold">{d.title}</h3>
                <p className="text-sm leading-relaxed text-[#cfe0d9]">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:py-20">
        <div className="space-y-2">
          <Kicker>Para quem é</Kicker>
          <Headline as="h2" className="text-4xl">
            A identificação certa <em>para cada momento</em>.
          </Headline>
          <p className="max-w-2xl text-sm text-[var(--text-muted)]">
            No perfil você escolhe a sua situação, e o rodapé de cada post segue a norma: CRM para médicos, CRM e RQE para
            especialistas e nenhum título médico para estudantes.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <Card key={a.title} className="space-y-3">
              <a.icon className="h-6 w-6 text-teal-700" aria-hidden />
              <h3 className="font-bold text-tinta">{a.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{a.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 md:py-20">
          <Headline as="h2" className="text-4xl">
            Perguntas <em>frequentes</em>
          </Headline>
          <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-tinta">
                  {f.q}
                  <span className="text-teal-700 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <Card tone="dark" className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="space-y-3">
            <p className="font-serif text-3xl sm:text-4xl">{BRAND.tagline}</p>
            <p className="text-sm text-[#cfe0d9]">
              Comece pelo Crivo grátis ou acompanhe a abertura do estúdio pelo Instagram {SITE.instagram.handle}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/crivo" className={buttonClass("lima", "lg")}>
              Testar o Crivo grátis
            </Link>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-13 items-center justify-center rounded-full border border-marfim/30 px-7 text-base font-bold text-marfim hover:bg-marfim/10"
            >
              Seguir {SITE.instagram.handle}
            </a>
          </div>
        </Card>
      </section>
    </>
  );
}
