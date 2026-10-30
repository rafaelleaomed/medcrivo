import assert from "node:assert/strict";
import test from "node:test";
import { humanizeGeneratedCopy, humanizeText } from "../src/lib/content/humanizer.ts";

test("humanizer: remove clichês de IA sem destruir parágrafos", () => {
  const input = "No vasto universo da saúde, é crucial ressaltar que devemos mergulhar neste tema.\n\nEm conclusão, este cuidado merece atenção.";
  const output = humanizeText(input);

  assert.doesNotMatch(output, /vasto universo|crucial|mergulh|em conclusão/i);
  assert.match(output, /\n\n/);
  assert.match(output, /saúde/i);
});

test("humanizer: revisa textos aninhados sem alterar o objeto original", () => {
  const input = {
    title: "Uma jornada fascinante",
    slides: [{ headline: "Desvende o segredo definitivo", body: "É fundamental entender." }],
    untouched: 42,
  };

  const output = humanizeGeneratedCopy(input);

  assert.notEqual(output, input);
  assert.notEqual(output.slides, input.slides);
  assert.doesNotMatch(JSON.stringify(output), /jornada fascinante|desvende|segredo definitivo|fundamental/i);
  assert.equal(output.untouched, 42);
  assert.equal(input.title, "Uma jornada fascinante");
});

test("humanizer: mantém texto natural que já está bom", () => {
  const input = "Dá para gerar uma tela em minutos. Mas isso ainda não é um produto.";
  assert.equal(humanizeText(input), input);
});

test("humanizer: não cria vírgula antes do ponto", () => {
  assert.equal(humanizeText("Em resumo."), "Na prática.");
});

test("humanizer: preserva referências circulares sem estourar a pilha", () => {
  const input = { title: "Uma jornada fascinante", self: null };
  input.self = input;

  const output = humanizeGeneratedCopy(input);
  assert.equal(output.title, "Um processo");
  assert.equal(output.self, output);
});

test("humanizer: mantém termos técnicos que podem ter sentido clínico", () => {
  const input = "O transformador de isolamento não é um tratamento revolucionário.";
  assert.equal(humanizeText(input), input);
});

test("humanizer: mantém __proto__ como dado sem alterar o protótipo global", () => {
  const input = JSON.parse('{"__proto__":{"polluted":true},"title":"Uma jornada fascinante"}');
  const output = humanizeGeneratedCopy(input);

  assert.equal({}.polluted, undefined);
  assert.deepEqual(output.__proto__, { polluted: true });
  assert.equal(output.title, "Um processo");
});

test("humanizer: preserva campos técnicos e humaniza apenas a cópia exibida", () => {
  const input = {
    framework: "uma jornada fascinante",
    action: "uma jornada fascinante",
    template: "uma jornada fascinante",
    keyword: "SEGREDO",
    evidenceQuery: "uma jornada fascinante",
    headline: "Uma jornada fascinante",
    body: "Desvende o segredo definitivo",
  };
  const output = humanizeGeneratedCopy(input);
  assert.equal(output.framework, input.framework);
  assert.equal(output.action, input.action);
  assert.equal(output.template, input.template);
  assert.equal(output.keyword, input.keyword);
  assert.equal(output.evidenceQuery, input.evidenceQuery);
  assert.equal(output.headline, "Um processo");
  assert.equal(output.body, "Entenda o ponto principal");
});
