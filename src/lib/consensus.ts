/**
 * MedCrivo Studio - Integração Científica com a Consensus AI API
 * Consulta mais de 400 milhões de artigos científicos revisados por pares.
 * Prioridade: Meta-análises e Randomized Controlled Trials (RCTs).
 */

export interface ScientificPaper {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url: string;
  takeaway: string;
  studyType?: string;
  citationAbnt: string;
}

export interface ScientificEvidence {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  takeaway: string;
  evidenceLevel?: string;
  authors?: string[];
  url?: string;
  citationAbnt?: string;
}

export interface ConsensusSearchResponse {
  papers: ScientificPaper[];
  summary: string;
}

interface ConsensusApiPaper {
  title: string;
  authors?: string[];
  journal_name?: string;
  publish_year?: number;
  doi?: string;
  url: string;
  takeaway?: string;
  study_type?: string;
}

export class ConsensusScientificEngine {

  /**
   * Realiza busca estruturada por evidências no Consensus AI
   */
  public static async searchEvidence(query: string, studyTypes: string = "meta-analysis,rct"): Promise<ScientificPaper[]> {
    const apiKey = process.env.CONSENSUS_API_KEY;
    if (!apiKey) {
      console.warn("CONSENSUS_API_KEY não configurada: nenhuma evidência será anexada.");
      return [];
    }
    try {
      const url = new URL("https://api.consensus.app/v1/search");
      url.searchParams.append("query", query);
      // A API exige um parâmetro study_types por tipo (não aceita lista separada por vírgula).
      for (const type of studyTypes.split(",")) url.searchParams.append("study_types", type.trim());
      url.searchParams.append("year_min", "2018");
      url.searchParams.append("page_size", "5");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Sem evidência real não anexamos referência: conteúdo médico não pode citar estudo inexistente.
        console.warn(`Consensus API retornou status ${response.status}. Nenhuma evidência anexada.`);
        return [];
      }

      const data = await response.json();
      
      return ((data.results || []) as ConsensusApiPaper[]).map((p) => {
        const firstAuthor = p.authors?.[0];
        const abnt = [firstAuthor ? `${firstAuthor.toUpperCase()} et al.` : null, `${p.title}.`, p.journal_name ? `${p.journal_name},` : null, p.publish_year ? `${p.publish_year}.` : null, p.doi ? `DOI: ${p.doi}` : null]
          .filter(Boolean)
          .join(" ");
        return {
          title: p.title,
          authors: p.authors || [],
          journal: p.journal_name || "",
          year: p.publish_year || 0,
          doi: p.doi,
          url: p.url,
          takeaway: p.takeaway || "",
          studyType: p.study_type,
          citationAbnt: abnt,
        };
      });
    } catch (err) {
      console.error("Erro na busca de evidências no Consensus AI:", err);
      return [];
    }
  }
}
