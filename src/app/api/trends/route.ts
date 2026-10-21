import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";
import { MEDICAL_SPECIALTIES, getSpecialtyById, TrendingTopic } from "@/data/medicalSpecialtiesData";

interface TrendsMCPResponse {
  search_term?: string;
  results?: Array<{
    status?: string;
    growth?: number;
    growth_unit?: string;
    direction?: string;
    period?: string;
  }>;
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("trends", 30);
  if (blocked) return blocked;
  try {
    const { specialtyId, specialtyName, keyword } = await req.json();

    const selectedSpecialty = specialtyId
      ? getSpecialtyById(specialtyId)
      : specialtyName
      ? getSpecialtyById(specialtyName)
      : MEDICAL_SPECIALTIES[0];

    const baseTopics: TrendingTopic[] = [...selectedSpecialty.trendingTopics];
    const apiKey = process.env.TRENDS_MCP_API_KEY;
    const mcpUrl = process.env.TRENDS_MCP_URL || "https://api.trendsmcp.ai/mcp";

    // Se temos a chave do TrendsMCP e um termo específico foi solicitado ou para o primeiro tópico
    if (apiKey) {
      const termToQuery = keyword || baseTopics[0]?.title.split(":")[0] || "medicina";

      try {
        const mcpRes = await fetch(mcpUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method: "tools/call",
            params: {
              name: "trends___get_growth",
              arguments: {
                keyword: termToQuery.substring(0, 45).toLowerCase(),
                source: "google search",
                percent_growth: ["30D"],
              },
            },
          }),
        });

        if (mcpRes.ok) {
          const mcpData = await mcpRes.json();
          const textContent = mcpData?.result?.content?.[0]?.text;
          if (textContent) {
            try {
              const parsedWrapper = JSON.parse(textContent);
              const body = typeof parsedWrapper.body === "string" ? JSON.parse(parsedWrapper.body) : parsedWrapper.body;
              const result = body?.results?.[0];

              if (result && result.status === "success" && typeof result.growth === "number") {
                const growthVal = result.growth;
                const formattedGrowth = `${growthVal >= 0 ? "+" : ""}${growthVal.toFixed(1)}% no Google (30D)`;

                // Atualiza o primeiro tópico ou adiciona o termo consultado com a métrica do TrendsMCP
                if (baseTopics.length > 0) {
                  baseTopics[0] = {
                    ...baseTopics[0],
                    growthIndicator: formattedGrowth,
                    badge: `🔥 Validado TrendsMCP (${formattedGrowth})`,
                  };
                }
              }
            } catch (pErr) {
              // Resiliente se a resposta tiver formato alternativo
            }
          }
        }
      } catch (err) {
        console.warn("TrendsMCP query bypass (contingência ativa):", err);
      }
    }

    return NextResponse.json({
      success: true,
      specialty: selectedSpecialty,
      trendingTopics: baseTopics,
      allSpecialties: MEDICAL_SPECIALTIES.map((s) => ({
        id: s.id,
        name: s.name,
        iconName: s.iconName,
        description: s.description,
      })),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error instanceof Error && error.message) || "Erro ao consultar tendências",
        trendingTopics: MEDICAL_SPECIALTIES[0].trendingTopics,
      },
      { status: 500 }
    );
  }
}
