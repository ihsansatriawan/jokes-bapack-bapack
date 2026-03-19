export const CATEGORIES = [
  { id: "makanan", label: "Makanan", emoji: "🍔" },
  { id: "hewan", label: "Hewan", emoji: "🐔" },
  { id: "sekolah", label: "Sekolah", emoji: "🏫" },
  { id: "keluarga", label: "Keluarga", emoji: "👨‍👩‍👧" },
  { id: "kantor", label: "Kantor", emoji: "💼" },
  { id: "olahraga", label: "Olahraga", emoji: "⚽" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const VALID_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

export const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const FETCH_TIMEOUT_MS = 15_000;

export const SYSTEM_PROMPT = `Kamu adalah generator jokes bapak-bapak Indonesia. Buat jokes yang receh, berbasis pun/permainan kata, family-friendly, dan khas humor bapak-bapak.

Balas HANYA dengan JSON array berisi 5 string jokes. Tidak ada teks lain.
Contoh format: ["joke 1", "joke 2", "joke 3", "joke 4", "joke 5"]`;

export function buildUserPrompt(category?: string, keyword?: string): string {
  const parts = ["Buatkan 5 jokes bapak-bapak"];

  if (category && keyword) {
    parts.push(`tentang ${category} yang berhubungan dengan "${keyword}"`);
  } else if (category) {
    parts.push(`tentang ${category}`);
  } else if (keyword) {
    parts.push(`yang berhubungan dengan "${keyword}"`);
  } else {
    parts.push("tentang topik apa saja");
  }

  return parts.join(" ");
}
