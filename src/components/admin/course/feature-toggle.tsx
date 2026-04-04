"use client";

import { Button } from "@/components/ui/button";

interface FeatureToggleProps {
  isFeatured: boolean;
  courseId: string;
  onToggle: (courseId: string, isFeatured: boolean) => void;
}

export function FeatureToggle({
  isFeatured,
  courseId,
  onToggle,
}: FeatureToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(courseId, !isFeatured)}
      className={`border transition-all duration-300 hover:scale-105 ${
        isFeatured
          ? "border-primary/50 text-primary bg-primary/10 hover:bg-primary/20"
          : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
      }`}
      title={isFeatured ? "Remove from featured" : "Feature on landing page"}
    >
      <span
        className={`material-symbols-outlined text-base ${isFeatured ? "animate-pulse" : ""}`}
      >
        {isFeatured ? "star" : "star_outline"}
      </span>
    </Button>
  );
}
