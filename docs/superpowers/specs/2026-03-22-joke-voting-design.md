# Joke Voting System — Design Spec

## Overview

Add a per-joke voting system to the Indonesian dad jokes generator. Users can vote each joke as "Receh" (funny/punny) or "Jayus" (forced/unfunny). Votes are stored client-side in sessionStorage and tracked via Umami analytics.

## Requirements

- Two vote buttons per joke: 😂 Receh and 😑 Jayus (emoji + label)
- Vote buttons positioned above the joke text as a reaction bar
- One vote per joke per session — after voting, buttons are locked
- Votes stored in `sessionStorage` (reset when tab closes)
- Votes tracked via Umami custom event for analytics aggregation
- No aggregated vote count displayed to users

## Data Flow

```
User clicks 😂 Receh on joke #5
  → save to sessionStorage: { "5": "receh" }
  → disable both buttons, highlight selected
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
  - `joke_text`: joke text, truncated to 100 characters
  - `category`: joke category (e.g., `"hewan"`, `"makanan"`)

## Files Changed

### `src/lib/jokes.ts`

- Add `category: string` to `JokeResult` interface
- Update `getJokes()` return mapping to include `category`

### `src/app/page.tsx`

- Pass `category` prop to `JokeCard` (from `JokeResult.category`)

### `src/components/JokeCard.tsx`

- Add `category: string` to `JokeCardProps`
- Add vote buttons (😂 Receh, 😑 Jayus) above joke text
- Read sessionStorage on mount to check existing vote for this joke
- On vote: save to sessionStorage, fire Umami event, lock buttons

No new files created.

## UI States

### Before Vote (default)

Two buttons side-by-side above joke text:

- `😂 Receh` — bg-white, border-2 border-pencil, clickable with hover effect
- `😑 Jayus` — bg-white, border-2 border-pencil, clickable with hover effect

### After Vote "Receh"

- `😂 Receh` — bg-accent, text-white, border-pencil (highlighted)
- `😑 Jayus` — opacity-40, cursor-not-allowed (disabled, muted)

### After Vote "Jayus"

- `😑 Jayus` — bg-ink, text-white, border-pencil (highlighted)
- `😂 Receh` — opacity-40, cursor-not-allowed (disabled, muted)

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
