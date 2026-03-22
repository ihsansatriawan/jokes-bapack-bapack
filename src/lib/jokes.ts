import jokesData from "@/data/jokes.json";

interface Joke {
  id: number;
  joke: string;
  category: string;
  keywords: string[];
}

export const allJokes: Joke[] = jokesData;

/** Mulberry32 — simple 32-bit seeded PRNG */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using seeded PRNG */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface JokeResult {
  id: number;
  joke: string;
  category: string;
}

export function getJokes(
  category?: string | null,
  count = 5,
  seed: number = Date.now()
): JokeResult[] {
  let filtered: Joke[] = allJokes;

  if (category) {
    filtered = allJokes.filter((j) => j.category === category);
  }

  // Fallback: if category has no jokes, use all
  if (filtered.length === 0) {
    filtered = allJokes;
  }

  const shuffled = seededShuffle(filtered, seed);
  return shuffled.slice(0, count).map((j) => ({ id: j.id, joke: j.joke, category: j.category }));
}
