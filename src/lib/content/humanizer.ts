const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bno vasto universo(?: da| de| do)?\b/gi, ""],
  [/é crucial ressaltar que\b/gi, ""],
  [/é crucial\b/gi, "é importante"],
  [/é fundamental(?: destacar| ressaltar)?\b/gi, "vale"],
  [/\bmergulhar(?: profundamente)?(?: em| no| na)?\b/gi, "analisar"],
  [/\bmergulhe(?: profundamente)?(?: em| no| na)?\b/gi, "analise"],
  [/\bdesvend(?:e|ar)\b/gi, "entenda"],
  [/\buma jornada fascinante\b/gi, "um processo"],
  [/\bo segredo definitivo\b/gi, "o ponto principal"],
  [/\bdivisor de águas\b/gi, "mudança importante"],
  [/\bno mundo de hoje\b/gi, "hoje"],
  [/\bem resumo,\s*/gi, "na prática, "],
  [/\bem resumo\b/gi, "na prática"],
  [/\bem conclusão,\s*/gi, ""],
  [/\bem conclusão[.!?](?:\s+|$)/gi, ""],
  [/\bem conclusão\b\s*/gi, ""],
  [/\bimperdível\b/gi, "útil"],
];

export const HUMANIZER_PROMPT_RULES = `Tom de voz humanizado:
- Escreva como uma pessoa brasileira falaria, com frases curtas e ritmo natural.
- Prefira palavras concretas. Corte abstrações, frases de consultoria e conclusões genéricas.
- Não use clichês de IA como "no vasto universo", "é crucial ressaltar", "mergulhar", "desvendar", "divisor de águas", "jornada fascinante", "em resumo" ou "transformador".
- Evite a fórmula "não é sobre X, é sobre Y", regras de três forçadas, perguntas retóricas respondidas logo depois e frases de efeito sem informação.
- Varie o tamanho das frases. Leia mentalmente em voz alta antes de responder.
- Ao simplificar, preserve dosagens, posologias, indicações, contraindicações e alertas clínicos relevantes.
- Mantenha a mensagem específica, simples e natural, sem inventar fatos.`;

export function humanizeText(text: string): string {
  let output = text;
  for (const [pattern, replacement] of REPLACEMENTS) output = output.replace(pattern, replacement);

  return output
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").replace(/^\s+|\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/(^|[.!?]\s+)([a-záàâãéêíóôõúç])/g, (_, start: string, letter: string) => `${start}${letter.toUpperCase()}`)
    .trim();
}

const TECHNICAL_FIELDS = new Set([
  "id",
  "framework",
  "template",
  "action",
  "keyword",
  "evidenceQuery",
  "imagePrompt",
  "imageUrl",
  "url",
  "doi",
  "model",
  "source",
  "format",
  "goal",
  "status",
  "profession",
  "tone",
  "createdAt",
  "updatedAt",
]);

function cloneAndHumanize(value: unknown, seen: WeakMap<object, unknown>, field?: string): unknown {
  if (typeof value === "string") return field && TECHNICAL_FIELDS.has(field) ? value : humanizeText(value);
  if (!value || typeof value !== "object") return value;

  const previous = seen.get(value);
  if (previous) return previous;

  if (Array.isArray(value)) {
    const output: unknown[] = [];
    seen.set(value, output);
    for (const item of value) output.push(cloneAndHumanize(item, seen, field));
    return output;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return value;

  const output = Object.create(prototype) as Record<string, unknown>;
  seen.set(value, output);
  for (const [key, item] of Object.entries(value)) {
    Object.defineProperty(output, key, {
      configurable: true,
      enumerable: true,
      value: cloneAndHumanize(item, seen, key),
      writable: true,
    });
  }
  return output;
}

export function humanizeGeneratedCopy<T>(value: T): T {
  return cloneAndHumanize(value, new WeakMap()) as T;
}
