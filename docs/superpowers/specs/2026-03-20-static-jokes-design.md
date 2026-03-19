# Static Jokes with Timestamp-based Seeded Random

## Problem

The app makes an unnecessary API round-trip (`POST /api/generate`) to fetch jokes that are already static data (~7KB, 40 jokes, max 200). This adds latency to what should be an instant interaction.

## Goal

Eliminate the API call by loading jokes directly in the client, while keeping the experience feeling personalized via timestamp-based seeded randomization.

## Design

### Data Loading

- Import `jokes.json` directly in client code (no API route)
- Delete `src/app/api/generate/route.ts`
- All filtering and randomization happens client-side
- Bundle impact: ~35KB raw (at 200 jokes max), ~5-8KB gzipped — negligible

### Timestamp-based Seeded Random

Each time the user clicks "Generate", `Date.now()` is used as a seed for a deterministic PRNG (mulberry32). This means:

- Different users clicking at different times get different joke orderings
- Each click produces a new seed (new millisecond) → new ordering
- Two users clicking at the exact same millisecond would get the same result — acceptable given the low probability

**Algorithm:** mulberry32 — a simple, fast, 32-bit seeded PRNG. No external dependencies.

**Flow:**
```
User clicks Generate
  → seed = Date.now()
  → filteredJokes = filter by selected category (or all)
  → shuffled = seededShuffle(filteredJokes, seed)
  → display first 5 jokes
```

### File Changes

#### Modified: `src/lib/jokes.ts`
- Remove server-oriented `getRandomJokes` export
- Add `seededShuffle(array, seed)` — pure function using mulberry32 PRNG
- Add `getJokes(category?, count?, seed?)` — filter by category + seeded shuffle, returns joke strings
- Export jokes data and types for client use

#### Modified: `src/app/page.tsx`
- Remove `fetch('/api/generate')` call
- Import `getJokes` directly from `lib/jokes.ts`
- `handleGenerate` calls `getJokes(category, 5, Date.now())` synchronously
- Remove loading state (`isLoading`) — interaction is now instant, no spinner needed

#### Deleted: `src/app/api/generate/route.ts`
- No longer needed

#### Unchanged
- `Header.tsx`, `CategoryChips.tsx`, `GenerateButton.tsx`, `JokeCard.tsx`, `EmptyState.tsx`, `constants.ts` — no changes required

### Category Filtering

Category filtering remains as-is (exact match on `category` field). The logic moves from the API route to the client-side `getJokes` function. If no category is selected, all jokes are included.

### Result

- Click Generate → instant response, 0ms network latency
- Every click → different seed → different joke ordering
- Filter by category works as before
- Offline-capable after initial page load
- To update jokes: edit `jokes.json` and redeploy (matches existing curation workflow)
