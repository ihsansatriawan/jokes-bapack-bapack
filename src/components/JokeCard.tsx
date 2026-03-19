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
