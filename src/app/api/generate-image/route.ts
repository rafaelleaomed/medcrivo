import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, seed, width = 1080, height = 1080, topic = "", slideTitle = "" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt de imagem é obrigatório" },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim();
    const actualSeed = seed || Math.floor(Math.random() * 900000) + 100000;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Enriquecimento técnico para FLUX e Imagen (estilo editorial de alta fidelidade)
    const enrichedPrompt = `${cleanPrompt}, professional editorial photography, cinematic soft studio lighting, ultra-detailed 8k, modern clean healthcare aesthetic, photorealistic, no text, no watermark, no syringe or injection unless explicitly mentioned`;

    // 2. Se GEMINI_API_KEY estiver configurada, tenta Google Imagen 3 oficial
    if (geminiKey) {
      try {
        const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`;
        const response = await fetch(imagenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [
              {
                prompt: enrichedPrompt,
              },
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: "1:1",
              outputMimeType: "image/jpeg",
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const base64Image = data?.predictions?.[0]?.bytesBase64Encoded;
          if (base64Image) {
            return NextResponse.json({
              success: true,
              imageUrl: `data:image/jpeg;base64,${base64Image}`,
              provider: "gemini-imagen-3",
              prompt: cleanPrompt,
              enrichedPrompt,
              seed: actualSeed,
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Falha no Google Imagen 3, migrando para FLUX.1:", geminiErr);
      }
    }

    // 3. Motor Primário Gratuito de Alta Fidelidade: FLUX.1 via Pollinations
    // Custo zero, sem rate limit rígido, renderização fotorrealista 1:1 contextual
    const encodedPrompt = encodeURIComponent(enrichedPrompt);
    const fluxImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${actualSeed}&nologo=true&model=flux`;

    return NextResponse.json({
      success: true,
      imageUrl: fluxImageUrl,
      provider: "flux-1-pollinations",
      prompt: cleanPrompt,
      enrichedPrompt,
      seed: actualSeed,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error instanceof Error && error.message) || "Erro ao gerar imagem" },
      { status: 500 }
    );
  }
}
