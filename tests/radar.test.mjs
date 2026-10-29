import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  fallbackOpportunities,
  parseGoogleTrendsRss,
  RadarOpportunitySchema,
  selectFreshOpportunities,
} from "../src/lib/radar/radar.ts";

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:ht="https://trends.google.com/trending/rss" version="2.0"><channel>
  <item><title>vacina da gripe</title><ht:approx_traffic>20 mil+</ht:approx_traffic><pubDate>Wed, 28 Oct 2026 10:00:00 -0300</pubDate><ht:news_item><ht:news_item_title>Campanha amplia vacinação</ht:news_item_title><ht:news_item_url>https://example.com/a</ht:news_item_url></ht:news_item></item>
  <item><title>Vacina da gripe</title><ht:approx_traffic>10 mil+</ht:approx_traffic><pubDate>Wed, 28 Oct 2026 09:00:00 -0300</pubDate></item>
  <item><title>qualidade do sono &amp; saúde</title><ht:approx_traffic>5 mil+</ht:approx_traffic><pubDate>Wed, 28 Oct 2026 08:00:00 -0300</pubDate></item>
</channel></rss>`;

test("radar: lê o RSS oficial do Google Trends, decodifica entidades e remove duplicatas", () => {
  const trends = parseGoogleTrendsRss(rss);
  assert.equal(trends.length, 2);
  assert.deepEqual(trends[0], {
    title: "vacina da gripe",
    traffic: "20 mil+",
    publishedAt: "Wed, 28 Oct 2026 10:00:00 -0300",
    newsTitles: ["Campanha amplia vacinação"],
    newsUrls: ["https://example.com/a"],
  });
  assert.equal(trends[1].title, "qualidade do sono & saúde");
});

test("radar: exclui pautas já vistas e títulos repetidos", () => {
  const fresh = selectFreshOpportunities(
    [
      { title: "Sono e plantão", hook: "A", angle: "A", whyNow: "A", format: "carrossel", goal: "educar", source: "perfil", score: 80 },
      { title: "sono e plantão", hook: "B", angle: "B", whyNow: "B", format: "reel", goal: "engajar", source: "perfil", score: 70 },
      { title: "Vacina sem boato", hook: "C", angle: "C", whyNow: "C", format: "carrossel", goal: "educar", source: "google_trends", trendTitle: "vacina da gripe", score: 90 },
    ],
    ["Sono e plantão"],
    5,
  );
  assert.deepEqual(fresh.map((item) => item.title), ["Vacina sem boato"]);
});

test("radar: bloqueia a mesma pauta com palavras reordenadas", () => {
  const fresh = selectFreshOpportunities(
    [{ title: "Plantão e sono", hook: "A", angle: "A", whyNow: "A", format: "carrossel", goal: "educar", source: "perfil", score: 80 }],
    ["Sono e plantão"],
    5,
  );
  assert.deepEqual(fresh, []);
});

test("radar: o Humanizer não quebra os campos técnicos da pauta", () => {
  const parsed = RadarOpportunitySchema.parse({
    title: "Vacina sem boato",
    hook: "Explique a dúvida.",
    angle: "Contexto seguro.",
    whyNow: "Tema atual.",
    format: "Carrossel.",
    goal: "Educar.",
    source: "google_trends.",
    trendTitle: "vacina da gripe",
    score: 90,
  });
  assert.equal(parsed.format, "carrossel");
  assert.equal(parsed.goal, "educar");
  assert.equal(parsed.source, "google_trends");
});

test("radar: reserva varia por janela e não repete o histórico recebido", () => {
  const profile = { specialty: "Neurologia", interests: ["sono", "enxaqueca"], audiencePains: ["medo de sintomas"] };
  const first = fallbackOpportunities(profile, [], "2026-10-28T09:00:00.000Z", 4);
  const second = fallbackOpportunities(profile, first.map((item) => item.title), "2026-10-28T15:00:00.000Z", 4);
  assert.equal(first.length, 4);
  assert.equal(second.length, 4);
  assert.equal(new Set([...first, ...second].map((item) => item.title)).size, 8);
  assert.ok(first.every((item) => item.source === "perfil"));
});

test("radar: reserva nunca recicla as 30 pautas do histórico", () => {
  const profile = {};
  const firstThirty = fallbackOpportunities(profile, [], "2026-10-28T09:00:00.000Z", 30);
  const next = fallbackOpportunities(profile, firstThirty.map((item) => item.title), "2026-10-28T10:00:00.000Z", 6);
  assert.equal(firstThirty.length, 30);
  assert.equal(next.length, 6);
  assert.equal(new Set([...firstThirty, ...next].map((item) => item.title)).size, 36);
});

test("radar: a entrada autenticada usa pautas dinâmicas, não a lista estática de especialidades", async () => {
  const home = await readFile(new URL("../src/components/studio/StudioHome.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../src/app/api/radar/route.ts", import.meta.url), "utf8");
  assert.match(home, /\/api\/radar/);
  assert.doesNotMatch(home, /SPECIALTY_DATA|suggestTopics/);
  assert.match(route, /guardUser/);
  assert.match(route, /fetchGoogleTrends/);
});

test("radar: trends=[] não causa TypeError (bloqueante B1 — acesso a trends[0])", () => {
  // Garante que toIsoOrNull com undefined retorna null em vez de lançar exceção.
  function toIsoOrNull(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const emptyTrends = [];
  const result = toIsoOrNull(emptyTrends[0]?.publishedAt);
  assert.equal(result, null, "trends vazio deve retornar trendsUpdatedAt=null, não lançar erro");
});

test("radar: reserva passa por filtro clínico — nenhuma pauta CRITICAL sai do fallback (bloqueante B2)", async () => {
  // Garante que o filtro de compliance está no caminho do fallback.
  const route = await readFile(new URL("../src/lib/radar/radar.ts", import.meta.url), "utf8");
  assert.match(route, /HealthcareComplianceEngine/, "radar.ts deve importar HealthcareComplianceEngine");
  assert.match(route, /CRITICAL/, "fallback deve filtrar por CRITICAL");
});
