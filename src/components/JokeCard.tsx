"use client";

import { useState, useEffect } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

const WOBBLY_VARIANTS = [
  "wobbly-2",
  "wobbly-3",
  "wobbly-4",
  "wobbly",
];

interface JokeCardProps {
  jokeId: number;
  joke: string;
  category: string;
  index: number;
}

export default function JokeCard({ jokeId, joke, category, index }: JokeCardProps) {
  const [copied, setCopied] = useState(false);
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

  const rotation = index % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]";
  const wobblyClass = WOBBLY_VARIANTS[index % WOBBLY_VARIANTS.length];
  const tackColor = index % 3 === 2 ? "bg-ink" : "bg-accent";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(joke);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("copy-joke", {
          joke_id: jokeId,
          joke_text: joke.substring(0, 100),
        });
      }
    } catch {
      // clipboard unavailable in this browser/context — silently ignore
    }
  }

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

  function handleShareWA() {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("share-whatsapp", {
        joke_id: jokeId,
        joke_text: joke.substring(0, 100),
      });
    }
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

      <p className="font-body text-base leading-relaxed text-pencil mb-3">
        {joke}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Tersalin" : "Salin joke"}
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
          type="button"
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
