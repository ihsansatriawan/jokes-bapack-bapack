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

**Algorithm:** mulberry32 — a simple, fast, 32-bit seeded PRNG. No external dependencies. Since `Date.now()` returns a 53-bit number, truncate to 32 bits via `seed >>> 0` before passing to mulberry32.

**Shuffle:** Use Fisher-Yates (Knuth) shuffle with the seeded PRNG — not `.sort(() => random() - 0.5)` which produces biased results.

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
- Remove `getRandomJokes` (server-oriented, also had unused `keyword` param — keyword input was removed in earlier commit)
- Add `mulberry32(seed)` — returns a seeded random number generator
- Add `seededShuffle(array, seed)` — Fisher-Yates shuffle using mulberry32
- Add `getJokes(category?, count=5, seed)` — filter by category + seeded shuffle, returns joke strings
- Fallback: if category filter returns zero results, return jokes from all categories
- Export jokes data and types for client use

#### Modified: `src/app/page.tsx`
- Remove `fetch('/api/generate')` call
- Import `getJokes` directly from `lib/jokes.ts`
- `handleGenerate` calls `getJokes(category, 5, Date.now())` synchronously — preserve `overrideCategory` parameter pattern
- Remove `isLoading` and `error` states — interaction is now synchronous, cannot fail

#### Deleted: `src/app/api/generate/route.ts`
- No longer needed

#### New: `src/types/umami.d.ts`
- Global type declaration for `window.umami`

#### Modified: `src/app/layout.tsx`
- Add Umami tracker script tag (conditional on `NEXT_PUBLIC_UMAMI_WEBSITE_ID` env var)

#### Modified: `src/components/JokeCard.tsx`
- Add `umami.track('copy-joke', ...)` in copy handler
- Add `umami.track('share-whatsapp', ...)` in share handler

#### Unchanged
- `Header.tsx`, `CategoryChips.tsx`, `GenerateButton.tsx`, `EmptyState.tsx`, `constants.ts` — no changes required

### Event Tracking (Umami)

Use [Umami](https://umami.is) — privacy-focused, no cookies, GDPR compliant. Track three things:

#### 1. Page Views
- Automatic via Umami tracker script — no custom code needed
- Add script tag in `layout.tsx` with `data-website-id`

#### 2. Category Generate
Track which category is selected when user clicks "Generate":
```javascript
umami.track('generate-jokes', { category: selectedCategory || 'all' });
```

#### 3. Joke Copy & WhatsApp Share
Track which specific joke gets copied or shared:
```javascript
umami.track('copy-joke', { joke_id: id, joke_text: text.substring(0, 100) });
umami.track('share-whatsapp', { joke_id: id, joke_text: text.substring(0, 100) });
```
Truncate joke text to 100 chars (Umami string limit is 500, but keep it concise).

#### Setup

**Script installation** — add to `src/app/layout.tsx`:
```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="<WEBSITE_ID>" />
```
`WEBSITE_ID` comes from Umami dashboard after registering the site. Store as environment variable `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.

**TypeScript** — declare `umami` on `window` to avoid TS errors:
```typescript
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}
```

#### File Changes for Tracking

- **`src/app/layout.tsx`** — Add Umami script tag (conditional on env var being set)
- **`src/app/page.tsx`** — Add `umami.track('generate-jokes', ...)` in `handleGenerate`
- **`src/components/JokeCard.tsx`** — Add `umami.track('copy-joke', ...)` and `umami.track('share-whatsapp', ...)` in existing click handlers
- **`src/types/umami.d.ts`** — Global type declaration for `window.umami`

### Category Filtering

Category filtering remains as-is (exact match on `category` field). The logic moves from the API route to the client-side `getJokes` function. If no category is selected, all jokes are included.

### Result

- Click Generate → instant response, 0ms network latency
- Every click → different seed → different joke ordering
- Filter by category works as before
- Offline-capable after initial page load
- To update jokes: edit `jokes.json` and redeploy (matches existing curation workflow)
- Analytics: page views, popular categories, and most-shared jokes tracked via Umami
