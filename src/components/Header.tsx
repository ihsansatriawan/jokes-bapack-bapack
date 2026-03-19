export default function Header() {
  return (
    <header className="relative border-b-[3px] border-dashed border-pencil bg-white px-6 pt-10 pb-6 text-center overflow-hidden">
      {/* Tape decoration */}
      <div
        className="absolute -top-[6px] left-1/2 h-6 w-24 -translate-x-1/2 rotate-[1.5deg]"
        style={{
          background: "linear-gradient(135deg, rgba(200, 200, 180, 0.6), rgba(220, 215, 195, 0.4))",
          border: "1px solid rgba(150, 150, 130, 0.3)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      />

      {/* Corner doodle — top left */}
      <svg className="absolute top-3 left-3 w-6 h-6 text-pencil/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>

      {/* Corner doodle — top right */}
      <svg className="absolute top-4 right-4 w-5 h-5 text-pencil/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
      </svg>

      {/* Dad emoji */}
      <div className="text-4xl mb-2 animate-fade-in-up">👨</div>

      {/* Title */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-pencil -rotate-1 animate-fade-in-up stagger-1">
        Jokes Bapak<span className="text-accent">!</span>Bapak
      </h1>

      {/* Subtitle with hand-drawn underline */}
      <div className="relative inline-block mt-2 animate-fade-in-up stagger-2">
        <p className="font-body text-base md:text-lg text-pencil/50">
          jokes receh buat para ayah ~
        </p>
        <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
          <path
            d="M2 5 C 40 2, 80 7, 120 4 C 150 2, 180 6, 198 3"
            stroke="#ff4d4d"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>
    </header>
  );
}
