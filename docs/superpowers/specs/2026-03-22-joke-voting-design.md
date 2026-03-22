# Joke Voting System — Design Spec

## Overview

Add a per-joke voting system to the Indonesian dad jokes generator. Users can vote each joke as "Receh" (funny/punny) or "Jayus" (forced/unfunny). Votes are stored client-side in sessionStorage and tracked via Umami analytics.

## Requirements

- Two vote buttons per joke: 😂 Receh and 😑 Jayus (emoji + label)
- Vote buttons positioned above the joke text as a reaction bar (deliberate design choice — user votes before reading further, encouraging gut-reaction voting)
- One vote per joke per session — after voting, buttons are locked
- Votes stored in `sessionStorage` (reset when tab closes)
- Votes tracked via Umami custom event for analytics aggregation
- No aggregated vote count displayed to users

## Data Flow

```
User clicks 😂 Receh on joke #5
  → save to sessionStorage: { "5": "receh" }
  → set disabled={true} on both buttons, highlight selected
  → umami.track("vote-joke", {
      vote_type: "receh",
      joke_text: "Kenapa sapi perah selalu tenang?..." (truncated 100 chars),
      category: "hewan"
    })
```

### Storage

- **Key**: `"joke-votes"`
- **Value**: JSON object `{ [jokeId: string]: "receh" | "jayus" }`
- **Scope**: sessionStorage — per-tab, clears on tab close

### Umami Event

- **Event name**: `vote-joke`
- **Payload**:
  - `vote_type`: `"receh"` | `"jayus"`
  - `joke_text`: joke text, truncated to 100 characters (intentionally no joke_id — analytics keyed by text)
  - `category`: joke category (e.g., `"hewan"`, `"makanan"`)

## Files Changed

### `src/lib/jokes.ts`

- Add `category: string` to the `JokeResult` interface (the `Joke` interface already has it)
- Include `j.category` in the `.map()` return inside `getJokes()`

### `src/app/page.tsx`

- Pass `category` prop to `JokeCard` (from `JokeResult.category`)

### `src/components/JokeCard.tsx`

- Add `category: string` to `JokeCardProps`
- Add vote buttons (😂 Receh, 😑 Jayus) above joke text
- Read sessionStorage inside `useEffect` on mount (guarded with `typeof window !== "undefined"`, consistent with existing patterns) to check existing vote for this joke
- On vote: save to sessionStorage, fire Umami event, lock buttons

No new files created.

## Re-generate Behavior

When user clicks "Generate" and a previously-voted joke reappears in the new batch, the vote state persists from sessionStorage. The `useEffect` reads sessionStorage using the joke ID, so the component correctly shows the locked/highlighted state even after re-render. The `useEffect` dependency array includes `jokeId` to handle cases where React reuses the component instance with a different joke.

## UI States

### Before Vote (default)

Two buttons side-by-side above joke text:

- `😂 Receh` — bg-white, border-2 border-pencil, clickable with hover effect
- `😑 Jayus` — bg-white, border-2 border-pencil, clickable with hover effect

### After Vote "Receh"

- `😂 Receh` — bg-accent, text-white, border-pencil (highlighted), `disabled={true}`
- `😑 Jayus` — opacity-40, `disabled={true}` (disabled, muted)

### After Vote "Jayus"

- `😑 Jayus` — bg-ink, text-white, border-pencil (highlighted), `disabled={true}`
- `😂 Receh` — opacity-40, `disabled={true}` (disabled, muted)

## Accessibility

- Vote buttons use `disabled={true}` attribute (not just CSS) when locked — ensures keyboard and screen reader users cannot interact
- `aria-label` on each button: `"Vote receh"` / `"Vote jayus"` (before vote), `"Voted receh"` / `"Voted jayus"` (after vote)

## Styling

All vote buttons follow existing design system:

- Wobbly border-radius variants
- `border-2 border-pencil`
- `shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]`
- Hover: translate + shadow reduction (same as Copy/Share buttons)
- Hand-drawn sketch aesthetic consistent with rest of app

## Out of Scope

- No aggregated vote display to users
- No backend / database
- No API routes
- No global leaderboard
- No vote editing after submission (locked per session)
