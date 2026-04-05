"use client";

interface MarkCompleteButtonProps {
  isCompleted: boolean;
}

export function MarkCompleteButton({ isCompleted }: MarkCompleteButtonProps) {
  return (
    <button
      className={`
      w-full md:w-auto px-8 h-14 rounded-lg font-bold text-base transition-all duration-300
      flex items-center justify-center gap-3
      ${
        isCompleted
          ? "bg-transparent border border-green-500 text-green-500 hover:bg-green-500/10"
          : "bg-primary text-primary-foreground hover:opacity-90 amber-glow"
      }
    `}
    >
      <span className="material-symbols-outlined">
        {isCompleted ? "check_circle" : "check_circle_outline"}
      </span>
      {isCompleted ? "Completed" : "Mark as Complete"}
    </button>
  );
}
