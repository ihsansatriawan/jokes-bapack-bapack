import { CATEGORIES, type CategoryId } from "@/lib/constants";

const WOBBLY_CLASSES = ["wobbly", "wobbly-2", "wobbly-3", "wobbly-4"];

interface CategoryChipsProps {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export default function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="px-5 pt-4 pb-2">
      <p className="font-heading text-sm font-bold uppercase tracking-wider text-pencil/50 mb-2 relative inline-block">
        Pilih Kategori
        <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
          background: "repeating-linear-gradient(90deg, #2d2d2d 0px, #2d2d2d 4px, transparent 4px, transparent 8px)"
        }} />
      </p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelect(selected === cat.id ? null : cat.id)}
            className={`
              ${WOBBLY_CLASSES[i % WOBBLY_CLASSES.length]}
              border-2 border-pencil px-3.5 py-1.5 font-body text-[15px] text-pencil
              shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]
              transition-transform duration-100 cursor-pointer
              ${selected === cat.id
                ? "bg-postit -translate-x-0.5 -translate-y-0.5 -rotate-1 shadow-[5px_5px_0px_0px_rgba(45,45,45,0.2)]"
                : "bg-white hover:rotate-1"
              }
            `}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
