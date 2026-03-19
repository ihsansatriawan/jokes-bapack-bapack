# Jokes Bapak-Bapak — Design Spec

## Overview

A simple MVP webapp that generates Indonesian dad jokes (jokes bapak-bapak) using AI. Built for dads who want to stock up on receh jokes before family gatherings. Users can pick a category or type a keyword, get 3-5 AI-generated jokes, then copy or share them directly to WhatsApp.

## Target User

Bapak-bapak Indonesia yang mau nyari jokes buat dilontarin ke keluarga saat kumpul-kumpul.

## Core Features

### 1. Joke Generation (Two Modes)
- **Category preset**: User picks from predefined categories — Makanan, Hewan, Sekolah, Keluarga, Kantor, Olahraga
- **Free keyword**: User types any keyword (e.g., "nasi goreng", "tukang parkir")
- Both modes can be combined (pick a category AND add a keyword)
- Each generation returns **3-5 jokes**

### 2. Share & Copy
- **Copy to clipboard**: Plain text, no formatting — ready to paste anywhere
- **Share to WhatsApp**: Uses Web Share API on mobile, falls back to `wa.me` deep link with pre-filled text
- Format: plain text only, no editing needed before sharing

### 3. Random Generate
- If no category or keyword selected, generate random jokes across all themes

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | Full-stack, single deploy, API key safe on server |
| Styling | Tailwind CSS | Fast styling, responsive |
| AI Provider | OpenRouter API | Multi-model access, cost-flexible, single API key |
| Fonts | Kalam + Patrick Hand (Google Fonts) | Hand-drawn design system |
| Icons | lucide-react | Consistent, lightweight |
| Deploy | Vercel (free tier) | Zero-config Next.js deploy |

## Architecture

```
┌─────────────────────────────────────┐
│           Browser (Mobile-first)     │
│                                      │
│  ┌─ Category Chips ─────────────┐   │
│  │  Makanan │ Hewan │ Sekolah   │   │
│  │  Keluarga│ Kantor│ Olahraga  │   │
│  └──────────────────────────────┘   │
│  ┌─ Keyword Input ──────────────┐   │
│  │  "nasi goreng..."            │   │
│  └──────────────────────────────┘   │
│  ┌─ Generate Button ────────────┐   │
│  │  🎲 Generate Jokes!          │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌─ Joke Card ──────────────────┐   │
│  │  "Joke text here..."         │   │
│  │  [📋 Copy] [💬 Share WA]     │   │
│  └──────────────────────────────┘   │
│  (×3-5 cards)                        │
└──────────────┬──────────────────────┘
               │ POST /api/generate
               │ { category?, keyword? }
               ▼
┌─────────────────────────────────────┐
│     Next.js API Route               │
│     /api/generate                    │
│                                      │
│  - Validates input                   │
│  - Constructs prompt                 │
│  - Calls OpenRouter API              │
│  - Parses & returns jokes            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     OpenRouter API                   │
│     (Llama / Mistral / etc)          │
│                                      │
│  Returns 3-5 jokes in JSON format    │
└─────────────────────────────────────┘
```

## Design System

**Hand-Drawn / Sketchy style** — organic, playful, imperfect.

### Key Design Tokens (Tailwind Config Keys)
- **`paper`**: `#fdfbf7` (warm paper background) with dot-grid texture
- **`pencil`**: `#2d2d2d` (pencil black, never pure black)
- **`accent`**: `#ff4d4d` (red correction marker)
- **`ink`**: `#2d5da1` (blue ballpoint pen)
- **`muted`**: `#e5e0d8` (old paper / erased pencil)
- **`postit`**: `#fff9c4` (post-it yellow, active state)

### Visual Characteristics
- **Wobbly borders**: Irregular `border-radius` values (e.g., `255px 15px 225px 15px / 15px 225px 15px 255px`)
- **Hard offset shadows**: `4px 4px 0px 0px #2d2d2d` — no blur
- **Paper texture**: `radial-gradient(#e5e0d8 1px, transparent 1px)` background
- **Slight rotations**: Cards and elements rotated -2deg to 2deg
- **Decorations**: Tape strips on header, thumbtack pins on joke cards, dashed dividers
- **Typography**: Kalam (headings, 700), Patrick Hand (body, 400)

### Component Styles
- **Chips (categories)**: Wobbly pill shape, white bg, 2px border, post-it yellow when active
- **Input**: Full box with wobbly border, Patrick Hand font
- **Generate button**: Red accent bg, 3px border, hard shadow, press flat on click (`translate-x-[4px] translate-y-[4px] shadow-none`)
- **Joke cards**: White bg, wobbly border, thumbtack pin, slight rotation alternating
- **Action buttons**: Copy (muted bg → blue hover), Share WA (white bg → red hover)

## API Design

### POST /api/generate

**Request:**
```json
{
  "category": "hewan",     // optional
  "keyword": "ayam"        // optional
}
```

**Response:**
```json
{
  "jokes": [
    "Kenapa ayam nggak pernah menang lomba lari?...",
    "Tau nggak bedanya ayam sama bapak-bapak?...",
    "Apa persamaan ayam dan bapak-bapak di pagi hari?..."
  ]
}
```

**Error:**
```json
{
  "error": "Failed to generate jokes. Please try again."
}
```

### HTTP Status Codes
- `200` — success, jokes returned
- `400` — invalid input (e.g., keyword too long, invalid category)
- `500` — OpenRouter API failure or timeout

### OpenRouter Config
- **Default model**: `meta-llama/llama-3.1-8b-instruct:free` (free tier, good enough for jokes)
- **Fetch timeout**: 15 seconds (Vercel serverless limit-friendly)
- **Joke count validation**: Client accepts whatever the model returns (no strict enforcement). Prompt asks for 5 jokes.

### AI Prompt Template

```
System: Kamu adalah generator jokes bapak-bapak Indonesia. Buat jokes yang receh,
berbasis pun/permainan kata, family-friendly, dan khas humor bapak-bapak.

Balas HANYA dengan JSON array berisi 5 string jokes. Tidak ada teks lain.
Contoh format: ["joke 1", "joke 2", "joke 3", "joke 4", "joke 5"]

User: Buatkan 5 jokes bapak-bapak {kategoriClause} {keywordClause}
```

Where:
- `{kategoriClause}` = `tentang {category}` if provided, else empty
- `{keywordClause}` = `yang berhubungan dengan "{keyword}"` if provided, else empty
- If neither provided: `tentang topik apa saja`

## File Structure

```
surat/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, metadata
│   │   ├── page.tsx            # Homepage — orchestrates all state (selected category, keyword, jokes[], loading, error)
│   │   ├── globals.css         # Tailwind + hand-drawn custom styles
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts    # API endpoint for joke generation
│   ├── components/
│   │   ├── Header.tsx          # App header with title
│   │   ├── CategoryChips.tsx   # Category selection chips
│   │   ├── KeywordInput.tsx    # Free text keyword input
│   │   ├── GenerateButton.tsx  # Generate button with loading state
│   │   └── JokeCard.tsx        # Individual joke display with copy/share actions
│   └── lib/
│       ├── openrouter.ts       # OpenRouter API client
│       └── constants.ts        # Categories, prompts, config
├── public/
├── .env.local                  # OPENROUTER_API_KEY
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## States & Edge Cases

### Loading State
- Generate button shows spinner/animation while waiting for API response
- Button disabled during loading to prevent double-submit

### Empty State
- On first load, show encouraging text like "Pilih kategori atau ketik kata kunci, lalu pencet Generate!"
- No joke cards visible until first generation

### Error State
- If API fails, show friendly error message in a joke card style
- "Waduh, jokes-nya lagi ngadat. Coba lagi ya, Pak!"

### Share Behavior
- **Copy**: Use `navigator.clipboard.writeText()`, show "Tersalin!" feedback for 2 seconds
- **WhatsApp**: Use `navigator.share()` if available (mobile), fallback to `https://wa.me/?text={encodedJoke}`

## Out of Scope (MVP)

- User accounts / login
- Saving favorite jokes
- Rating/voting on jokes
- Database storage of generated jokes
- Dark mode (hand-drawn style is inherently light-themed)
- Multiple languages
- Image/meme card generation
