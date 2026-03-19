# Static Jokes with Seeded Random + Umami Tracking

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the API round-trip by loading jokes client-side with timestamp-seeded randomization, and add Umami event tracking.

**Architecture:** Import jokes.json directly in client code. Replace server-side shuffle with a deterministic mulberry32 PRNG seeded by `Date.now()`. Add Umami analytics script and custom event tracking for generates, copies, and shares.

**Tech Stack:** Next.js 16, React 19, TypeScript, Umami Cloud

**Spec:** `docs/superpowers/specs/2026-03-20-static-jokes-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/jokes.ts` | Modify | Seeded PRNG, Fisher-Yates shuffle, `getJokes()` |
| `src/app/page.tsx` | Modify | Direct import of `getJokes`, remove fetch/loading/error |
| `src/components/GenerateButton.tsx` | Modify | Remove `loading` prop (now dead code) |
| `src/components/JokeCard.tsx` | Modify | Accept `jokeId` prop, add Umami tracking for copy/share |
| `src/app/api/generate/route.ts` | Delete | No longer needed |
| `src/app/layout.tsx` | Modify | Add Umami script tag |
| `src/types/umami.d.ts` | Create | TypeScript declaration for `window.umami` |
| `.env.example` | Modify | Replace OPENROUTER_API_KEY with UMAMI config |

---

### Task 1: Rewrite `src/lib/jokes.ts` with seeded random

**Files:**
- Modify: `src/lib/jokes.ts`

- [ ] **Step 1: Rewrite jokes.ts**

Replace the entire file with:

```typescript
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
  return shuffled.slice(0, count).map((j) => ({ id: j.id, joke: j.joke }));
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/ihsansatriawan/conductor/workspaces/jokes-bapack-bapack/toronto && npx tsc --noEmit --pretty 2>&1 | head -20`

Expected: May show errors in route.ts (it still imports old function) — that's fine, we'll delete it next.

- [ ] **Step 3: Commit**

```bash
git add src/lib/jokes.ts
git commit -m "refactor: rewrite jokes.ts with seeded PRNG and Fisher-Yates shuffle"
```

---

### Task 2: Update `page.tsx` — remove API call, use direct import

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

Replace the entire file with:

```tsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CategoryChips from "@/components/CategoryChips";
import GenerateButton from "@/components/GenerateButton";
import JokeCard from "@/components/JokeCard";
import EmptyState from "@/components/EmptyState";
import { getJokes } from "@/lib/jokes";
import type { JokeResult } from "@/lib/jokes";
import type { CategoryId } from "@/lib/constants";

export default function Home() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [jokes, setJokes] = useState<JokeResult[]>([]);

  function handleGenerate(overrideCategory?: CategoryId | null) {
    const effectiveCategory =
      overrideCategory !== undefined ? overrideCategory : category;
    const result = getJokes(effectiveCategory, 5, Date.now());
    setJokes(result);

    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("generate-jokes", {
        category: effectiveCategory || "all",
      });
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-6 md:py-12">
      <div className="wobbly-md w-full max-w-md border-[3px] border-pencil bg-paper shadow-hard-lg overflow-hidden">
        <Header />

        <div className="animate-fade-in-up stagger-3">
          <CategoryChips selected={category} onSelect={setCategory} />
        </div>

        <div className="animate-fade-in-up stagger-4">
          <GenerateButton onClick={() => handleGenerate()} />
        </div>

        <hr className="mx-5 border-0 border-t-[3px] border-dashed border-muted" />

        <div className="px-5 py-4 animate-fade-in-up stagger-5">
          {jokes.length > 0 && (
            <>
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-pencil/50 mb-3 relative inline-block">
                Hasil Jokes ({jokes.length})
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 4px, transparent 4px, transparent 8px)",
                  }}
                />
              </p>
              {jokes.map((j, i) => (
                <JokeCard key={j.id} jokeId={j.id} joke={j.joke} index={i} />
              ))}
            </>
          )}

          {jokes.length === 0 && <EmptyState />}
        </div>
      </div>

      <p className="mt-4 font-body text-xs text-pencil/25 text-center animate-fade-in-up stagger-5">
        dibuat dengan ❤️ untuk para bapak Indonesia
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: replace API fetch with direct getJokes import"
```

---

### Task 3: Clean up `GenerateButton.tsx` — remove dead `loading` prop

**Files:**
- Modify: `src/components/GenerateButton.tsx`

- [ ] **Step 1: Rewrite GenerateButton.tsx**

Replace the entire file with:

```tsx
interface GenerateButtonProps {
  onClick: () => void;
}

export default function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <div className="px-5 pt-1 pb-4">
      <button
        type="button"
        onClick={onClick}
        className="wobbly w-full border-[3px] border-pencil bg-accent px-4 py-3.5
          font-heading text-xl font-bold text-white
          shadow-hard rotate-[0.5deg]
          transition-all duration-100 cursor-pointer
          hover:translate-x-[2px] hover:translate-y-[2px] hover:-rotate-[0.5deg] hover:shadow-hard-hover
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        🎲 Generate Jokes!
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GenerateButton.tsx
git commit -m "refactor: remove dead loading prop from GenerateButton"
```

---

### Task 4: Delete API route and clean up

**Files:**
- Delete: `src/app/api/generate/route.ts`

- [ ] **Step 1: Delete the API route file**

```bash
rm src/app/api/generate/route.ts
```

- [ ] **Step 2: Remove empty api directory if nothing else in it**

```bash
rmdir src/app/api/generate src/app/api 2>/dev/null || true
```

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit --pretty`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete unused API route /api/generate"
```

---

### Task 5: Add Umami type declaration

**Files:**
- Create: `src/types/umami.d.ts`

- [ ] **Step 1: Create type declaration**

```typescript
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

export {};
```

- [ ] **Step 2: Commit**

```bash
git add src/types/umami.d.ts
git commit -m "chore: add Umami global type declaration"
```

---

### Task 6: Add Umami script to `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jokes Bapak-Bapak",
  description: "Generator jokes receh untuk para ayah Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Umami analytics script to layout"
```

---

### Task 7: Add Umami tracking to `JokeCard.tsx`

**Files:**
- Modify: `src/components/JokeCard.tsx`

- [ ] **Step 1: Add `jokeId` prop to interface**

In `src/components/JokeCard.tsx`, update the interface and function signature:

```typescript
interface JokeCardProps {
  jokeId: number;
  joke: string;
  index: number;
}

export default function JokeCard({ jokeId, joke, index }: JokeCardProps) {
```

- [ ] **Step 2: Add tracking to handleCopy**

After the `setCopied(true)` line inside `handleCopy`, add:

```typescript
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("copy-joke", {
          joke_id: jokeId,
          joke_text: joke.substring(0, 100),
        });
      }
```

- [ ] **Step 3: Add tracking to handleShareWA**

At the beginning of the `handleShareWA` function, add:

```typescript
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("share-whatsapp", {
        joke_id: jokeId,
        joke_text: joke.substring(0, 100),
      });
    }
```

- [ ] **Step 4: Commit**

```bash
git add src/components/JokeCard.tsx
git commit -m "feat: add Umami event tracking for copy and WhatsApp share"
```

---

### Task 8: Verify build and manual test

- [ ] **Step 1: Run build**

Run: `npm run build`

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run dev server and test manually**

Run: `npm run dev`

Test checklist:
- Page loads without errors
- Click "Generate" → jokes appear instantly (no loading spinner)
- Select a category → click Generate → only jokes from that category
- Click Generate again → different joke ordering
- Click Copy → joke copied to clipboard
- Click Share WA → WhatsApp opens with joke text
- Check browser console → no errors

- [ ] **Step 3: Commit any fixes if needed**

---

### Task 9: Update `.env.example` for Umami config

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Update env example**

Replace `.env.example` contents with (OPENROUTER_API_KEY is no longer used — the API route that used it has been deleted):

```bash
# Umami Analytics (optional — tracking disabled if not set)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update .env.example — replace OPENROUTER_API_KEY with Umami config"
```
