# Jokes Bapak-Bapak Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an MVP webapp that generates Indonesian dad jokes using AI, with copy-to-clipboard and WhatsApp sharing.

**Architecture:** Single-page Next.js 15 app (App Router). One API route proxies requests to OpenRouter. All state lives in `page.tsx` (selected category, keyword, jokes array, loading, error). Hand-drawn/sketchy design system using Tailwind CSS with custom tokens.

**Tech Stack:** Next.js 15, Tailwind CSS, OpenRouter API, Google Fonts (Kalam + Patrick Hand), lucide-react

**Spec:** `docs/superpowers/specs/2026-03-19-jokes-bapak-bapak-design.md`
**Design System Reference:** `.context/attachments/pasted_text_2026-03-19_12-12-51.txt`

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/lib/constants.ts` | Categories, prompt template, OpenRouter config |
| `src/lib/openrouter.ts` | OpenRouter API client (fetch with timeout) |
| `src/app/api/generate/route.ts` | POST endpoint: validate input, build prompt, call OpenRouter, return jokes |
| `src/app/layout.tsx` | Root layout: fonts, metadata, body with paper texture |
| `src/app/globals.css` | Tailwind directives + hand-drawn custom CSS (wobbly borders, shadows) |
| `src/app/page.tsx` | Homepage: orchestrates all state, renders components |
| `src/components/Header.tsx` | App title with tape decoration |
| `src/components/CategoryChips.tsx` | Category selection chips (6 categories) |
| `src/components/KeywordInput.tsx` | Free text keyword input |
| `src/components/GenerateButton.tsx` | Generate button with loading state |
| `src/components/JokeCard.tsx` | Single joke card with copy/share WA buttons |
| `tailwind.config.ts` | Custom colors (paper, pencil, accent, ink, muted, postit) |
| `.env.local` | `OPENROUTER_API_KEY` |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `.env.local`, `.env.example`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/ihsansatriawan/conductor/workspaces/jokes-bapack-bapack/surat
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This creates the full Next.js scaffold with Tailwind.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install lucide-react
```

- [ ] **Step 3: Create `.env.example` and `.env.local`**

`.env.example`:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

`.env.local`:
```
OPENROUTER_API_KEY=
```

- [ ] **Step 4: Update `.gitignore`**

Add to existing `.gitignore`:
```
node_modules/
.next/
.env.local
```

- [ ] **Step 5: Configure Tailwind with custom design tokens**

`tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fdfbf7",
        pencil: "#2d2d2d",
        accent: "#ff4d4d",
        ink: "#2d5da1",
        muted: "#e5e0d8",
        postit: "#fff9c4",
      },
      fontFamily: {
        heading: ["Kalam", "cursive"],
        body: ["Patrick Hand", "cursive"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #2d2d2d",
        "hard-sm": "3px 3px 0px 0px rgba(45, 45, 45, 0.1)",
        "hard-hover": "2px 2px 0px 0px #2d2d2d",
        "hard-lg": "8px 8px 0px 0px #2d2d2d",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 6: Set up globals.css with hand-drawn base styles**

`src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');

body {
  font-family: 'Patrick Hand', cursive;
  background-color: #fdfbf7;
  background-image: radial-gradient(#e5e0d8 1px, transparent 1px);
  background-size: 24px 24px;
  color: #2d2d2d;
}

@layer utilities {
  .wobbly {
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  }
  .wobbly-2 {
    border-radius: 15px 225px 15px 255px / 225px 15px 255px 15px;
  }
  .wobbly-3 {
    border-radius: 225px 15px 255px 15px / 15px 255px 15px 225px;
  }
  .wobbly-4 {
    border-radius: 15px 255px 15px 225px / 255px 15px 225px 15px;
  }
  .wobbly-md {
    border-radius: 15px 225px 15px 255px / 225px 15px 255px 15px;
  }
}
```

- [ ] **Step 7: Set up root layout with fonts and metadata**

`src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder page.tsx**

`src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-content-center">
      <div className="max-w-md mx-auto px-6 py-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-pencil">
          Jokes Bapak-Bapak
        </h1>
        <p className="font-body text-lg text-pencil/60 mt-2">
          Generator jokes receh untuk para ayah Indonesia
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000 — should see title with handwritten font on paper-textured background.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with hand-drawn Tailwind config"
```

---

### Task 2: Constants & OpenRouter Client

**Files:**
- Create: `src/lib/constants.ts`, `src/lib/openrouter.ts`

- [ ] **Step 1: Create constants file**

`src/lib/constants.ts`:
```ts
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

export const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const FETCH_TIMEOUT_MS = 15_000;

export const SYSTEM_PROMPT = `Kamu adalah generator jokes bapak-bapak Indonesia. Buat jokes yang receh, berbasis pun/permainan kata, family-friendly, dan khas humor bapak-bapak.

Balas HANYA dengan JSON array berisi 5 string jokes. Tidak ada teks lain.
Contoh format: ["joke 1", "joke 2", "joke 3", "joke 4", "joke 5"]`;

export function buildUserPrompt(category?: string, keyword?: string): string {
  const parts = ["Buatkan 5 jokes bapak-bapak"];

  if (category && keyword) {
    parts.push(`tentang ${category} yang berhubungan dengan "${keyword}"`);
  } else if (category) {
    parts.push(`tentang ${category}`);
  } else if (keyword) {
    parts.push(`yang berhubungan dengan "${keyword}"`);
  } else {
    parts.push("tentang topik apa saja");
  }

  return parts.join(" ");
}
```

- [ ] **Step 2: Create OpenRouter client**

`src/lib/openrouter.ts`:
```ts
import {
  OPENROUTER_URL,
  OPENROUTER_MODEL,
  FETCH_TIMEOUT_MS,
  SYSTEM_PROMPT,
  buildUserPrompt,
} from "./constants";

export async function generateJokes(
  category?: string,
  keyword?: string
): Promise<string[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(category, keyword) },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in OpenRouter response");
    }

    // Parse JSON array from response — handle possible markdown code blocks
    const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const jokes = JSON.parse(cleaned);

    if (!Array.isArray(jokes)) {
      throw new Error("Response is not an array");
    }

    return jokes.filter((j: unknown) => typeof j === "string" && j.length > 0);
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/lib/openrouter.ts
git commit -m "feat: add constants and OpenRouter API client"
```

---

### Task 3: API Route

**Files:**
- Create: `src/app/api/generate/route.ts`

- [ ] **Step 1: Create the API route**

`src/app/api/generate/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { generateJokes } from "@/lib/openrouter";
import { VALID_CATEGORY_IDS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, keyword } = body;

    // Validate category if provided
    if (category && !VALID_CATEGORY_IDS.has(category)) {
      return NextResponse.json(
        { error: "Kategori tidak valid." },
        { status: 400 }
      );
    }

    // Validate keyword if provided
    if (keyword && (typeof keyword !== "string" || keyword.length > 100)) {
      return NextResponse.json(
        { error: "Kata kunci terlalu panjang (maks 100 karakter)." },
        { status: 400 }
      );
    }

    const jokes = await generateJokes(category, keyword);
    return NextResponse.json({ jokes });
  } catch (error) {
    console.error("Generate jokes error:", error);
    return NextResponse.json(
      { error: "Waduh, jokes-nya lagi ngadat. Coba lagi ya, Pak!" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: add /api/generate endpoint for joke generation"
```

---

### Task 4: Header Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Create Header component**

`src/components/Header.tsx`:
```tsx
export default function Header() {
  return (
    <header className="relative border-b-[3px] border-dashed border-pencil bg-white px-6 py-8 text-center">
      {/* Tape decoration */}
      <div
        className="absolute -top-[6px] left-1/2 h-5 w-20 -translate-x-1/2 rotate-2"
        style={{ background: "rgba(200, 200, 180, 0.5)", border: "1px solid rgba(150, 150, 130, 0.3)" }}
      />
      <div className="text-4xl mb-1">👨</div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-pencil -rotate-1">
        Jokes Bapak<span className="text-accent">!</span>Bapak
      </h1>
      <p className="font-body text-base md:text-lg text-pencil/60 mt-1">
        jokes receh buat para ayah ~
      </p>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component with tape decoration"
```

---

### Task 5: CategoryChips Component

**Files:**
- Create: `src/components/CategoryChips.tsx`

- [ ] **Step 1: Create CategoryChips component**

`src/components/CategoryChips.tsx`:
```tsx
import { CATEGORIES, type CategoryId } from "@/lib/constants";

const WOBBLY_CLASSES = [
  "wobbly",
  "wobbly-2",
  "wobbly-3",
  "wobbly-4",
  "wobbly",
  "wobbly-2",
];

interface CategoryChipsProps {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export default function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="px-5 pt-4 pb-2">
      <p className="font-heading text-sm font-bold uppercase tracking-wider text-pencil/50 mb-2 relative inline-block">
        Pilih Kategori
        <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
          background: "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 4px, transparent 4px, transparent 8px)"
        }} />
      </p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelect(selected === cat.id ? null : cat.id)}
            className={`
              ${WOBBLY_CLASSES[i]}
              border-2 border-pencil px-3.5 py-1.5 font-body text-[15px] text-pencil
              shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]
              transition-transform duration-100 cursor-pointer
              ${selected === cat.id
                ? "bg-postit -translate-x-0.5 -translate-y-0.5 -rotate-1 shadow-[5px_5px_0px_0px_rgba(45,45,45,0.2)]"
                : "bg-white hover:rotate-1"
              }
            `}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryChips.tsx
git commit -m "feat: add CategoryChips component with wobbly borders"
```

---

### Task 6: KeywordInput Component

**Files:**
- Create: `src/components/KeywordInput.tsx`

- [ ] **Step 1: Create KeywordInput component**

`src/components/KeywordInput.tsx`:
```tsx
interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function KeywordInput({ value, onChange }: KeywordInputProps) {
  return (
    <div className="px-5 pt-2 pb-3">
      <p className="font-heading text-sm font-bold uppercase tracking-wider text-pencil/50 mb-2 relative inline-block">
        Atau ketik kata kunci
        <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
          background: "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 4px, transparent 4px, transparent 8px)"
        }} />
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="misal: nasi goreng, tukang parkir..."
        maxLength={100}
        className="wobbly w-full border-2 border-pencil bg-white px-4 py-2.5 font-body text-base text-pencil
          shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]
          placeholder:text-pencil/35
          focus:border-ink focus:ring-2 focus:ring-ink/20 focus:outline-none"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/KeywordInput.tsx
git commit -m "feat: add KeywordInput component"
```

---

### Task 7: GenerateButton Component

**Files:**
- Create: `src/components/GenerateButton.tsx`

- [ ] **Step 1: Create GenerateButton component**

`src/components/GenerateButton.tsx`:
```tsx
import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function GenerateButton({ onClick, loading }: GenerateButtonProps) {
  return (
    <div className="px-5 pt-1 pb-4">
      <button
        onClick={onClick}
        disabled={loading}
        className="wobbly w-full border-[3px] border-pencil bg-accent px-4 py-3.5
          font-heading text-xl font-bold text-white
          shadow-hard rotate-[0.5deg]
          transition-all duration-100 cursor-pointer
          hover:translate-x-[2px] hover:translate-y-[2px] hover:-rotate-[0.5deg] hover:shadow-hard-hover
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Mikir dulu...
          </span>
        ) : (
          "🎲 Generate Jokes!"
        )}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GenerateButton.tsx
git commit -m "feat: add GenerateButton with loading state"
```

---

### Task 8: JokeCard Component

**Files:**
- Create: `src/components/JokeCard.tsx`

- [ ] **Step 1: Create JokeCard component**

`src/components/JokeCard.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

const WOBBLY_VARIANTS = [
  "wobbly-2",
  "wobbly-3",
  "wobbly-4",
  "wobbly",
];

interface JokeCardProps {
  joke: string;
  index: number;
}

export default function JokeCard({ joke, index }: JokeCardProps) {
  const [copied, setCopied] = useState(false);

  const rotation = index % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]";
  const wobblyClass = WOBBLY_VARIANTS[index % WOBBLY_VARIANTS.length];
  const tackColor = index % 3 === 2 ? "bg-ink" : "bg-accent";

  async function handleCopy() {
    await navigator.clipboard.writeText(joke);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWA() {
    const text = encodeURIComponent(joke);
    // Try Web Share API first, fallback to wa.me
    if (navigator.share) {
      navigator.share({ text: joke }).catch(() => {
        window.open(`https://wa.me/?text=${text}`, "_blank");
      });
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  }

  return (
    <div
      className={`
        ${wobblyClass} ${rotation}
        relative border-2 border-pencil bg-white p-4 mb-3
        shadow-hard-sm
        transition-transform duration-100
        hover:rotate-0 hover:scale-[1.01]
      `}
    >
      {/* Thumbtack */}
      <div
        className={`absolute -top-2 right-4 h-4 w-4 ${tackColor} border-2 border-pencil rounded-full shadow-[1px_1px_0px_0px_#2d2d2d]`}
      />

      <p className="font-body text-base leading-relaxed text-pencil mb-3">
        {joke}
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="wobbly-3 flex-1 flex items-center justify-center gap-1.5 border-2 border-pencil
            bg-muted px-3 py-2 font-body text-sm text-pencil
            shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]
            transition-all duration-100 cursor-pointer
            hover:bg-ink hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(45,45,45,0.15)]"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" strokeWidth={2.5} />
              Copy
            </>
          )}
        </button>
        <button
          onClick={handleShareWA}
          className="wobbly flex-1 flex items-center justify-center gap-1.5 border-2 border-pencil
            bg-white px-3 py-2 font-body text-sm text-pencil
            shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]
            transition-all duration-100 cursor-pointer
            hover:bg-accent hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(45,45,45,0.15)]"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
          Share WA
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/JokeCard.tsx
git commit -m "feat: add JokeCard with copy and WhatsApp share"
```

---

### Task 9: Main Page — Wire Everything Together

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build the full page with all components and state**

`src/app/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CategoryChips from "@/components/CategoryChips";
import KeywordInput from "@/components/KeywordInput";
import GenerateButton from "@/components/GenerateButton";
import JokeCard from "@/components/JokeCard";
import type { CategoryId } from "@/lib/constants";

export default function Home() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [keyword, setKeyword] = useState("");
  const [jokes, setJokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string> = {};
      if (category) body.category = category;
      if (keyword.trim()) body.keyword = keyword.trim();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal generate jokes.");
        return;
      }

      setJokes(data.jokes);
    } catch {
      setError("Waduh, jokes-nya lagi ngadat. Coba lagi ya, Pak!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-6 md:py-12">
      <div
        className="wobbly-md w-full max-w-md border-[3px] border-pencil bg-paper shadow-hard-lg overflow-hidden"
      >
        <Header />
        <CategoryChips selected={category} onSelect={setCategory} />
        <KeywordInput value={keyword} onChange={setKeyword} />
        <GenerateButton onClick={handleGenerate} loading={loading} />

        <hr className="mx-5 border-0 border-t-[3px] border-dashed border-muted" />

        <div className="px-5 py-4">
          {error && (
            <div className="wobbly border-2 border-accent bg-accent/10 p-4 mb-3 font-body text-base text-pencil">
              {error}
            </div>
          )}

          {jokes.length > 0 && (
            <>
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-pencil/50 mb-3 relative inline-block">
                Hasil Jokes ({jokes.length})
                <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
                  background: "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 4px, transparent 4px, transparent 8px)"
                }} />
              </p>
              {jokes.map((joke, i) => (
                <JokeCard key={`${joke.slice(0, 20)}-${i}`} joke={joke} index={i} />
              ))}
            </>
          )}

          {jokes.length === 0 && !error && !loading && (
            <p className="font-body text-center text-pencil/40 py-8 text-lg">
              Pilih kategori atau ketik kata kunci, lalu pencet Generate! ☝️
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify dev server renders correctly**

```bash
npm run dev
```

Open http://localhost:3000 — verify:
- Header with tape decoration visible
- Category chips render and are clickable
- Keyword input works
- Generate button is visible
- Empty state message shows

- [ ] **Step 3: Test full flow with OpenRouter API key**

Set a valid `OPENROUTER_API_KEY` in `.env.local`, restart dev server, click Generate. Verify jokes appear in cards with working Copy and Share WA buttons.

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up homepage with all components and state management"
```

---

### Task 10: Final Polish & Verification

**Files:**
- Possibly tweak: any component for visual fixes

- [ ] **Step 1: Test mobile responsiveness**

Open dev tools, toggle mobile viewport (375px width). Verify:
- All content fits without horizontal scroll
- Chips wrap correctly
- Buttons are touch-friendly (min 48px height)
- Joke cards are readable

- [ ] **Step 2: Test copy to clipboard**

Click Copy on a joke card. Paste into a text editor. Verify plain text with no formatting.

- [ ] **Step 3: Test WhatsApp share**

Click Share WA on a joke card. On desktop, verify it opens `wa.me` in new tab with pre-filled text. On mobile (or with Web Share API), verify share sheet appears.

- [ ] **Step 4: Test error state**

Remove/invalidate `OPENROUTER_API_KEY` in `.env.local`. Click Generate. Verify friendly error message appears.

- [ ] **Step 5: Final build check**

```bash
npm run build
```

- [ ] **Step 6: Commit any polish fixes**

```bash
git add -A
git commit -m "polish: final UI adjustments and verification"
```
