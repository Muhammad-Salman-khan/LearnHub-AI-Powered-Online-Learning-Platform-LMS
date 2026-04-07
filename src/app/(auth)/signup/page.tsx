"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// ✅ shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Custom icons
import LogInIcon from "@/components/ui/loginicon";
import GoogleIcon from "@/components/ui/GoogleIcon";

/**
 * SignUpPage - User Registration
 *
 * Features:
 * - API registration with /api/auth/register
 * - Password validation (min 8 chars) + confirm password match
 * - Terms & conditions checkbox requirement
 * - Google OAuth sign-up option
 * - Loading states with disabled buttons + spinner
 * - Inline error popup (no browser alerts) - better UX
 * - Blurred animated background with hydration-safe animations
 * - Responsive design with shadcn/ui components
 * - Password visibility toggle for both fields
 *
 * Error Handling:
 * - Errors display in a dismissible banner at top of form
 * - Auto-dismiss after 5 seconds (optional)
 * - Clear error when user starts typing in any field
 */
export default function SignUpPage() {
  // 🔹 Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🔹 UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const router = useRouter();

  // ✅ Prevent hydration mismatch: only animate after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔹 Auto-dismiss error after 5 seconds (optional UX improvement)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 🔹 Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ✅ Clear error when user starts typing
    if (error) setError(null);
  };

  // 🔹 Handle credentials signup
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Clear previous errors

    // ✅ Client-side validations
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
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Show success inline instead of alert (optional)
        setError(null);
        // Optional: Show success message or redirect
        router.push("/login");
        router.refresh();
      } else {
        // ✅ Show inline error instead of alert
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // ✅ Show inline error instead of alert
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Handle Google OAuth signup
  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign-up error:", error);
      // ✅ Show inline error instead of alert
      setError("Google sign-up failed. Please try again.");
    }
  };

  return (
    <>
      {/* 🔹 BLURRED BACKGROUND OVERLAY - Fades in on mount */}
      <div
        className={`fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 🔹 MAIN CONTAINER - Centers the card */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 🔹 SIGNUP CARD - Slides up on mount */}
        <Card
          className={`w-full max-w-sm sm:max-w-md shadow-lg border-0 sm:border transition-all duration-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ INLINE ERROR POPUP - Dismissible banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 flex items-start gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-destructive text-lg shrink-0 mt-0.5">
                  error
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                  <p className="text-xs text-destructive/80 mt-0.5">
                    Please check your information and try again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-destructive/60 hover:text-destructive transition-colors shrink-0"
                  aria-label="Dismiss error"
                >
                  <span className="material-symbols-outlined text-base">
                    close
                  </span>
                </button>
              </div>
            )}

            <form onSubmit={handleSignup} id="signup-form">
              <div className="flex flex-col gap-4 sm:gap-5">
                
                {/* 🔹 LOGIN LINK - Name field ke UPAR */}
                <div className="text-center -mt-1 mb-1">
                  <Button
                    variant="link"
                    className="px-0 text-sm sm:text-base h-auto py-0"
                    asChild
                  >
                    <Link href="/login">
                      Already have an account? <span className="text-[#f97316] font-medium">Login</span>
                    </Link>
                  </Button>
                </div>

                {/* 👤 FULL NAME FIELD */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={loading}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    autoComplete="name"
                  />
                </div>

                {/* 📧 EMAIL FIELD */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    autoComplete="email"
                  />
                </div>

                {/* 🔒 PASSWORD FIELD with visibility toggle */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={loading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    disabled={loading}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                  />
                </div>

                {/* 🔐 CONFIRM PASSWORD FIELD */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confirmPassword" className="text-sm">
                      Confirm Password
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={loading}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "focus:ring-red-500 border-red-300"
                        : "focus:ring-primary"
                    }`}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                  />
                  {/* Real-time password match feedback */}
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* ✅ TERMS & CONDITIONS CHECKBOX - Reduced padding + Upgraded checkbox */}
                <div className="flex items-start gap-2.5 pt-1 pb-2">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (error) setError(null);
                      }}
                      disabled={loading}
                      className="peer h-4.5 w-4.5 shrink-0 rounded-sm border-2 border-gray-300 appearance-none cursor-pointer transition-all duration-200 checked:border-[#f97316] checked:bg-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                    {/* ✅ Custom checkmark icon */}
                    <span className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <Label
                    htmlFor="terms"
                    className="text-xs sm:text-sm leading-tight cursor-pointer text-muted-foreground select-none"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-4 hover:text-[#f97316] transition-colors font-medium"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-[#f97316] transition-colors font-medium"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* ✅ SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="w-full h-11 sm:h-12 mt-1 mb-2 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2 px-6"
                  style={{ backgroundColor: acceptedTerms ? "#f97316" : undefined }}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <LogInIcon
                        size={16}
                        color="currentColor"
                        strokeWidth={2.5}
                        className="shrink-0"
                      />
                      <span>Sign Up</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

         <CardFooter className="flex flex-col gap-4 pt-2">
  {/* 🔹 DIVIDER - ✅ NO BACKGROUND - Fully merged with card */}
  <div className="relative w-full py-2">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-border/60" />
    </div>
    <div className="relative flex justify-center">
      <span className="px-3 text-xs uppercase text-muted-foreground/70">
        Or sign up with
      </span>
    </div>
  </div>

  {/* 🔹 GOOGLE SIGNUP BUTTON */}
  <Button
    variant="outline"
    type="button"
    disabled={loading}
    className="w-full h-11 sm:h-12 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 px-6"
    onClick={handleGoogleSignup}
  >
    <GoogleIcon size={16} />
    <span>Sign up with Google</span>
  </Button>
</CardFooter>
        </Card>
      </div>
    </>
  );
}