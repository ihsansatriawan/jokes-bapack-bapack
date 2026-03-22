# Joke Voting System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-joke Receh/Jayus voting buttons with sessionStorage persistence and Umami analytics tracking.

**Architecture:** Three files modified — `jokes.ts` exposes `category` in `JokeResult`, `page.tsx` passes it through, `JokeCard.tsx` adds vote UI with sessionStorage + Umami. No new files.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS 3, sessionStorage, Umami analytics

**Spec:** `docs/superpowers/specs/2026-03-22-joke-voting-design.md`

---

### Task 1: Add `category` to JokeResult

**Files:**
- Modify: `src/lib/jokes.ts:34-37` (JokeResult interface)
- Modify: `src/lib/jokes.ts:56` (getJokes map return)

- [ ] **Step 1: Add `category` to `JokeResult` interface**

In `src/lib/jokes.ts`, change:

```typescript
export interface JokeResult {
  id: number;
  joke: string;
}
```

To:

```typescript
export interface JokeResult {
  id: number;
  joke: string;
  category: string;
}
```

- [ ] **Step 2: Include `category` in `getJokes()` return mapping**

In `src/lib/jokes.ts`, change line 56:

```typescript
return shuffled.slice(0, count).map((j) => ({ id: j.id, joke: j.joke }));
```

To:

```typescript
return shuffled.slice(0, count).map((j) => ({ id: j.id, joke: j.joke, category: j.category }));
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/jokes.ts
git commit -m "feat: add category to JokeResult interface"
```

---

### Task 2: Add voting UI to JokeCard + wire up page.tsx

This task updates both `JokeCard.tsx` (accept `category` prop, add vote UI) and `page.tsx` (pass `category`) in one commit to avoid an intermediate broken TypeScript state.

**Files:**
- Modify: `src/components/JokeCard.tsx`
- Modify: `src/app/page.tsx:59`

- [ ] **Step 1: Update JokeCard imports, props, and signature**

In `src/components/JokeCard.tsx`, **replace** line 3:

```tsx
import { useState } from "react";
```

With:

```tsx
import { useState, useEffect } from "react";
```

Then change the `JokeCardProps` interface (lines 13-17):

```typescript
interface JokeCardProps {
  jokeId: number;
  joke: string;
  index: number;
}
```

To:

```typescript
interface JokeCardProps {
  jokeId: number;
  joke: string;
  category: string;
  index: number;
}
```

Then update the destructuring (line 19):

```typescript
export default function JokeCard({ jokeId, joke, index }: JokeCardProps) {
```

To:

```typescript
export default function JokeCard({ jokeId, joke, category, index }: JokeCardProps) {
```

- [ ] **Step 2: Add vote state and sessionStorage effect**

After the existing `const [copied, setCopied] = useState(false);` line, add:

```typescript
const [vote, setVote] = useState<"receh" | "jayus" | null>(null);

useEffect(() => {
  if (typeof window === "undefined") return;
  try {
    const stored = sessionStorage.getItem("joke-votes");
    if (stored) {
      const votes = JSON.parse(stored);
      setVote(votes[jokeId] ?? null);
    }
  } catch {
    // sessionStorage unavailable — ignore
  }
}, [jokeId]);
```

- [ ] **Step 3: Add vote handler function**

After the `handleShareWA` function, add:

```typescript
function handleVote(type: "receh" | "jayus") {
  if (vote) return;
  setVote(type);
  try {
    const stored = sessionStorage.getItem("joke-votes");
    const votes = stored ? JSON.parse(stored) : {};
    votes[jokeId] = type;
    sessionStorage.setItem("joke-votes", JSON.stringify(votes));
  } catch {
    // sessionStorage unavailable — ignore
  }
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track("vote-joke", {
      vote_type: type,
      joke_text: joke.substring(0, 100),
      category,
    });
  }
}
```

- [ ] **Step 4: Add vote buttons above joke text in JSX**

In the return JSX, after the thumbtack `div` (line 73) and before the `<p>` joke text (line 75), add:

```tsx
{/* Vote buttons */}
<div className="flex gap-2 mb-3">
  <button
    type="button"
    onClick={() => handleVote("receh")}
    disabled={vote !== null}
    aria-label={vote === "receh" ? "Voted receh" : "Vote receh"}
    className={`wobbly-2 flex-1 flex items-center justify-center gap-1.5 border-2 border-pencil
      px-3 py-1.5 font-body text-sm
      shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]
      transition-all duration-100
      ${vote === "receh"
        ? "bg-accent text-white"
        : vote === "jayus"
          ? "opacity-40 cursor-not-allowed"
          : "bg-white text-pencil cursor-pointer hover:bg-accent hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(45,45,45,0.15)]"
      }`}
  >
    😂 Receh
  </button>
  <button
    type="button"
    onClick={() => handleVote("jayus")}
    disabled={vote !== null}
    aria-label={vote === "jayus" ? "Voted jayus" : "Vote jayus"}
    className={`wobbly-3 flex-1 flex items-center justify-center gap-1.5 border-2 border-pencil
      px-3 py-1.5 font-body text-sm
      shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]
      transition-all duration-100
      ${vote === "jayus"
        ? "bg-ink text-white"
        : vote === "receh"
          ? "opacity-40 cursor-not-allowed"
          : "bg-white text-pencil cursor-pointer hover:bg-ink hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(45,45,45,0.15)]"
      }`}
  >
    😑 Jayus
  </button>
</div>
```

- [ ] **Step 5: Pass `category` in page.tsx**

In `src/app/page.tsx`, change line 59:

```tsx
<JokeCard key={j.id} jokeId={j.id} joke={j.joke} index={i} />
```

To:

```tsx
<JokeCard key={j.id} jokeId={j.id} joke={j.joke} category={j.category} index={i} />
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/JokeCard.tsx src/app/page.tsx
git commit -m "feat: add Receh/Jayus voting buttons to JokeCard"
```

---

### Task 3: Lint + manual smoke test

- [ ] **Step 1: Verify lint passes**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 2: Start dev server and verify voting flow**

Run: `npm run dev`

1. Open `http://localhost:3000`
2. Click "Generate" to get jokes
3. Click "😂 Receh" on a joke → button highlights accent, Jayus goes muted, both disabled
4. Click "😑 Jayus" on a different joke → button highlights ink, Receh goes muted, both disabled
5. Click "Generate" again — if same joke appears, vote state persists
6. Open a new tab → votes are reset (sessionStorage is per-tab)

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address issues found during smoke test"
```
