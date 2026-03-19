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
