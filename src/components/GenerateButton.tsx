import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function GenerateButton({ onClick, loading }: GenerateButtonProps) {
  return (
    <div className="px-5 pt-1 pb-4">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="wobbly w-full border-[3px] border-pencil bg-accent px-4 py-3.5
          font-heading text-xl font-bold text-white
          shadow-hard rotate-[0.5deg]
          transition-all duration-100 cursor-pointer
          hover:translate-x-[2px] hover:translate-y-[2px] hover:-rotate-[0.5deg] hover:shadow-hard-hover
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Mikir dulu...
          </span>
        ) : (
          "🎲 Generate Jokes!"
        )}
      </button>
    </div>
  );
}
