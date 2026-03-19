import jokesData from "@/data/jokes.json";

interface Joke {
  id: number;
  joke: string;
  category: string;
  keywords: string[];
}

const allJokes: Joke[] = jokesData;

function shuffleAndPick(jokes: Joke[], count: number): string[] {
  const shuffled = [...jokes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((j) => j.joke);
}

export function getRandomJokes(
  category?: string,
  keyword?: string,
  count = 5
): string[] {
  let filtered = allJokes;

  if (category) {
    filtered = filtered.filter((j) => j.category === category);
  }

  if (keyword) {
    const lower = keyword.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.joke.toLowerCase().includes(lower) ||
        j.keywords.some((k) => k.toLowerCase().includes(lower))
    );
  }

  if (filtered.length === 0) {
    // Fallback: return random from all jokes if no match
    return shuffleAndPick(allJokes, count);
  }

  return shuffleAndPick(filtered, count);
}
