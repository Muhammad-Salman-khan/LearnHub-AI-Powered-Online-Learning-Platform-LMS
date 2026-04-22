"use client";

/**
 * LoginPage — Scholarly Architect Design System
 *
 * Layout: 50/50 split grid
 *   Left  — architectural accent panel (surface-container-low + primary overlay)
 *   Right — white form panel with credentials login + Google OAuth
 *
 * Backend preserved exactly: signIn("credentials"), signIn("google"),
 * role-based redirect via /api/auth/session. No server logic changed.
 */

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import GoogleIcon from "@/components/ui/GoogleIcon";
import LogInIcon from "@/components/ui/loginicon";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";

export default function LoginPage() {
  /* ── Auth state ──────────────────────────────────────────────────── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── UI state ────────────────────────────────────────────────────── */
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  /* Auto-dismiss error toast after 5 s */
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  /* ── Credentials login handler (backend unchanged) ───────────────── */
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.ok) {
        /* Fetch session to determine role-based redirect */
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role?.toUpperCase();

        if (role === "ADMIN") window.location.href = "/dashboard/admin";
        else if (role === "INSTRUCTOR") window.location.href = "/dashboard/instructor";
        else window.location.href = "/dashboard/student";
      } else {
        setError(res?.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Google OAuth handler (backend unchanged) ────────────────────── */
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard/student" });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    /*
     * Full-viewport 50/50 grid.
     * On mobile (< md) we show only the form panel (left panel hidden).
     */
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ════════════════════════════════════════════════════════════════
          LEFT PANEL — Architectural accent
          Background: surface-container-low
          Overlay: primary at 5% opacity to tint the panel blue-cream
          Hidden on mobile — form takes full width.
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex flex-col justify-between relative overflow-hidden"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        {/* Subtle primary tint overlay — "felt not seen" per design spec */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(0, 64, 161, 0.04)" }}
        />

        {/* Brand mark — top-left */}
        <div className="relative z-10 p-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-2xl"
              style={{ color: "var(--primary)" }}
            >
              school
            </span>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
            >
              LearnHub
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Architectural typographic hero — centred vertically */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          {/* Large display number — Manrope, editorial feel */}
          <p
            className="text-8xl font-extrabold leading-none mb-6 select-none"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--primary-fixed-dim)",
            }}
          >
            01
          </p>

          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Welcome back to your workspace
          </h1>

          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Continue your learning journey. Your courses, progress, and
            certificates are waiting.
          </p>

          {/* Tonal accent line — replaces decorative border per No-Line rule */}
          <div
            className="mt-10 w-12 h-1"
            style={{ backgroundColor: "var(--primary)" }}
          />
        </div>

        {/* Footer copy */}
        <div className="relative z-10 px-10 py-6">
          <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
            LearnHub — AI-Powered Online Learning Platform
          </p>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════
          RIGHT PANEL — Authentication form
          Background: surface-container-lowest — pops against left
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col justify-center px-8 py-12 md:px-16"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >

        {/* Mobile-only brand mark */}
        <div className="flex md:hidden items-center gap-2.5 mb-10">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ color: "var(--primary)" }}
          >
            school
          </span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            LearnHub
          </span>
        </div>

        {/* Form header */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Sign in
          </h2>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            New to LearnHub?{" "}
            <Link
              href="/signup"
              className="scholar-link font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* ── Error message — left-edge accent per design spec ─────────── */}
        {error && (
          <div
            className="mb-6 flex items-start gap-3 px-4 py-3 animate-fade-in"
            style={{
              backgroundColor: "var(--error-container)",
              borderLeft: "3px solid var(--error)",
            }}
          >
            <span
              className="material-symbols-outlined text-lg shrink-0 mt-0.5"
              style={{ color: "var(--error)" }}
            >
              error
            </span>
            <p className="text-sm flex-1" style={{ color: "var(--on-error-container)" }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss"
              style={{ color: "var(--on-error-container)" }}
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* ── Credentials form ─────────────────────────────────────────── */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Institutional email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@institution.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
              disabled={loading}
              autoComplete="email"
              className="ghost-border w-full h-11 px-4 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "var(--surface-container-low)",
                color: "var(--on-surface)",
              }}
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="text-xs transition-colors disabled:opacity-50"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              required
              disabled={loading}
              autoComplete="current-password"
              className="ghost-border w-full h-11 px-4 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "var(--surface-container-low)",
                color: "var(--on-surface)",
              }}
            />
          </div>

          {/* Primary CTA — "Enter Workspace" matches design copy */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 mt-2"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <LogInIcon size={16} color="currentColor" strokeWidth={2.5} />
                <span>Enter Workspace</span>
              </>
            )}
          </button>
        </form>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
          <span className="text-xs uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
        </div>

        {/* ── Federated login options ───────────────────────────────────── */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full h-11 flex items-center justify-center gap-3 text-sm font-medium rounded-sm transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: "var(--surface-container-low)",
              color: "var(--on-surface)",
            }}
          >
            <GoogleIcon size={16} />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Terms note */}
        <p className="mt-8 text-xs text-center" style={{ color: "var(--on-surface-variant)" }}>
          By signing in you agree to LearnHub&apos;s{" "}
          <span className="scholar-link cursor-pointer">Terms of Service</span>{" "}
          and{" "}
          <span className="scholar-link cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
