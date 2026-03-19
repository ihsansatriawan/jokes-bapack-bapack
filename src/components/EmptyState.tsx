export default function EmptyState() {
  return (
    <div className="py-6 px-2 text-center">
      {/* Notebook doodle area */}
      <div className="relative mx-auto w-48 h-40 mb-4">
        {/* Speech bubble */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 wobbly-2 border-2 border-pencil/30 bg-postit/60 px-5 py-3 animate-float"
        >
          <p className="font-heading text-sm text-pencil/70 whitespace-nowrap -rotate-1">
            &quot;Kenapa ayam...?&quot;
          </p>
          {/* Speech bubble tail */}
          <div
            className="absolute -bottom-2 left-8 w-4 h-4 bg-postit/60 border-b-2 border-r-2 border-pencil/30 rotate-45"
          />
        </div>

        {/* Dad emoji with subtle wiggle */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-wiggle">
          <span className="text-5xl" role="img" aria-label="bapak">👨</span>
        </div>

        {/* Decorative doodles — small stars/sparkles */}
        <svg className="absolute top-2 right-2 w-5 h-5 text-accent/40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2 2.4-7.2-6-4.8h7.6z" />
        </svg>
        <svg className="absolute bottom-8 left-4 w-4 h-4 text-ink/30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2 2.4-7.2-6-4.8h7.6z" />
        </svg>
        <svg className="absolute top-12 right-6 w-3 h-3 text-pencil/20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2 2.4-7.2-6-4.8h7.6z" />
        </svg>

        {/* Hand-drawn underline squiggle */}
        <svg className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-3" viewBox="0 0 100 12" fill="none">
          <path
            d="M2 8 C 15 2, 25 12, 40 6 C 55 0, 65 12, 80 6 C 88 2, 95 8, 98 4"
            stroke="#2d2d2d"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <p className="font-heading text-lg text-pencil/70 -rotate-[0.5deg]">
          Pilih kategori di atas ☝️
        </p>
        <p className="font-body text-sm text-pencil/40">
          lalu pencet <span className="font-heading text-accent/70 font-bold">Generate!</span>
        </p>
      </div>

      {/* Decorative notebook line */}
      <div className="mt-5 mx-auto max-w-[200px]">
        <svg viewBox="0 0 200 8" className="w-full" fill="none">
          <path
            d="M4 4 C 30 2, 50 6, 80 4 C 110 2, 140 6, 196 4"
            stroke="#e5e0d8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
