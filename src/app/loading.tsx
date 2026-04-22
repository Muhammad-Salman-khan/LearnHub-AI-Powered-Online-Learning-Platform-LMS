/**
 * Root Loading — Scholarly Architect Design System
 *
 * Centered spinner with LearnHub branding.
 */

export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#fcf9f8" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="material-symbols-outlined text-4xl"
          style={{ color: "#0040a1" }}
        >
          account_balance
        </span>
        <span
          className="text-2xl font-extrabold tracking-tighter"
          style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
        >
          LearnHub
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: "#f0eded" }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#0040a1", borderTopColor: "transparent" }}
        />
      </div>
    </div>
  );
}
