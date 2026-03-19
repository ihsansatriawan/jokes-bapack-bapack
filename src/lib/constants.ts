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
