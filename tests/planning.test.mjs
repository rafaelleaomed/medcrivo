import assert from "node:assert/strict";
import test from "node:test";
import { HealthcareComplianceEngine } from "../src/lib/compliance.ts";
import {
  atHour,
  daySchedule,
  dayKey,
  fromLocalInputs,
  monthGrid,
  moveToDay,
  nextFreeSlot,
  PlannerItemInputSchema,
  PlannerItemPatchSchema,
  PlannerRangeSchema,
  SUGGESTED_HOURS,
  toLocalInputs,
  visibleRange,
} from "../src/lib/planner/planner.ts";
import {
  LIBRARY_FRAMEWORKS,
  LIBRARY_MODELS,
  LIBRARY_SPECIALTIES,
  matchSpecialty,
  modelText,
  topicFor,
} from "../src/lib/library/templates.ts";

const item = (scheduledAt, extra = {}) => ({
  id: crypto.randomUUID(),
  postId: null,
  title: "Item",
  format: "carrossel",
  scheduledAt,
  note: "",
  status: "planned",
  createdAt: scheduledAt,
  updatedAt: scheduledAt,
  ...extra,
});
const local = (y, m, d, h = 0, min = 0) => new Date(y, m - 1, d, h, min);

test("planner: grade do mês começa no domingo e cobre o mês inteiro", () => {
  const weeks = monthGrid(local(2026, 10, 19));
  assert.equal(weeks.length, 5);
  assert.ok(weeks.every((w) => w.length === 7 && w[0].getDay() === 0));
  assert.equal(dayKey(weeks[0][0]), "2026-09-27");
  const days = new Set(weeks.flat().map(dayKey));
  for (let d = 1; d <= 31; d++) assert.ok(days.has(`2026-10-${String(d).padStart(2, "0")}`));

  const week = visibleRange("week", local(2026, 10, 21));
  assert.equal(dayKey(week.from), "2026-10-18");
  assert.equal(dayKey(week.to), "2026-10-25");
});

test("planner: agenda do dia mistura itens e horários sugeridos livres (07h, 12h, 17h, 20h)", () => {
  assert.deepEqual([...SUGGESTED_HOURS], [7, 12, 17, 20]);
  const day = local(2026, 10, 20);
  const items = [item(local(2026, 10, 20, 7, 30).toISOString()), item(local(2026, 10, 20, 15).toISOString()), item(local(2026, 10, 21, 12).toISOString())];
  const schedule = daySchedule(day, items).map((e) => (e.kind === "slot" ? `slot ${e.hour}` : `item ${new Date(e.item.scheduledAt).getHours()}`));
  assert.deepEqual(schedule, ["item 7", "slot 12", "item 15", "slot 17", "slot 20"]);
});

test("planner: arrastar mantém o horário; slot usa a hora cheia; próximo horário livre pula ocupados", () => {
  const moved = new Date(moveToDay(local(2026, 10, 20, 17, 45).toISOString(), local(2026, 11, 3)));
  assert.equal(dayKey(moved), "2026-11-03");
  assert.equal(moved.getHours(), 17);
  assert.equal(moved.getMinutes(), 45);
  assert.equal(new Date(atHour(local(2026, 10, 22), 12)).getHours(), 12);

  const now = local(2026, 10, 20, 9, 10);
  const busy = [item(atHour(local(2026, 10, 20), 12))];
  const next = new Date(nextFreeSlot(busy, now));
  assert.equal(dayKey(next), "2026-10-20");
  assert.equal(next.getHours(), 17);
  const late = new Date(nextFreeSlot([], local(2026, 10, 20, 21)));
  assert.equal(dayKey(late), "2026-10-21");
  assert.equal(late.getHours(), 7);
});

test("planner: data e hora do formulário vão e voltam sem perder nada", () => {
  const iso = fromLocalInputs("2026-10-20", "07:00");
  assert.deepEqual(toLocalInputs(iso), { date: "2026-10-20", time: "07:00" });
  assert.equal(fromLocalInputs("20/10/2026", "07:00"), null);
  assert.equal(fromLocalInputs("2026-10-20", ""), null);
});

test("planner: validação de entrada, patch e intervalo", () => {
  const ok = PlannerItemInputSchema.parse({ title: " Mito do colesterol ", scheduledAt: "2026-10-20T10:00:00.000Z" });
  assert.equal(ok.title, "Mito do colesterol");
  assert.equal(ok.format, "carrossel");
  assert.equal(ok.status, "planned");
  assert.equal(ok.postId, null);
  assert.equal(PlannerItemInputSchema.safeParse({ title: "", scheduledAt: "2026-10-20T10:00:00.000Z" }).success, false);
  assert.equal(PlannerItemInputSchema.safeParse({ title: "x", scheduledAt: "amanhã" }).success, false);
  assert.equal(PlannerItemInputSchema.safeParse({ title: "x", scheduledAt: "2026-10-20T10:00:00Z", postId: "abc" }).success, false);

  assert.equal(PlannerItemPatchSchema.safeParse({}).success, false);
  assert.deepEqual(PlannerItemPatchSchema.parse({ scheduledAt: "2026-10-21T10:00:00.000Z" }), { scheduledAt: "2026-10-21T10:00:00.000Z" });

  assert.equal(PlannerRangeSchema.safeParse({ from: "2026-10-01T00:00:00Z", to: "2026-11-08T00:00:00Z" }).success, true);
  assert.equal(PlannerRangeSchema.safeParse({ from: "2026-10-01T00:00:00Z", to: "2027-01-01T00:00:00Z" }).success, false);
  assert.equal(PlannerRangeSchema.safeParse({ from: "2026-10-08T00:00:00Z", to: "2026-10-01T00:00:00Z" }).success, false);
});

test("biblioteca: frameworks com 7 a 10 slides, capa no início e CTA no fim", () => {
  assert.equal(LIBRARY_FRAMEWORKS.length, 6);
  for (const f of LIBRARY_FRAMEWORKS) {
    assert.ok(f.slides.length >= 7 && f.slides.length <= 10, `${f.id}: ${f.slides.length} slides`);
    assert.equal(f.slides[0].template, "capa_noticia");
    assert.equal(f.slides.at(-1).template, "cta");
    assert.ok(f.purpose.split(/\s+/).length <= 12, `${f.id}: propósito longo`);
  }
});

test("biblioteca: cada especialidade tem um modelo por framework, ids únicos", () => {
  assert.equal(new Set(LIBRARY_MODELS.map((m) => m.id)).size, LIBRARY_MODELS.length);
  for (const s of LIBRARY_SPECIALTIES) {
    const frameworks = LIBRARY_MODELS.filter((m) => m.specialty === s.id).map((m) => m.framework).sort();
    assert.deepEqual(frameworks, LIBRARY_FRAMEWORKS.map((f) => f.id).sort(), s.id);
  }
});

const NUMBERS_STUDIES_PROMISES = /\d+\s?%|\bdoi\b|10\.\d{4,}\/|\bestudos?\b|\bpesquisas?\b|garant|\bcura\b|milagr|100\s?%|\bo melhor\b/i;

test("biblioteca: ganchos curtos, sem número, estudo ou promessa, e sem achado no Crivo", () => {
  for (const m of LIBRARY_MODELS) {
    assert.ok(m.hook.split(/\s+/).length <= 14, `${m.id}: gancho com mais de 14 palavras`);
    // Números só nas normas citadas pelo nome (Res. CFM 2.336/2023, Res. CFO-196/2019).
    const withoutNorms = modelText(m).replace(/Res\. (CFM|CFO)[-\s][\d./]+/g, "");
    assert.doesNotMatch(withoutNorms, NUMBERS_STUDIES_PROMISES, m.id);
    assert.doesNotMatch(withoutNorms, /\d/, `${m.id}: número no texto`);
    const profession = LIBRARY_SPECIALTIES.find((s) => s.id === m.specialty).profession;
    const audit = HealthcareComplianceEngine.audit(modelText(m), { profession });
    const findings = audit.infractions.filter((i) => i.category !== "identificacao_obrigatoria");
    assert.deepEqual(findings, [], `${m.id}: ${findings.map((i) => i.detectedText).join(", ")}`);
    assert.ok(topicFor(m).length <= 500);
  }
});

test("biblioteca: especialidade do perfil vira filtro padrão", () => {
  assert.equal(matchSpecialty("Cardiologia & Longevidade", "medico"), "cardiologia");
  assert.equal(matchSpecialty("Clínico Geral / Medicina de Família", "medico"), "clinico_geral");
  assert.equal(matchSpecialty("Ginecologia, Obstetrícia & Climatério", "medico"), "ginecologia_obstetricia");
  assert.equal(matchSpecialty("Ortodontia", "dentista"), "odontologia");
  assert.equal(matchSpecialty("Cirurgia geral", "medico"), null);
  assert.equal(matchSpecialty("", "medico"), null);
});
