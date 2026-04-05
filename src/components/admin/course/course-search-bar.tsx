"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface CourseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function CourseSearchBar({
  value,
  onChange,
  placeholder = "Search by course title...",
  debounceMs = 300,
}: CourseSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative max-w-md group">
      <span className="material-symbols-outlined text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-base transition-colors duration-300 group-focus-within:text-primary">
        search
      </span>
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 pl-10 h-11 transition-all duration-300 group-focus-within:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-all duration-300 hover:scale-110"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  );
}
