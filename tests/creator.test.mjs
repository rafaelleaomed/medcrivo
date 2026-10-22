import assert from "node:assert/strict";
import test from "node:test";
import { HealthcareComplianceEngine } from "../src/lib/compliance.ts";
import { DoctorProfileSchema } from "../src/lib/profile.ts";
import { defaultTheme, heuristicIdeas, ideaText, IdeasInputSchema } from "../src/lib/creator/ideas.ts";
import { heuristicStories, normalizeStories, StoriesInputSchema, storiesText } from "../src/lib/creator/stories.ts";
import { AssistantReplySchema, conversationTitle, heuristicReply, topicFrom } from "../src/lib/creator/assistant.ts";

const profile = DoctorProfileSchema.parse({ name: "Ana Lima", crm: "CRM/SP 123456", specialty: "Cardiologia", interests: ["hipertensão"] });

// Mesmo critério do Crivo usado nas rotas (sem exigir identificação em pautas e respostas).
function hasCritical(text) {
  return HealthcareComplianceEngine.audit(text, { profession: "medico" }).infractions.some((i) => i.severity === "CRITICAL");
}

const NUMBERS_OR_DOI = /\d+\s?%|\bdoi\b|10\.\d{4,}\//i;

test("ideias: tema vazio usa o perfil e respeita a quantidade", () => {
  const input = IdeasInputSchema.parse({ count: 4 });
  const ideas = heuristicIdeas(input, profile);
  assert.equal(defaultTheme(profile), "hipertensão");
  assert.equal(ideas.length, 4);
  assert.ok(ideas.every((i) => i.title.includes("hipertensão")));
});

test("ideias: notícia e artigo trazem ângulos próprios, sem número, DOI ou achado crítico", () => {
  for (const source of ["pauta", "noticia", "artigo"]) {
    const ideas = heuristicIdeas(IdeasInputSchema.parse({ theme: "sono", source, count: 8 }), profile);
    assert.ok(ideas.length >= 6);
    assert.equal(new Set(ideas.map((i) => i.title)).size, ideas.length, "pautas repetidas");
    for (const idea of ideas) {
      assert.doesNotMatch(ideaText(idea), NUMBERS_OR_DOI);
      assert.equal(hasCritical(ideaText(idea)), false, idea.title);
    }
  }
});

test("stories: abertura, interação e final para cada objetivo e tamanho", () => {
  for (const goal of ["educar", "engajar", "converter"]) {
    for (const count of [4, 5, 6]) {
      const plan = heuristicStories(StoriesInputSchema.parse({ topic: "enxaqueca", goal, count }));
      assert.ok(plan.frames.length <= count && plan.frames.length >= 4, `${goal}/${count}: ${plan.frames.length}`);
      assert.equal(plan.frames[0].kind, "abertura");
      assert.ok(["cta", "caixa"].includes(plan.frames.at(-1).kind));
      assert.ok(plan.frames.some((f) => ["enquete", "quiz", "caixa"].includes(f.kind)));
      assert.doesNotMatch(storiesText(plan), NUMBERS_OR_DOI);
      assert.equal(hasCritical(storiesText(plan)), false);
    }
  }
});

test("stories: normaliza resposta fora do formato", () => {
  const plan = normalizeStories(
    {
      title: "",
      frames: [
        { kind: "conteudo", text: "Oi", detail: "", question: "sobra", options: ["a"], visual: "" },
        { kind: "conteudo", text: "Meio", detail: "", question: "", options: [], visual: "" },
        { kind: "quiz", text: "Quiz", detail: "", question: "Q?", options: ["a", "b", "c", "d"], visual: "" },
        { kind: "conteudo", text: "Fim", detail: "", question: "", options: [], visual: "" },
        { kind: "conteudo", text: "Extra", detail: "", question: "", options: [], visual: "" },
      ],
    },
    4,
  );
  assert.equal(plan.frames.length, 4);
  assert.equal(plan.frames[0].kind, "abertura");
  assert.equal(plan.frames[0].question, "");
  assert.equal(plan.frames[2].options.length, 3);
  assert.equal(plan.frames[3].kind, "cta");
  assert.equal(plan.title, "Sequência de stories");
});

test("stories: sem interação, a terceira tela vira enquete", () => {
  const frame = (text) => ({ kind: "conteudo", text, detail: "", question: "", options: [], visual: "" });
  const plan = normalizeStories({ title: "x", frames: [frame("a"), frame("b"), frame("c"), frame("d")] }, 4);
  assert.equal(plan.frames[2].kind, "enquete");
  assert.equal(plan.frames[2].options.length, 2);
});

test("assistente: leva cada pedido para a ferramenta certa", () => {
  assert.equal(heuristicReply("Crie um carrossel sobre colesterol").action?.tool, "carrossel");
  assert.equal(heuristicReply("Crie um carrossel sobre colesterol").action?.topic, "colesterol");
  assert.equal(heuristicReply("quero stories sobre vacina da gripe").action?.tool, "stories");
  assert.equal(heuristicReply("Me dê 5 pautas para esta semana").action?.tool, "ideias");
  assert.equal(heuristicReply("Posso mostrar antes e depois?").action?.tool, "crivo");
  assert.equal(heuristicReply("Reescreva minha bio do Instagram").action, null);
  assert.equal(heuristicReply("olá").action, null);
});

test("assistente: respostas de reserva seguem o schema e passam no Crivo", () => {
  for (const msg of ["antes e depois", "posso divulgar o preço da consulta?", "foto de paciente", "rodapé com CRM", "bio", "oi"]) {
    const reply = heuristicReply(msg);
    assert.ok(AssistantReplySchema.safeParse(reply).success, msg);
    assert.equal(hasCritical(reply.reply), false, msg);
    assert.ok(reply.suggestions.length <= 3);
  }
});

test("assistente: valor de consulta é permitido; promoção não (alinhado ao Crivo)", () => {
  const reply = heuristicReply("posso divulgar o valor da consulta?").reply;
  assert.match(reply, /permitido/);
  assert.match(reply, /promoção/);
});

test("assistente: tema e título curtos", () => {
  assert.equal(topicFrom("Faça um post sobre apneia do sono?"), "apneia do sono");
  assert.ok(conversationTitle("a".repeat(100)).length <= 48);
});

/* ---------------------------------- Gemini ---------------------------------- */
import { z } from "zod";
import { askGeminiStructured, GeminiApiError } from "../src/lib/ai/gemini.ts";

async function withFetch(impl, fn) {
  const original = globalThis.fetch;
  process.env.GEMINI_API_KEY = "chave-de-teste";
  globalThis.fetch = impl;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
    delete process.env.GEMINI_API_KEY;
  }
}

const okBody = (text) => ({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 7 } });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

test("gemini: valida a resposta com o schema e devolve o uso", async () => {
  const schema = z.object({ gancho: z.string() });
  const out = await withFetch(async () => json(okBody('{"gancho":"oi"}')), () => askGeminiStructured({ schema, system: "s", messages: [{ role: "user", content: "x" }] }));
  assert.deepEqual(out.data, { gancho: "oi" });
  assert.equal(out.usage.inputTokens, 5);
  assert.equal(out.usage.outputTokens, 7);
});

test("gemini: 400 repete com o schema no prompt; outros erros viram GeminiApiError", async () => {
  const schema = z.object({ gancho: z.string() });
  let calls = 0;
  const out = await withFetch(
    async () => (++calls === 1 ? json({}, 400) : json(okBody('{"gancho":"ok"}'))),
    () => askGeminiStructured({ schema, system: "s", messages: [{ role: "user", content: "x" }] }),
  );
  assert.equal(calls, 2);
  assert.equal(out.data.gancho, "ok");
  await assert.rejects(
    withFetch(async () => json({}, 429), () => askGeminiStructured({ schema, system: "s", messages: [{ role: "user", content: "x" }] })),
    (e) => e instanceof GeminiApiError && e.status === 429,
  );
});

test("gemini: JSON fora do schema é rejeitado", async () => {
  const schema = z.object({ gancho: z.string() });
  await assert.rejects(
    withFetch(async () => json(okBody('{"outro":1}')), () => askGeminiStructured({ schema, system: "s", messages: [{ role: "user", content: "x" }] })),
  );
});
