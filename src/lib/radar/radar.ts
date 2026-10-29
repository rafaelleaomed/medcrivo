import { z } from "zod";

const enumToken = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(
    (value: unknown) => (typeof value === "string" ? value.trim().toLocaleLowerCase("pt-BR").replace(/[.!?;:,]+$/g, "") : value),
    z.enum(values),
  );

export const RadarOpportunitySchema = z.object({
  title: z.string().trim().min(4).max(100),
  hook: z.string().trim().min(3).max(180),
  angle: z.string().trim().min(3).max(300),
  whyNow: z.string().trim().min(3).max(240),
  format: enumToken(["carrossel", "reel", "stories", "post"]),
  goal: enumToken(["educar", "engajar", "converter", "autoridade"]),
  source: enumToken(["google_trends", "perfil"]),
  trendTitle: z.string().trim().max(120).optional(),
  score: z.number().int().min(0).max(100),
});

export const RadarResponseSchema = z.object({
  opportunities: z.array(RadarOpportunitySchema).min(1).max(8),
  generatedAt: z.string().datetime(),
  trendsUpdatedAt: z.string().nullable(),
  trendCount: z.number().int().nonnegative(),
  mode: z.enum(["ai", "fallback"]),
  note: z.string().max(240).optional(),
});

export type RadarOpportunity = z.infer<typeof RadarOpportunitySchema>;
export type RadarResponse = z.infer<typeof RadarResponseSchema>;

export type GoogleTrend = {
  title: string;
  traffic: string;
  publishedAt: string;
  newsTitles: string[];
  newsUrls: string[];
};

type RadarProfile = {
  specialty?: string;
  interests?: string[];
  audiencePains?: string[];
};

const entities: Record<string, string> = {
  amp: "&",
  apos: "'",
  quot: '"',
  lt: "<",
  gt: ">",
};

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(x?[0-9a-f]+);/gi, (_, code: string) => {
      const radix = code.toLowerCase().startsWith("x") ? 16 : 10;
      const digits = radix === 16 ? code.slice(1) : code;
      const point = Number.parseInt(digits, radix);
      return Number.isFinite(point) ? String.fromCodePoint(point) : _;
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => entities[name.toLowerCase()] ?? match)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function tags(block: string, name: string): string[] {
  return [...block.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "gi"))]
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
}

export function normalizeTopic(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function topicFingerprint(value: string): string {
  return [...new Set(normalizeTopic(value).split(" ").filter(Boolean))].sort().join(" ");
}

export function parseGoogleTrendsRss(xml: string): GoogleTrend[] {
  const found: GoogleTrend[] = [];
  const seen = new Set<string>();
  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const block = match[1];
    const title = tag(block, "title");
    const key = normalizeTopic(title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    found.push({
      title,
      traffic: tag(block, "ht:approx_traffic"),
      publishedAt: tag(block, "pubDate"),
      newsTitles: tags(block, "ht:news_item_title"),
      newsUrls: tags(block, "ht:news_item_url"),
    });
  }
  return found;
}

export async function fetchGoogleTrends(): Promise<GoogleTrend[]> {
  const response = await fetch("https://trends.google.com/trending/rss?geo=BR", {
    headers: { "User-Agent": "MedCrivo/1.0 (+https://medcrivo-two.vercel.app)" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Google Trends respondeu ${response.status}`);
  return parseGoogleTrendsRss(await response.text());
}

export function selectFreshOpportunities(
  opportunities: RadarOpportunity[],
  excludedTitles: string[],
  limit = 6,
): RadarOpportunity[] {
  const excluded = new Set(excludedTitles.map(normalizeTopic).filter(Boolean));
  const excludedFingerprints = new Set(excludedTitles.map(topicFingerprint).filter(Boolean));
  const seen = new Set<string>();
  const seenFingerprints = new Set<string>();
  return opportunities
    .filter((item) => {
      const key = normalizeTopic(item.title);
      const fingerprint = topicFingerprint(item.title);
      if (!key || excluded.has(key) || seen.has(key) || excludedFingerprints.has(fingerprint) || seenFingerprints.has(fingerprint)) return false;
      seen.add(key);
      seenFingerprints.add(fingerprint);
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

const fallbackFrames = [
  { label: "O sinal que merece contexto", format: "carrossel", goal: "educar" },
  { label: "O erro comum na rotina", format: "reel", goal: "engajar" },
  { label: "Perguntas que chegam ao consultório", format: "stories", goal: "engajar" },
  { label: "Quando procurar avaliação", format: "carrossel", goal: "educar" },
  { label: "Mito ou cuidado válido", format: "reel", goal: "autoridade" },
  { label: "Como se preparar para a consulta", format: "post", goal: "converter" },
  { label: "O que observar sem autodiagnóstico", format: "carrossel", goal: "educar" },
  { label: "Bastidor de uma boa decisão clínica", format: "reel", goal: "autoridade" },
  { label: "O que muda de pessoa para pessoa", format: "carrossel", goal: "educar" },
  { label: "Hábitos que confundem os sintomas", format: "stories", goal: "engajar" },
  { label: "A dúvida que vale levar ao profissional", format: "post", goal: "converter" },
  { label: "Informação útil sem alarmismo", format: "reel", goal: "autoridade" },
] as const;

function profileThemes(profile: RadarProfile): string[] {
  const values = [profile.specialty, ...(profile.interests ?? []), ...(profile.audiencePains ?? [])]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  return [...new Map(values.map((value) => [normalizeTopic(value), value])).values()];
}

function hash(value: string): number {
  let result = 0;
  for (const char of value) result = (result * 31 + char.codePointAt(0)!) >>> 0;
  return result;
}

export function fallbackOpportunities(
  profile: RadarProfile,
  excludedTitles: string[] = [],
  now = new Date().toISOString(),
  limit = 6,
): RadarOpportunity[] {
  const themes = profileThemes(profile);
  const subjects = [...new Map(
    [...themes, "educação em saúde", "prevenção", "rotina de cuidado"].map((value) => [normalizeTopic(value), value]),
  ).values()];
  const candidates = fallbackFrames.flatMap((frame, frameIndex) => subjects.map((subject, subjectIndex) => ({
    title: `${frame.label}: ${subject}`,
    hook: `${frame.label} em linguagem simples, sem susto e sem promessa.`,
    angle: `Explique ${subject} por uma dúvida real do público e termine com orientação prática segura.`,
    whyNow: "Pauta renovada a partir do perfil editorial enquanto nenhum sinal atual do Google Trends se mostrou relevante.",
    format: frame.format,
    goal: frame.goal,
    source: "perfil" as const,
    score: 72 - ((frameIndex + subjectIndex) % 12),
  } satisfies RadarOpportunity)));
  const slot = now.slice(0, 13);
  const offset = hash(`${slot}:${subjects.join("|")}`) % candidates.length;
  const rotated = [...candidates.slice(offset), ...candidates.slice(0, offset)];
  return selectFreshOpportunities(rotated, excludedTitles, limit);
}
