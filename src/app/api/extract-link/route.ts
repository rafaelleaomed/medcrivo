import { NextRequest, NextResponse } from "next/server";
import { guardUser } from "@/lib/guard";

interface ExtractedLinkData {
  url: string;
  domain: string;
  title: string;
  description: string;
  clinicalTopic: string;
  sourceType: "journal" | "news" | "portal";
  suggestedCitation: {
    journal: string;
    year: number;
    doi?: string;
    takeaway: string;
  };
}

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".") && !h.includes(":")) return true;
  if (h.includes(":")) return h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80") || h.startsWith("::ffff");
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
}

export async function POST(req: NextRequest) {
  const blocked = await guardUser("extract", 20);
  if (blocked) return blocked;
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL inválida ou não fornecida" },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Formato de URL inválido. Use https://..." },
        { status: 400 }
      );
    }

    // Só http(s) em servidores públicos: evita que o servidor seja usado para ler a rede interna.
    if (!/^https?:$/.test(parsedUrl.protocol) || isPrivateHost(parsedUrl.hostname)) {
      return NextResponse.json({ success: false, error: "Use um link público começando com https://" }, { status: 400 });
    }

    const domain = parsedUrl.hostname.replace("www.", "");
    let title = "";
    let description = "";

    try {
      // Timeout de 6 segundos para evitar travamento em sites lentos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(trimmedUrl, {
        signal: controller.signal,
        redirect: "error", // não segue redirecionamentos (poderiam apontar para a rede interna)
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();

        // Extrai <title>
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();

        // Extrai OpenGraph title se existir
        const ogTitleMatch = html.match(
          /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
        ) || html.match(
          /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i
        );
        if (ogTitleMatch) title = ogTitleMatch[1].trim();

        // Extrai meta description ou og:description
        const ogDescMatch = html.match(
          /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
        ) || html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
        ) || html.match(
          /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i
        );
        if (ogDescMatch) description = ogDescMatch[1].trim();
      }
    } catch (fetchErr) {
      console.warn("Fetch direto da URL falhou ou expirou, inferindo do slug da URL:", fetchErr);
    }

    // Se o HTML não retornou título legível, inferimos a partir do pathname
    if (!title) {
      const rawSlug = parsedUrl.pathname
        .split("/")
        .filter(Boolean)
        .pop() || "";
      const cleanSlug = rawSlug
        .replace(/\.(ghtml|html?|php|asp|jsp)$/i, "")
        .replace(/[-_]/g, " ")
        .trim();

      title = cleanSlug.length > 3
        ? cleanSlug
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        : `Publicação em ${domain}`;
    }

    // Sanitização e decodificação básica de entidades HTML
    title = title
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    description = description
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    // Determina o tópico clínico limpo a partir do título
    let clinicalTopic = title
      .replace(/[-|–].*$/, "") // Remove " - Portal G1", " | CNN Brasil", etc.
      .trim();

    if (clinicalTopic.length < 5) {
      clinicalTopic = title;
    }

    // Identifica fonte
    let sourceType: ExtractedLinkData["sourceType"] = "news";
    let journalName = `Notícia Médica (${domain})`;

    if (domain.includes("thelancet.com")) {
      sourceType = "journal";
      journalName = "The Lancet";
    } else if (domain.includes("nejm.org")) {
      sourceType = "journal";
      journalName = "New England Journal of Medicine";
    } else if (domain.includes("nature.com")) {
      sourceType = "journal";
      journalName = "Nature Medicine";
    } else if (domain.includes("nih.gov") || domain.includes("pubmed")) {
      sourceType = "journal";
      journalName = "PubMed / NIH Index";
    } else if (domain.includes("scielo.org") || domain.includes("sciencedirect")) {
      sourceType = "journal";
      journalName = "SciELO / ScienceDirect";
    }

    const currentYear = new Date().getFullYear();
    const suggestedCitation = {
      journal: journalName,
      year: currentYear,
      // Sem DOI: não temos como verificá-lo a partir da página.
      takeaway: description || `Dados clínicos e achados reportados por ${domain} sobre ${clinicalTopic}.`,
    };

    const data: ExtractedLinkData = {
      url: trimmedUrl,
      domain,
      title,
      description,
      clinicalTopic,
      sourceType,
      suggestedCitation,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error instanceof Error && error.message) || "Erro desconhecido ao processar link",
      },
      { status: 500 }
    );
  }
}
