import {
  OPENROUTER_URL,
  OPENROUTER_MODEL,
  FETCH_TIMEOUT_MS,
  SYSTEM_PROMPT,
  buildUserPrompt,
} from "./constants";

export async function generateJokes(
  category?: string,
  keyword?: string
): Promise<string[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(category, keyword) },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in OpenRouter response");
    }

    // Parse JSON array from response — handle possible markdown code blocks
    const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const jokes = JSON.parse(cleaned);

    if (!Array.isArray(jokes)) {
      throw new Error("Response is not an array");
    }

    return jokes.filter((j: unknown) => typeof j === "string" && j.length > 0);
  } finally {
    clearTimeout(timeout);
  }
}
