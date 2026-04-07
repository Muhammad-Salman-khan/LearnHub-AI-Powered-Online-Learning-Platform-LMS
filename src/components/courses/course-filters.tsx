"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface CourseFiltersProps {
  categories: string[];
  levels: string[];
  priceOptions: { value: string; label: string }[];
  currentParams: {
    search?: string;
    category?: string;
    level?: string;
    price?: string;
  };
}

/**
 * CourseFilters - Client-side filter component
 *
 * DESIGN.md Compliance:
 * - No-Line Rule: No 1px borders for sectioning
 * - Surface Hierarchy: Uses tonal layering
 * - Amber Accent: Focus states use primary_container
 * - Molten Spark: Input focus has bottom-only amber line
 */
export function CourseFilters({
  categories,
  levels,
  priceOptions,
  currentParams,
}: CourseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Update URL params when filters change
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams as any);
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-[#1b1b1b] mb-4"
      >
        <span className="text-sm font-medium text-[#e2e2e2]">Filters</span>
        <span className="material-symbols-outlined text-[#f97316]">
          {isMobileOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {/* Filters Panel */}
      <div
        className={`${isMobileOpen ? "block" : "hidden"} lg:block bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#584237]/10 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#e2e2e2]">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-xs text-[#f97316] hover:text-[#ffb690] transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Price Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#8a8a8a] mb-3">
              Price
            </h4>
            <div className="space-y-2">
              {priceOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="price"
                    value={option.value}
                    checked={
                      currentParams.price === option.value ||
                      (!currentParams.price && option.value === "all")
                    }
                    onChange={(e) => updateFilter("price", e.target.value)}
                    className="w-4 h-4 rounded-full border-[#584237]/30 bg-[#0e0e0e] text-[#f97316] focus:ring-[#f97316] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#e2e2e2] group-hover:text-[#f97316] transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#8a8a8a] mb-3">
              Category
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={category}
                    checked={currentParams.category === category}
                    onChange={(e) =>
                      updateFilter("category", e.target.checked ? category : "")
                    }
                    className="w-4 h-4 rounded border-[#584237]/30 bg-[#0e0e0e] text-[#f97316] focus:ring-[#f97316] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#e2e2e2] group-hover:text-[#f97316] transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#8a8a8a] mb-3">
              Level
            </h4>
            <div className="space-y-2">
              {levels.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={level}
                    checked={currentParams.level === level}
                    onChange={(e) =>
                      updateFilter("level", e.target.checked ? level : "")
                    }
                    className="w-4 h-4 rounded border-[#584237]/30 bg-[#0e0e0e] text-[#f97316] focus:ring-[#f97316] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#e2e2e2] group-hover:text-[#f97316] transition-colors">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter (Optional) */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#8a8a8a] mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    className="w-4 h-4 rounded-full border-[#584237]/30 bg-[#0e0e0e] text-[#f97316] focus:ring-[#f97316] focus:ring-offset-0"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-sm ${i < rating ? "text-[#f97316]" : "text-[#5a5a5a]"}`}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-sm text-[#e2e2e2] ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
