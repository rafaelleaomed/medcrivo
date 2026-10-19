import assert from "node:assert/strict";
import test from "node:test";
import { HealthcareComplianceEngine } from "../src/lib/compliance.ts";

const dentist = {
  profession: "dentista",
  doctorName: "Dra. Ana Lima",
  crm: "CRO/SP 12345",
};

test("aplica a regra CFO que bloqueia imagem durante o procedimento", () => {
  const result = HealthcareComplianceEngine.audit(
    "Veja o passo a passo cirúrgico. Dra. Ana Lima - CIRURGIÃO-DENTISTA - CRO/SP 12345",
    dentist,
  );

  const finding = result.infractions.find((item) => item.ruleId === "CFO-001-IMAGEM-DURANTE-PROCEDIMENTO");
  assert.ok(finding);
  assert.equal(finding.severity, "CRITICAL");
  assert.match(finding.legalReference, /CFO nº 196\/2019/);
  assert.equal(finding.sourceUrl, "https://website.cfo.org.br/resolucao-cfo-196-2019/");
  assert.equal(result.isApproved, false);
});

test("trata antes e depois como divulgação condicionada, não como proibição absoluta", () => {
  const result = HealthcareComplianceEngine.audit(
    "Antes/depois do tratamento realizado por mim. Dra. Ana Lima - CIRURGIÃO-DENTISTA - CRO/SP 12345",
    dentist,
  );

  const finding = result.infractions.find((item) => item.ruleId === "CFO-002-DIAGNOSTICO-RESULTADO-CONDICIONADO");
  assert.ok(finding);
  assert.equal(finding.severity, "WARNING");
  assert.match(finding.reason, /não libera.*forma indiscriminada/i);
  assert.doesNotMatch(finding.reason, /expressamente proibido/i);
});

test("cobra autorização escrita em selfie com paciente", () => {
  const result = HealthcareComplianceEngine.audit(
    "Selfie com a paciente após a consulta. Dra. Ana Lima - CIRURGIÃO-DENTISTA - CRO/SP 12345",
    dentist,
  );

  const finding = result.infractions.find((item) => item.ruleId === "CFO-003-SELFIE-COM-PACIENTE");
  assert.ok(finding);
  assert.match(finding.reason, /autorização formal por escrito/i);
});

test("sinaliza nome ou CRO ausente somente quando há divulgação de imagem regulada", () => {
  const result = HealthcareComplianceEngine.audit("Veja o resultado final do tratamento.", {
    profession: "dentista",
    doctorName: "Dra. Ana Lima",
  });

  assert.ok(result.infractions.some((item) => item.ruleId === "CFO-000-IDENTIFICACAO-IMAGEM"));
});

test("não aplica regra de RQE do CFM a dentistas", () => {
  const result = HealthcareComplianceEngine.audit(
    "Sou pós-graduada e apresento conteúdo educativo. Dra. Ana Lima - CIRURGIÃO-DENTISTA - CRO/SP 12345",
    dentist,
  );

  assert.equal(result.infractions.some((item) => item.ruleId.startsWith("CFM-")), false);
});

test("mantém as regras gerais de privacidade para dentistas", () => {
  const result = HealthcareComplianceEngine.audit(
    "Atendi hoje e vou publicar o caso. Dra. Ana Lima - CIRURGIÃO-DENTISTA - CRO/SP 12345",
    dentist,
  );

  assert.ok(result.infractions.some((item) => item.ruleId === "LGPD-003-RELATO-TEMPO-REAL"));
});

test("mantém as regras CFM para médicos", () => {
  const result = HealthcareComplianceEngine.audit(
    "Sou pós-graduado e médico. Dr. Rui - MÉDICO - CRM/SP 12345",
    { profession: "medico", doctorName: "Dr. Rui", crm: "CRM/SP 12345" },
  );

  assert.ok(result.infractions.some((item) => item.ruleId === "CFM-003-ESPECIALISTA-SEM-RQE"));
  assert.equal(result.infractions.some((item) => item.ruleId.startsWith("CFO-")), false);
});

const doctor = { profession: "medico", doctorName: "Dr. Rui", crm: "CRM/SP 12345" };
const ruleIds = (text, meta = doctor) =>
  HealthcareComplianceEngine.audit(text, meta).infractions.map((item) => item.ruleId);

test("não confunde texto comum depois de 'paciente' com nome próprio", () => {
  for (const text of [
    "Não exponha o paciente sem autorização por escrito.",
    "Peça a autorização do paciente por escrito antes de publicar.",
    "Todo paciente deve ser avaliado individualmente.",
  ]) {
    assert.equal(ruleIds(text).includes("LGPD-001-PII-PACIENTE"), false, text);
  }
});

test("continua detectando nome e documentos de paciente", () => {
  for (const text of [
    "A paciente Maria Silva voltou para revisão.",
    "Paciente: João da Costa, 54 anos.",
    "CPF 123.456.789-00 no laudo.",
    "Prontuário 98765 em anexo.",
  ]) {
    assert.ok(ruleIds(text).includes("LGPD-001-PII-PACIENTE"), text);
  }
});

test("não trata menção genérica a hospital ou convênio como metadado", () => {
  for (const text of [
    "Em caso de dor no peito, procure o hospital mais próximo.",
    "Atendo por convênio médico e particular.",
    "O hospital de referência da sua região pode orientar.",
  ]) {
    assert.equal(ruleIds(text).includes("LGPD-002-METADADOS-EXAMES"), false, text);
  }
});

test("continua detectando hospital e convênio nomeados", () => {
  for (const text of ["Exame feito no Hospital Santa Marta.", "Hospital das Clínicas, leito 4.", "Convênio: Unimed."]) {
    assert.ok(ruleIds(text).includes("LGPD-002-METADADOS-EXAMES"), text);
  }
});

test("não confunde 'promoção da saúde' e 'autopromoção' com oferta comercial", () => {
  for (const text of ["Educação e promoção da saúde nas redes.", "Evite autopromoção no perfil."]) {
    assert.equal(ruleIds(text).includes("CFM-004-PROMOCAO-PRECO"), false, text);
  }
  assert.ok(ruleIds("Promoção de botox nesta semana!").includes("CFM-004-PROMOCAO-PRECO"));
});

test("aviso de identificação continua só como WARNING (estudantes não têm CRM)", () => {
  const result = HealthcareComplianceEngine.audit("Conteúdo educativo sobre hidratação.", { profession: "medico" });
  const finding = result.infractions.find((item) => item.ruleId === "CFM-000-IDENTIFICACAO");
  assert.equal(finding?.severity, "WARNING");
  assert.equal(result.isApproved, true);
});
