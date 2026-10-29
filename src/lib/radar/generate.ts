import { z } from "zod";
import { askClaudeStructured, describeProfessional, EDITORIAL_RULES, withFallback } from "@/lib/creator/ai";
import type { DoctorProfile } from "@/lib/profile";
import {
  fallbackOpportunities,
  RadarOpportunitySchema,
  selectFreshOpportunities,
  type GoogleTrend,
  type RadarOpportunity,
} from "./radar";

const GeneratedRadarSchema = z.object({ opportunities: z.array(RadarOpportunitySchema).min(4).max(8) });

function trendPayload(trends: GoogleTrend[]) {
  return trends.slice(0, 20).map((trend) => ({
    title: trend.title,
    traffic: trend.traffic,
    publishedAt: trend.publishedAt,
    context: trend.newsTitles.slice(0, 3),
  }));
}

export async function generateRadar(
  profile: DoctorProfile,
  trends: GoogleTrend[],
  excludedTitles: string[],
  now = new Date().toISOString(),
): Promise<{ opportunities: RadarOpportunity[]; mode: "ai" | "fallback"; note?: string }> {
  const fallback = () => ({ opportunities: fallbackOpportunities(profile, excludedTitles, now, 6) });
  const result = await withFallback(
    "Radar editorial",
    () =>
      askClaudeStructured({
        schema: GeneratedRadarSchema,
        maxTokens: 3500,
        system: `${EDITORIAL_RULES}

Você é o radar editorial da MedCrivo. Adapte uma estratégia de inteligência de conteúdo para saúde:
- combine sinais atuais do Google Trends Brasil com perfil profissional, interesses e dores reais do público;
- não force relação com uma tendência geral sem vínculo responsável com saúde ou com o perfil;
- varie pilares, formatos e objetivos para não entregar sempre as mesmas pautas;
- transforme sinais em oportunidade editorial: gancho, ângulo, motivo para falar agora, formato e objetivo;
- use source="google_trends" somente quando trendTitle for exatamente um título fornecido; caso contrário use source="perfil";
- não invente notícia, dado, estudo, prevalência, diagnóstico ou recomendação clínica;
- score avalia relevância para o perfil, atualidade, utilidade e novidade, de zero a cem;
- títulos já vistos são proibidos, inclusive paráfrases óbvias.

A resposta é pauta para revisão humana. Não é publicação nem orientação médica individual.`,
        messages: [
          {
            role: "user",
            content: `${describeProfessional(profile)}
Interesses: ${profile.interests.join("; ") || "não informados"}.
Dores do público: ${profile.audiencePains.join("; ") || "não informadas"}.
Gerado em: ${now}.
Títulos a evitar: ${excludedTitles.join(" | ") || "nenhum"}.

Google Trends Brasil (dados brutos; descarte o que for irrelevante):
${JSON.stringify(trendPayload(trends))}

Crie seis oportunidades diferentes. Pelo menos duas devem vir do perfil caso os sinais atuais estejam fracos ou desconectados da saúde.`,
          },
        ],
      }),
    fallback,
  );

  const fresh = selectFreshOpportunities(result.data.opportunities, excludedTitles, 6);
  const filler = fallbackOpportunities(profile, [...excludedTitles, ...fresh.map((item) => item.title)], now, 6 - fresh.length);
  return {
    opportunities: [...fresh, ...filler].slice(0, 6),
    mode: result.generatedBy.source === "heuristica" ? "fallback" : "ai",
    note: result.generatedBy.fallbackReason,
  };
}
