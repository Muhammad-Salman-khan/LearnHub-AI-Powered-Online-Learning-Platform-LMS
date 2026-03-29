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
 * SignUpPage - Merged version: Beautiful UI + Working Auth Logic
 *
 * Features:
 * - API registration with /api/auth/register
 * - Password validation (min 8 chars) + confirm password match
 * - Terms & conditions checkbox requirement
 * - Google OAuth sign-up option
 * - Loading states with disabled buttons + spinner
 * - Error handling with user-friendly alerts
 * - Blurred animated background with hydration-safe animations
 * - Responsive design with shadcn/ui components
 * - Password visibility toggle for both fields
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
  const [error, setError] = useState("");
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

  // 🔹 Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // 🔹 Handle credentials signup
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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
        alert("Account created successfully! Please login.");
        router.push("/login");
        router.refresh();
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
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
            <CardAction>
              <Button
                variant="link"
                className="px-0 text-sm sm:text-base"
                asChild
              >
                <Link href="/login">Already have an account? Login</Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            {/* ✅ Error Message Display */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} id="signup-form">
              <div className="flex flex-col gap-4 sm:gap-5">
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

                {/* ✅ TERMS & CONDITIONS CHECKBOX */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      if (error) setError("");
                    }}
                    disabled={loading}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs sm:text-sm leading-tight cursor-pointer text-muted-foreground"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-4 hover:text-primary transition-colors"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-primary transition-colors"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            {/* ✅ PRIMARY SIGNUP BUTTON with Loading State */}
            <Button
              type="submit"
              form="signup-form"
              disabled={loading || !acceptedTerms}
              className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2"
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

            {/* 🔹 DIVIDER */}
            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* 🔹 GOOGLE SIGNUP BUTTON */}
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              className="w-full h-10 sm:h-11 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
