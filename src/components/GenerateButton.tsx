interface GenerateButtonProps {
  onClick: () => void;
}

export default function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <div className="px-5 pt-1 pb-4">
      <button
        type="button"
        onClick={onClick}
        className="wobbly w-full border-[3px] border-pencil bg-accent px-4 py-3.5
          font-heading text-xl font-bold text-white
          shadow-hard rotate-[0.5deg]
          transition-all duration-100 cursor-pointer
          hover:translate-x-[2px] hover:translate-y-[2px] hover:-rotate-[0.5deg] hover:shadow-hard-hover
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        🎲 Generate Jokes!
      </button>
    </div>
  );
}
