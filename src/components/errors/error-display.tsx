"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  statusCode?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * ErrorDisplay - Dynamic Error UI
 *
 * Design System: Obsidian & Amber Editorial
 * - Background: #131313 (Obsidian)
 * - Accent: #F97316 (Molten Amber)
 * - Typography: Plus Jakarta Sans
 * - Spacing: Aggressive negative space (24 token)
 */
export function ErrorDisplay({
  statusCode = 500,
  title = "Internal Server Error",
  message = "The obsidian depths are currently unreachable.",
  onRetry,
}: ErrorDisplayProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      await onRetry();
      setIsRetrying(false);
    } else {
      router.refresh();
    }
  };

  // Dynamic color based on error type
  const getAccentColor = (code: number) => {
    if (code === 404) return "from-[#ffb690] to-[#F97316]"; // Amber
    if (code === 403) return "from-[#ff6b6b] to-[#ee5253]"; // Red
    return "from-[#ffb690] to-[#F97316]"; // Default Amber
  };

  return (
    <>
      {/* Background - Obsidian Base */}
      <div className="fixed inset-0 bg-[#131313]">
        {/* Ambient Amber Glow - Top Right */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-[#131313] to-[#0e0e0e]" />
      </div>

      {/* Main Container */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 overflow-hidden">
        {/* Header - LEARNHUB Branding */}
        <header
          className={`absolute top-0 left-0 w-full p-6 sm:p-8 transition-all duration-700 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <Link href="/" className="inline-block">
            <span className="text-2xl sm:text-3xl font-bold text-[#e2e2e2] tracking-tight hover:text-[#F97316] transition-colors duration-300">
              LEARNHUB
            </span>
          </Link>
        </header>

        {/* Error Content */}
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Dynamic Status Code */}
          <div className="relative mb-4 sm:mb-6">
            <h1 className="text-[120px] sm:text-[160px] lg:text-[200px] font-bold leading-none tracking-tighter">
              <span
                className={`bg-gradient-to-br ${getAccentColor(statusCode)} bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(249,115,22,0.3)]`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {statusCode}
              </span>
            </h1>

            {/* Dynamic Error Label */}
            <p className="text-sm sm:text-base uppercase tracking-[0.3em] text-[#F97316] font-medium mt-2 sm:mt-4">
              {title}
            </p>
          </div>

          {/* Dynamic Main Message */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2e2] mb-6 sm:mb-8 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Something went wrong.
          </h2>

          {/* Dynamic Descriptive Text */}
          <p
            className="text-base sm:text-lg text-[#e0c0b1] mb-12 sm:mb-16 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Primary CTA - Try Again */}
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-br from-[#ffb690] to-[#F97316] rounded-md font-semibold text-[#131313] text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#ffb690] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3">
                <svg
                  className={`w-5 h-5 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{isRetrying ? "Retrying..." : "TRY AGAIN"}</span>
              </span>
            </button>

            {/* Secondary Action - Go Back */}
            <button
              onClick={() => router.back()}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-[#e2e2e2] font-medium text-base sm:text-lg transition-all duration-300 hover:text-[#F97316] border border-[#584237]/15 hover:border-[#F97316]/30 rounded-md cursor-pointer"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>GO BACK</span>
            </button>
          </div>
        </div>

        {/* Footer - System Status */}
        <footer
          className={`absolute bottom-0 left-0 w-full p-6 sm:p-8 text-center transition-all duration-700 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F97316]/40 animate-pulse" />
            <span
              className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              System Status: Restricted
            </span>
          </div>
          <p
            className="text-xs text-[#5a5a5a] uppercase tracking-wider"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            © 2024 LEARNHUB ARCHIVE
          </p>
        </footer>
      </main>

      {/* Ambient Particle Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[400px] h-[400px] bg-[#F97316]/[0.02] rounded-full blur-[80px]"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 25}%`,
              animation: `float ${15 + i * 5}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
