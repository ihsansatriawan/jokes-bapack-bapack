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
