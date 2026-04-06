"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen - "Syncing Neural Pathways"
 *
 * Design Philosophy: The Kinetic Monolith
 * - Obsidian background (#131313) with amber accents (#F97316)
 * - Editorial spacing and technical typography
 * - Animated loading ring with gradient
 * - Pulsing status indicators
 * - Encrypted core status badge
 */

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(0);
  const [dots, setDots] = useState("");

  const loadingTexts = [
    "SYNCING NEURAL PATHWAYS...",
    "OPTIMIZING COGNITION MATRICES",
    "CALIBRATING SYNAPTIC WEIGHTS",
    "ESTABLISHING SECURE CONNECTION",
  ];

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    // Rotate loading texts
    const textInterval = setInterval(() => {
      setLoadingText((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <>
      {/* Background - Obsidian Base */}
      <div className="fixed inset-0 bg-[#131313] overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-[#131313] to-[#0e0e0e]" />
      </div>

      {/* Main Container */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* LEARNHUB Logo */}
        <header className="absolute top-12 sm:top-16 transition-all duration-700">
          <div className="flex flex-col items-center gap-3">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#e2e2e2] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              LEARNHUB
            </h1>
            {/* Animated Underline */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#F97316] to-transparent animate-pulse" />
          </div>
        </header>

        {/* Loading Content */}
        <div className="flex flex-col items-center gap-8 sm:gap-12 max-w-md mx-auto">
          {/* Animated Loading Ring */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#F97316]/10 blur-sm" />

            {/* Main Ring Container */}
            <div className="relative w-full h-full">
              {/* Background Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                />
                {/* Progress Ring with Gradient */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${283 * (progress / 100)} 283`}
                  className="transition-all duration-100 ease-linear"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))",
                  }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ffb690" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-2 h-2 rounded-full bg-[#F97316]/60 animate-pulse"
                  style={{ boxShadow: "0 0 20px rgba(249, 115, 22, 0.8)" }}
                />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3">
            {/* Primary Status - Animated */}
            <h2
              className="text-base sm:text-lg font-semibold text-[#F97316] uppercase tracking-[0.2em] transition-all duration-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loadingTexts[loadingText]}
            </h2>

            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    boxShadow: "0 0 8px rgba(249, 115, 22, 0.6)",
                  }}
                />
              ))}
            </div>

            {/* Secondary Status */}
            <p
              className="text-sm text-[#8a8a8a] uppercase tracking-[0.15em] transition-all duration-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loadingText === 0 && "OPTIMIZING COGNITION MATRICES"}
              {loadingText === 1 && "CALIBRATING SYNAPTIC WEIGHTS"}
              {loadingText === 2 && "ESTABLISHING SECURE CONNECTION"}
              {loadingText === 3 && "VERIFYING NEURAL INTEGRITY"}
            </p>
          </div>

          {/* Progress Bar (Optional Visual) */}
          <div className="w-full max-w-xs">
            <div className="h-px bg-gradient-to-r from-transparent via-[#584237]/30 to-transparent mb-4" />
            <div className="flex justify-between text-xs text-[#5a5a5a] uppercase tracking-wider">
              <span>Initializing</span>
              <span className="text-[#F97316]">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Footer - Security Status */}
        <footer className="absolute bottom-8 sm:bottom-12 w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e0e0e]/60 backdrop-blur-sm border border-[#584237]/15">
            {/* Lock Icon */}
            <svg
              className="w-3.5 h-3.5 text-[#F97316]/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span
              className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Encrypted Core Active
            </span>
          </div>

          {/* Copyright */}
          <p
            className="mt-4 text-xs text-[#5a5a5a] uppercase tracking-wider"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            © 2024 LEARNHUB ARCHIVE
          </p>
        </footer>
      </main>

      {/* Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[300px] h-[300px] bg-[#F97316]/[0.02] rounded-full blur-[60px]"
            style={{
              top: `${10 + i * 20}%`,
              left: `${5 + i * 15}%`,
              animation: `float ${20 + i * 5}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
