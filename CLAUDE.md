# CLAUDE.md — Project Context for AI Assistants

## Project Overview

**Jokes Bapak-Bapak** — Indonesian dad jokes generator. Next.js 16 app, client-side only (statically exported). No backend, no database.

## Tech Stack

- **Framework:** Next.js 16 (React 19, TypeScript)
- **Styling:** Tailwind CSS 3 with custom design tokens (hand-drawn/sketch aesthetic)
- **Icons:** lucide-react
- **Analytics:** Umami (privacy-focused, no cookies)
- **Runtime requirement:** Node.js ≥ 20.9.0

## Key Architecture Decisions

### No API Routes
The `/api/generate` route was intentionally deleted. All joke logic runs client-side. Do NOT add API routes for jokes.

### Client-side Joke Loading
`src/data/jokes.json` is imported directly into the bundle at build time. Max ~200 jokes (~35KB raw, ~5-8KB gzipped) — this is intentional and performant.

### Seeded Randomization
`getJokes()` uses mulberry32 PRNG with `Date.now()` as seed. Each click produces a unique ordering per user/moment. Do NOT replace with `Math.random()`.

## File Map

```
src/
├── app/
│   ├── layout.tsx          # Root layout — Umami script tag injected here
│   ├── page.tsx            # Main page — calls getJokes() directly, tracks Umami events
│   └── globals.css         # Tailwind base + custom animations (wobble, fade-in-up)
├── components/
│   ├── Header.tsx          # Title + decorative SVG doodles
│   ├── CategoryChips.tsx   # Category filter buttons (hewan, makanan, sekolah, etc.)
│   ├── GenerateButton.tsx  # Single button, NO loading state (generate is synchronous)
│   ├── JokeCard.tsx        # Joke display + copy-to-clipboard + WhatsApp share + Umami tracking
│   └── EmptyState.tsx      # Shown before first generate
├── lib/
│   ├── jokes.ts            # Core: mulberry32 PRNG, seededShuffle, getJokes()
│   └── constants.ts        # CATEGORIES array, CategoryId type, VALID_CATEGORY_IDS
├── data/
│   └── jokes.json          # 40 jokes (max ~200), curated manually
└── types/
    └── umami.d.ts          # Global window.umami type declaration
```

## Data Flow

```
User clicks Generate
  → handleGenerate() in page.tsx
  → getJokes(category, 5, Date.now()) — synchronous, no network
  → seededShuffle(filtered jokes, seed) using mulberry32
  → setJokes(result)  →  render JokeCard × 5
  → umami.track('generate-jokes', { category })
```

## Joke Data Schema

Each joke in `src/data/jokes.json`:
```json
{
  "id": 1,
  "joke": "...",
  "category": "hewan",
  "keywords": ["ayam", "uang"]
}
```

Categories: `hewan`, `makanan`, `sekolah`, `keluarga`, `kantor`, `olahraga`

## Analytics (Umami)

Three events tracked:
- **Page views** — automatic via Umami script
- **`generate-jokes`** — `{ category: "hewan" | "all" }` — fired on every generate
- **`copy-joke`** — `{ joke_id: number, joke_text: string }` — fired on clipboard copy
- **`share-whatsapp`** — `{ joke_id: number, joke_text: string }` — fired on WA share

To enable: set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` env var. Tracking is silently disabled when not set.

## Commands

```bash
npm run dev      # development server (requires Node ≥ 20.9.0)
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check
```

## Adding Jokes

Edit `src/data/jokes.json` directly. Each joke needs `id`, `joke`, `category`, `keywords`. Redeploy after editing. No code changes needed.

## Design System

Custom Tailwind classes (defined in `globals.css`):
- `wobbly`, `wobbly-2`, `wobbly-3`, `wobbly-4`, `wobbly-md` — border-radius variations for hand-drawn feel
- `shadow-hard`, `shadow-hard-sm`, `shadow-hard-lg` — offset box shadows
- `animate-fade-in-up`, `stagger-1` through `stagger-5` — entrance animations
- Colors: `pencil` (dark), `paper` (cream), `accent` (red-orange), `muted`, `ink`
