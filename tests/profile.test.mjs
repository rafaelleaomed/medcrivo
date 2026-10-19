import assert from "node:assert/strict";
import test from "node:test";
import { DoctorProfileSchema, identificationLine, requiresCouncilId, requiresRqe } from "../src/lib/profile.ts";

const base = DoctorProfileSchema.parse({ name: "Ana Lima", crm: "CRM/SP 123456", rqe: "7890", specialty: "Cardiologia" });

test("médico (inclui residente): CRM, sem especialidade nem RQE", () => {
  const p = { ...base, careerStage: "medico" };
  assert.equal(identificationLine(p), "Ana Lima · Médico · CRM/SP 123456");
  assert.equal(requiresCouncilId(p), true);
  assert.equal(requiresRqe(p), false);
});

test("especialista: CRM e RQE", () => {
  const p = { ...base, careerStage: "especialista" };
  assert.equal(identificationLine(p), "Ana Lima · Médico · CRM/SP 123456 · RQE 7890");
  assert.equal(requiresRqe(p), true);
});

test("estudante: nunca 'Médico' nem CRM", () => {
  const p = { ...base, careerStage: "estudante" };
  assert.equal(identificationLine(p), "Ana Lima · Estudante de medicina");
  assert.equal(requiresCouncilId(p), false);
});

test("perfil antigo sem situação vira médico", () => {
  assert.equal(DoctorProfileSchema.parse({}).careerStage, "medico");
});

test("saudação ignora pronome de tratamento salvo no nome", async () => {
  const { greetingName } = await import("../src/lib/profile.ts");
  assert.equal(greetingName({ name: "Dra. Ana Lima", careerStage: "medico" }), "Dr(a). Ana");
  assert.equal(greetingName({ name: "Dr(a). Rui", careerStage: "especialista" }), "Dr(a). Rui");
  assert.equal(greetingName({ name: "Bia Souza", careerStage: "estudante" }), "Bia");
  assert.equal(greetingName({ name: "", careerStage: "medico" }), "");
});
