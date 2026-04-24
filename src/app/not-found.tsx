/**
 * NotFound — Scholarly Architect Design System
 *
 * 404 error page with Scholarly Architect styling.
 * Background: surface (#fcf9f8)
 * Accent: primary (#0040a1)
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#fcf9f8" }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-2xl font-extrabold tracking-tighter"
        style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
      >
        <span className="material-symbols-outlined text-2xl" style={{ color: "#0040a1" }}>
          account_balance
        </span>
        LearnHub
      </Link>

      {/* Error Content */}
      <div className="text-center max-w-lg">
        {/* Status Code */}
        <h1
          className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter mb-4"
          style={{ fontFamily: "var(--font-headline)", color: "#0040a1" }}
        >
          404
        </h1>

        <p
          className="text-sm uppercase tracking-widest mb-6"
          style={{ color: "#0040a1", fontFamily: "var(--font-body)" }}
        >
          Page Not Found
        </p>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-headline)", color: "#1b1b1c" }}
        >
          This page does not exist
        </h2>

        <p className="text-base mb-8" style={{ color: "#424654" }}>
          The resource you are looking for could not be found. It may have been
          moved, renamed, or removed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 rounded font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#0040a1", color: "#ffffff" }}
          >
            Go Home
          </Link>

          <Link
            href="/courses"
            className="px-8 py-3 rounded font-semibold text-sm transition-all hover:bg-[#e5e2e1]"
            style={{ backgroundColor: "#f0eded", color: "#1b1b1c" }}
          >
            Browse Courses
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="absolute bottom-6 text-center"
        style={{ color: "#737785" }}
      >
        <p className="text-xs">
          © 2024 LearnHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
