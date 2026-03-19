"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CategoryChips from "@/components/CategoryChips";
import GenerateButton from "@/components/GenerateButton";
import JokeCard from "@/components/JokeCard";
import type { CategoryId } from "@/lib/constants";

export default function Home() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [jokes, setJokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(overrideCategory?: CategoryId | null) {
    setLoading(true);
    setError(null);
    setJokes([]);

    const effectiveCategory = overrideCategory !== undefined ? overrideCategory : category;

    try {
      const body: Record<string, string> = {};
      if (effectiveCategory) body.category = effectiveCategory;

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
        <GenerateButton onClick={handleGenerate} loading={loading} />
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={() => { setCategory(null); handleGenerate(null); }}
            disabled={loading}
            className="wobbly-2 w-full border-2 border-pencil bg-postit px-4 py-2.5
              font-body text-base text-pencil
              shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)] rotate-[-0.3deg]
              transition-all duration-100 cursor-pointer
              hover:translate-x-[1px] hover:translate-y-[1px] hover:rotate-[0.3deg] hover:shadow-[2px_2px_0px_0px_rgba(45,45,45,0.15)]
              disabled:opacity-70 disabled:cursor-not-allowed"
          >
            ✨ Beri saya dad jokes terbaik hari ini!
          </button>
        </div>

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
              Pilih kategori lalu pencet Generate, atau langsung minta jokes terbaik! ☝️
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
