"use client";

/**
 * CourseFilters — Scholarly Architect Design System
 *
 * Filter sidebar for the course catalog.
 * No-Line Rule: no 1px borders for sectioning; background shifts define groups.
 * Primary blue (#0040a1) used for active/checked states.
 * Mobile: collapsible panel via toggle button.
 */

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

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

export function CourseFilters({
  categories,
  levels,
  priceOptions,
  currentParams,
}: CourseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* Update a single URL query param (or remove if empty/all) */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams as Record<string, string>);
    if (value === "all" || !value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => router.push(pathname);

  /* ── Shared label component (inline to avoid extra file) ─────────── */
  const FilterLabel = ({ title }: { title: string }) => (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "#737785" }}
    >
      {title}
    </p>
  );

  return (
    <>
      {/* Mobile toggle button — visible only < lg */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 mb-3 rounded-sm"
        style={{ backgroundColor: "#f0eded", color: "#1b1b1c" }}
      >
        <span className="text-sm font-medium">Filters</span>
        <span className="material-symbols-outlined text-lg" style={{ color: "#0040a1" }}>
          {isMobileOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {/* Filter panel — hidden on mobile unless toggled */}
      <div
        className={`${isMobileOpen ? "block" : "hidden"} lg:block rounded-lg overflow-hidden`}
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Panel header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: "#f6f3f2" }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
          >
            Refine results
          </h3>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs scholar-link"
          >
            Clear all
          </button>
        </div>

        <div className="p-5 space-y-7">

          {/* ── Price ───────────────────────────────────────────────────── */}
          <div>
            <FilterLabel title="Price" />
            <div className="space-y-2.5">
              {priceOptions.map((option) => {
                const isChecked =
                  currentParams.price === option.value ||
                  (!currentParams.price && option.value === "all");
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={isChecked}
                      onChange={(e) => updateFilter("price", e.target.value)}
                      className="w-4 h-4 accent-[#0040a1]"
                    />
                    <span className="text-sm" style={{ color: isChecked ? "#0040a1" : "#424654" }}>
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Category ─────────────────────────────────────────────────── */}
          <div>
            <FilterLabel title="Category" />
            <div className="space-y-2.5 max-h-52 overflow-y-auto sidebar-scroll pr-1">
              {categories.map((category) => {
                const isChecked = currentParams.category === category;
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={isChecked}
                      onChange={(e) =>
                        updateFilter("category", e.target.checked ? category : "")
                      }
                      className="w-4 h-4 rounded-sm accent-[#0040a1]"
                    />
                    <span className="text-sm" style={{ color: isChecked ? "#0040a1" : "#424654" }}>
                      {category}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Level ────────────────────────────────────────────────────── */}
          <div>
            <FilterLabel title="Level" />
            <div className="space-y-2.5">
              {levels.map((level) => {
                const isChecked = currentParams.level === level;
                return (
                  <label
                    key={level}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={level}
                      checked={isChecked}
                      onChange={(e) =>
                        updateFilter("level", e.target.checked ? level : "")
                      }
                      className="w-4 h-4 rounded-sm accent-[#0040a1]"
                    />
                    <span className="text-sm" style={{ color: isChecked ? "#0040a1" : "#424654" }}>
                      {level}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Rating ───────────────────────────────────────────────────── */}
          <div>
            <FilterLabel title="Minimum Rating" />
            <div className="space-y-2.5">
              {[4, 3, 2].map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    className="w-4 h-4 accent-[#0040a1]"
                  />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-sm ${i < rating ? "fill-icon" : ""}`}
                        style={{ color: i < rating ? "#0040a1" : "#c3c6d6" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-xs ml-1" style={{ color: "#424654" }}>& up</span>
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
