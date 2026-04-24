"use client";

/**
 * SignUpPage — Scholarly Architect Design System
 *
 * Layout: Asymmetric 5-col grid (hidden on mobile → full-width form)
 *   Left  (3 cols) — architectural accent panel (surface-container-low)
 *   Right (2 cols) — white form panel
 *
 * Role selection cards: Student / Instructor (stored in role state,
 * sent to /api/auth/register as `role` field).
 *
 * Backend preserved exactly:
 *   POST /api/auth/register → { name, email, password, role }
 *   signIn("google", { callbackUrl: "/dashboard" })
 *   Client-side: password length, password match, terms checkbox
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/ui/GoogleIcon";
import LogInIcon from "@/components/ui/loginicon";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";

/* Role option shape */
type Role = "STUDENT" | "INSTRUCTOR";

interface RoleCard {
  value: Role;
  icon: string;
  label: string;
  description: string;
}

const ROLE_CARDS: RoleCard[] = [
  {
    value: "STUDENT",
    icon: "school",
    label: "Student",
    description: "Access courses, track progress, earn certificates",
  },
  {
    value: "INSTRUCTOR",
    icon: "cast_for_education",
    label: "Instructor",
    description: "Create and publish courses, manage students",
  },
];

export default function SignUpPage() {
  /* ── Form state ──────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<Role>("STUDENT");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  /* ── UI state ────────────────────────────────────────────────────── */
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  /* Auto-dismiss error after 5 s */
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  /* ── Registration handler (backend unchanged) ────────────────────── */
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms & Conditions to continue");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Google OAuth handler (backend unchanged) ────────────────────── */
  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Google sign-up failed. Please try again.");
    }
  };

  return (
    /*
     * Full-viewport asymmetric grid: 3fr / 2fr on desktop.
     * On mobile the left panel is hidden; form takes full width.
     */
    <div className="min-h-screen grid lg:grid-cols-5">

      {/* ════════════════════════════════════════════════════════════════
          LEFT PANEL — Architectural accent (3 of 5 columns)
          Background: surface-container-low
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between lg:col-span-3 relative overflow-hidden"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        {/* Subtle primary tint overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(0, 64, 161, 0.04)" }}
        />

        {/* Brand mark */}
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

        {/* Typographic hero */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          <p
            className="text-8xl font-extrabold leading-none mb-6 select-none"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--primary-fixed-dim)",
            }}
          >
            02
          </p>

          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Construct your learning workspace
          </h1>

          <p className="text-base leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
            Join thousands of students and instructors. Track your progress,
            earn certificates, and learn at your own pace.
          </p>

          {/* Tonal accent line */}
          <div
            className="mt-10 w-12 h-1"
            style={{ backgroundColor: "var(--primary)" }}
          />

          {/* Social proof row */}
          <div className="mt-10 flex items-center gap-6">
            {[
              { number: "12K+", label: "Students" },
              { number: "480+", label: "Courses" },
              { number: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: "var(--primary)",
                  }}
                >
                  {stat.number}
                </p>
                <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-10 py-6">
          <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
            LearnHub — AI-Powered Online Learning Platform
          </p>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════
          RIGHT PANEL — Registration form (2 of 5 columns)
          Background: surface-container-lowest
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col justify-center px-8 py-12 md:px-12 lg:col-span-2 overflow-y-auto"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >

        {/* Mobile-only brand mark */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <span className="material-symbols-outlined text-2xl" style={{ color: "var(--primary)" }}>
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
        <div className="mb-6">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}
          >
            Create account
          </h2>
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            Already have an account?{" "}
            <Link href="/login" className="scholar-link font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Error banner — left-edge accent per design spec ──────────── */}
        {error && (
          <div
            className="mb-5 flex items-start gap-3 px-4 py-3 animate-fade-in"
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

        {/* ── Role selection cards ──────────────────────────────────────── */}
        {/*
         * Design spec: Large selectable role cards
         * Unselected: surface-container-high, no border
         * Selected:   primary bg + on-primary text
         * Roundedness: xl (0.75rem), padding: aggressive (2rem feel)
         */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ROLE_CARDS.map((card) => {
            const isSelected = role === card.value;
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => setRole(card.value)}
                className="flex flex-col items-start gap-2 p-4 rounded-xl transition-all duration-200 text-left"
                style={{
                  backgroundColor: isSelected ? "var(--primary)" : "var(--surface-container-high)",
                  color: isSelected ? "var(--on-primary)" : "var(--on-surface)",
                }}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ color: isSelected ? "var(--on-primary)" : "var(--primary)" }}
                >
                  {card.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-headline)" }}>
                    {card.label}
                  </p>
                  <p
                    className="text-xs mt-0.5 leading-tight"
                    style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "var(--on-surface-variant)" }}
                  >
                    {card.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Registration form ─────────────────────────────────────────── */}
        <form onSubmit={handleSignup} className="space-y-4">

          {/* First + Last name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="block text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="given-name"
                className="ghost-border w-full h-10 px-3 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
                style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface)" }}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="block text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="family-name"
                className="ghost-border w-full h-10 px-3 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
                style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface)" }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>
              Institutional email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@institution.edu"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
              className="ghost-border w-full h-10 px-3 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface)" }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="text-xs disabled:opacity-50"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              disabled={loading}
              autoComplete="new-password"
              className="ghost-border w-full h-10 px-3 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface)" }}
            />
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>
                Confirm password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={loading}
                className="text-xs disabled:opacity-50"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="new-password"
              className="ghost-border w-full h-10 px-3 text-sm rounded-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "var(--surface-container-low)",
                color: "var(--on-surface)",
                /* Left-edge red accent if mismatch — per design spec */
                borderLeft:
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "2px solid var(--error)"
                    : undefined,
              }}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs" style={{ color: "var(--error)" }}>
                Passwords do not match
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => { setAcceptedTerms(e.target.checked); if (error) setError(null); }}
              disabled={loading}
              className="mt-0.5 h-4 w-4 shrink-0 rounded-sm accent-primary disabled:opacity-50"
              required
            />
            <span className="text-xs leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
              I agree to LearnHub&apos;s{" "}
              <Link href="/terms" className="scholar-link" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="scholar-link" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Primary CTA — "Construct Account" matches design copy */}
          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 mt-1"
            style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <LogInIcon size={16} color="currentColor" strokeWidth={2.5} />
                <span>Construct Account</span>
              </>
            )}
          </button>
        </form>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="my-5 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
          <span className="text-xs uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
        </div>

        {/* ── Google signup ─────────────────────────────────────────────── */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignup}
          className="w-full h-11 flex items-center justify-center gap-3 text-sm font-medium rounded-sm transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface)" }}
        >
          <GoogleIcon size={16} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
