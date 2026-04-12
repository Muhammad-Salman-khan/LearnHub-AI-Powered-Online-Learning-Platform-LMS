"use client";

import { useState } from "react";
import { markChapterComplete } from "@/server/action";
import { toast } from "sonner";

interface MarkCompleteButtonProps {
  chapterId: string;
}

export function MarkCompleteButton({ chapterId }: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const result = await markChapterComplete(chapterId);
      if (result.success) {
        setIsCompleted(true);
        toast.success("Chapter marked as complete!");
      } else {
        toast.error(result.error || "Failed to mark complete.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isCompleted || isLoading}
      className={`
      w-full md:w-auto px-8 h-14 rounded-lg font-bold text-base transition-all duration-300
      flex items-center justify-center gap-3
      ${
        isCompleted
          ? "bg-transparent border border-green-500 text-green-500 hover:bg-green-500/10"
          : "bg-primary text-primary-foreground hover:opacity-90 amber-glow disabled:opacity-50"
      }
    `}
    >
      <span className="material-symbols-outlined">
        {isCompleted ? "check_circle" : isLoading ? "hourglass_empty" : "check_circle_outline"}
      </span>
      {isCompleted ? "Completed" : isLoading ? "Marking..." : "Mark as Complete"}
    </button>
  );
}
