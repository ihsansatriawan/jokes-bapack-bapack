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
