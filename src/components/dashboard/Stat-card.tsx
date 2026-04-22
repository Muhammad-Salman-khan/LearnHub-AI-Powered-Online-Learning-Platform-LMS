/**
 * StatCard — Scholarly Architect Design System
 *
 * Tonal stat card: surface-container-lowest on surface-container-low page.
 * Left-edge 4px primary accent bar per instructor design.
 * No glow, no amber, no gradients. Manrope for the number value.
 * Lucide icon + color variant still accepted for API compatibility.
 * Uses CSS variables for dark mode support.
 */

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "amber" | "green" | "blue" | "primary";
}

/* Map old color names to primary-blue accents in Scholarly system */
const ACCENT_COLORS: Record<string, string> = {
  amber:   "var(--primary)",
  green:   "var(--primary)",
  blue:    "var(--primary)",
  primary: "var(--primary)",
};

export default function StatCard({ label, value, icon: Icon, color = "primary" }: StatCardProps) {
  const accent = ACCENT_COLORS[color] ?? "var(--primary)";

  return (
    <div
      className="rounded-lg p-5 flex items-start gap-4"
      style={{
        backgroundColor: "var(--surface-container-lowest)",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)" }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--on-surface-variant)" }}>
          {label}
        </p>
        <p
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
