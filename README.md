# Jokes Bapak-Bapak 🎲

Generator jokes receh untuk para ayah Indonesia. Klik tombol, dapat 5 jokes acak yang berbeda setiap kali — bisa filter per kategori, copy ke clipboard, atau langsung kirim ke WhatsApp.

## Features

- 🎲 **Random jokes** dengan seeded randomization — setiap klik berbeda hasilnya
- 🏷️ **Filter kategori** — hewan, makanan, sekolah, keluarga, kantor, olahraga
- 📋 **Copy to clipboard** satu klik
- 💬 **Share ke WhatsApp** langsung
- ⚡ **Instant** — tidak ada loading, tidak ada API call
- 📊 **Analytics** via Umami (opsional, privacy-friendly)

## Tech Stack

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (hand-drawn sketch aesthetic)
- [Umami](https://umami.is/) untuk analytics (opsional)

## Getting Started

**Requirement:** Node.js ≥ 20.9.0

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Menambah Jokes

Edit `src/data/jokes.json`. Format setiap joke:

```json
{
  "id": 41,
  "joke": "Teks jokes di sini.",
  "category": "hewan",
  "keywords": ["keyword1", "keyword2"]
}
```

Kategori yang tersedia: `hewan`, `makanan`, `sekolah`, `keluarga`, `kantor`, `olahraga`

Setelah edit, deploy ulang. Tidak ada perubahan kode yang diperlukan.

## Analytics (Opsional)

1. Daftar di [Umami Cloud](https://umami.is) (gratis) atau self-host
2. Tambah website, dapatkan Website ID
3. Set environment variable:

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
```

Event yang di-track:
- Page views (otomatis)
- Kategori yang sering di-generate
- Jokes yang sering di-copy atau di-share ke WA

Jika env var tidak di-set, tracking otomatis dinonaktifkan.

## Deploy

Siap deploy ke [Vercel](https://vercel.com):

```bash
npm run build
```

Tambah `NEXT_PUBLIC_UMAMI_WEBSITE_ID` di environment variables Vercel jika ingin analytics.

## Project Structure

```
src/
├── app/           # Next.js app router (page.tsx, layout.tsx)
├── components/    # UI components (JokeCard, CategoryChips, dll)
├── data/          # jokes.json — sumber data semua jokes
├── lib/           # Business logic (getJokes, seeded shuffle)
└── types/         # TypeScript type declarations
```
