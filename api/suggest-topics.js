/**
 * Função serverless (Vercel) que usa a API da Anthropic com busca na web
 * para sugerir pautas atuais sobre branding e design.
 *
 * Requer a variável de ambiente ANTHROPIC_API_KEY configurada no Vercel
 * (Project Settings → Environment Variables). Essa chave NUNCA é exposta
 * ao navegador — só existe aqui, no servidor.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "ANTHROPIC_API_KEY não configurada no servidor.",
    });
    return;
  }

  try {
    const systemPrompt = `Você é um assistente editorial da Kronica, um estúdio de branding e design estratégico no Brasil. Sua tarefa é sugerir pautas atuais e relevantes para uma newsletter/blog voltada a designers e profissionais de branding, com base em tendências e notícias reais e recentes do mundo do design e das marcas.

Use a busca na web para encontrar de 3 a 5 assuntos/tendências/notícias REAIS e ATUAIS sobre branding, design gráfico, identidade visual ou o mercado criativo.

Para cada sugestão, gere:
- title: um título chamativo para o artigo (em português do Brasil)
- excerpt: um resumo de 1-2 frases (em português do Brasil)
- content: um rascunho inicial do artigo em Markdown (3-5 parágrafos, com 1-2 subtítulos usando ##), em português do Brasil, com a perspectiva e tom de voz de um estúdio de branding experiente — não um resumo genérico de notícia, mas uma reflexão com ponto de vista
- tags: lista de 2-4 tags relevantes (em português do Brasil)

Responda APENAS com um JSON válido neste formato, sem nenhum texto antes ou depois, sem blocos de código markdown:
{"suggestions": [{"title": "...", "excerpt": "...", "content": "...", "tags": ["...", "..."]}]}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content:
              "Busque tendências e notícias atuais sobre branding e design, e gere as sugestões de pauta conforme instruído.",
          },
        ],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Erro na API da Anthropic: ${errText}` });
      return;
    }

    const data = await response.json();

    const textBlocks = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    let cleaned = textBlocks.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    const parsed = JSON.parse(cleaned);

    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido ao gerar sugestões.",
    });
  }
}
