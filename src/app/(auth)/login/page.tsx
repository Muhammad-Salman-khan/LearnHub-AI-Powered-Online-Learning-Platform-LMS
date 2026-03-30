"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
 * LoginPage - Merged version: Beautiful UI + Working Auth Logic
 *
 * Features:
 * - NextAuth.js credentials + Google OAuth sign-in
 * - Loading states with disabled buttons
 * - Error handling with user-friendly alerts
 * - Blurred animated background
 * - Responsive design with shadcn/ui components
 * - Password visibility toggle
 * - Hydration-safe animations
 */
export default function LoginPage() {
  // 🔹 Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 UI state
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // ✅ Prevent hydration mismatch: only animate after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔹 Handle credentials login
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password: password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard/student/");
        router.refresh();
      } else {
        alert(`Error: ${res?.error || "Invalid Credentials"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed. Please try again.");
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
        {/* 🔹 LOGIN CARD - Slides up on mount */}
        <Card
          className={`w-full max-w-sm sm:max-w-md shadow-lg border-0 sm:border transition-all duration-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your credentials to login to your account
            </CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="px-0 text-sm sm:text-base"
                asChild
              >
                <a href="/signup">Don't have an account? Sign Up</a>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} id="login-form">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* 📧 EMAIL FIELD */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2"
              >
                {loading ?
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                : <>
                    <LogInIcon
                      size={16}
                      color="currentColor"
                      strokeWidth={2.5}
                      className="flex-shrink-0"
                    />
                    <span>Login</span>
                  </>
                }
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            {/* ✅ PRIMARY LOGIN BUTTON with LogInIcon + Loading State */}
            <Button
              type="submit" form="login-form"
              disabled={loading}
              className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogInIcon size={16} color="currentColor" strokeWidth={2.5} className="shrink-0" />
                  <span>Login</span>
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
                  Or continue with
                </span>
              </div>
            </div>

            {/* 🔹 GOOGLE SIGN-IN BUTTON */}
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              className="w-full h-10 sm:h-11 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon size={16} />
              <span>Continue with Google</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
