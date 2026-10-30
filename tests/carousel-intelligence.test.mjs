import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildCarouselJobInput,
  buildHeuristicNarrative,
  narrativeQualityIssues,
} from "../src/lib/content/editorialBriefing.ts";

const fearBriefing = {
  title: "O que muda de pessoa para pessoa: medo de exames e diagnósticos",
  hook: "O medo não aparece igual em todo mundo, e isso muda a conversa antes do exame.",
  angle: "Mostrar três reações concretas e como preparar a consulta sem minimizar o receio.",
  whyNow: "A pauta surgiu de dúvidas recorrentes de pacientes antes de exames.",
  format: "carrossel",
  goal: "educar",
  source: "perfil",
  score: 82,
};

const sleepBriefing = {
  title: "Sono ruim depois do plantão",
  hook: "Dormir por horas não garante que o cérebro tenha se recuperado do plantão.",
  angle: "Contrastar duração do sono com recuperação e mostrar sinais observáveis no dia seguinte.",
  whyNow: "O tema ganhou atenção entre profissionais que alternam turnos.",
  format: "carrossel",
  goal: "engajar",
  source: "google_trends",
  trendTitle: "sono depois do plantão",
  score: 91,
};

test("carrossel: preserva o briefing completo do Radar no pedido de geração", () => {
  const input = buildCarouselJobInput(fearBriefing, "consultorio", 8);
  assert.equal(input.topic, fearBriefing.title);
  assert.deepEqual(input.editorialBriefing, fearBriefing);
  assert.equal(input.tone, "consultorio");
  assert.equal(input.slideCount, 8);
});

test("carrossel: fallback usa gancho e ângulo da pauta sem copiar o título inteiro na capa", () => {
  const post = buildHeuristicNarrative(buildCarouselJobInput(fearBriefing, "didatico", 8), { specialty: "Clínica médica" });
  assert.notEqual(post.slides[0].headline, fearBriefing.title);
  assert.doesNotMatch(post.slides[0].headline, /o que pouca gente entende sobre/i);
  assert.ok(post.slides.some((slide) => `${slide.headline} ${slide.body}`.includes("três reações concretas")));
  assert.deepEqual(narrativeQualityIssues(post, fearBriefing.title), []);
});

test("carrossel: pautas diferentes recebem narrativa e estrutura diferentes", () => {
  const fear = buildHeuristicNarrative(buildCarouselJobInput(fearBriefing, "didatico", 8), { specialty: "Clínica médica" });
  const sleep = buildHeuristicNarrative(buildCarouselJobInput(sleepBriefing, "didatico", 8), { specialty: "Medicina do trabalho" });
  assert.notEqual(fear.framework, sleep.framework);
  assert.notDeepEqual(fear.slides.map((slide) => slide.kicker), sleep.slides.map((slide) => slide.kicker));
  assert.notDeepEqual(fear.slides.map((slide) => slide.headline), sleep.slides.map((slide) => slide.headline));
  assert.equal(fear.cta.action, "save");
  assert.equal(sleep.cta.action, "share");
});

test("carrossel: fallback geral não injeta medo ou exames em pautas sem essa relação", () => {
  const medication = {
    title: "Polifarmácia no idoso: como revisar a lista de remédios",
    hook: "A lista cresce aos poucos, mas ninguém revisa tudo de uma vez.",
    angle: "Mostrar como organizar a revisão sem sugerir retirada de medicamento por conta própria.",
    whyNow: "O tema apareceu entre dúvidas recorrentes de familiares e cuidadores.",
    format: "carrossel",
    goal: "educar",
    source: "perfil",
    score: 88,
  };
  const post = buildHeuristicNarrative(buildCarouselJobInput(medication, "didatico", 9), { specialty: "Clínica médica" });
  const text = JSON.stringify(post);
  assert.doesNotMatch(text, /medo|assusta|antes do exame|resultado do exame/i);
  assert.match(text, /revisão|medicamento|remédio/i);
  assert.deepEqual(narrativeQualityIssues(post, medication.title), []);
});

test("carrossel: gate editorial rejeita padrão genérico, repetição e cópia literal da pauta", () => {
  const generic = {
    framework: "checklist",
    angle: "Guia prático",
    slides: Array.from({ length: 7 }, (_, index) => ({
      template: index === 0 ? "capa_noticia" : index === 6 ? "cta" : "conteudo",
      kicker: "ENTENDA",
      headline: index === 0 ? fearBriefing.title : "Por que isso importa",
      highlight: [],
      body: "Este tema afeta mais pessoas do que parece.",
      items: [],
      imagePrompt: "",
    })),
    caption: "Salve e compartilhe.",
    cta: { keyword: "GUIA", promise: "um guia", leadMagnetTitle: "Guia", leadMagnetOutline: [], dmMessage: "Mensagem" },
    evidenceQuery: fearBriefing.title,
  };
  const issues = narrativeQualityIssues(generic, fearBriefing.title);
  assert.ok(issues.some((issue) => issue.includes("copia literalmente")));
  assert.ok(issues.some((issue) => issue.includes("repetidos")));
  assert.ok(issues.some((issue) => issue.includes("genérico")));
});

test("carrossel: clique no Radar envia o objeto completo e inicia a geração", async () => {
  const home = await readFile(new URL("../src/components/studio/StudioHome.tsx", import.meta.url), "utf8");
  const provider = await readFile(new URL("../src/components/studio/StudioProvider.tsx", import.meta.url), "utf8");
  assert.match(home, /startFromTopic\(EditorialBriefingSchema\.parse\(item\)\)/);
  assert.doesNotMatch(home, /startFromTopic\(item\.title\)/);
  assert.match(provider, /const input = buildCarouselJobInput\(next, profile\.tone, 9\)/);
  assert.match(provider, /await runCarouselJob\(input\)/);
});
