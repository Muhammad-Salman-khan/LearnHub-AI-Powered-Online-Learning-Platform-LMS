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
 * LoginPage - User Authentication
 */
export default function LoginPage() {
  // 🔹 Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 UI state
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔹 Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 🔹 Handle credentials login
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
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
        setError(res?.error || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard/student" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <>
      {/* 🔹 BLURRED BACKGROUND OVERLAY */}
      <div
        className={`fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 🔹 MAIN CONTAINER */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 🔹 LOGIN CARD */}
        <Card
          className={`w-full max-w-sm sm:max-w-md shadow-lg border-0 sm:border transition-all duration-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl sm:text-2xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your credentials to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ INLINE ERROR POPUP */}
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
                    Please check your credentials and try again.
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

            <form onSubmit={handleLogin} id="login-form">
              <div className="flex flex-col gap-4 sm:gap-5">
                
                {/* 🔹 SIGN UP LINK - ✅ Moved UP (more negative margin) */}
                <div className="text-center -mt-2 mb-0">
                  <Button
                    variant="link"
                    className="px-0 text-sm sm:text-base h-auto py-0"
                    asChild
                  >
                    <a href="/signup">
                      Don't have an account? <span className="text-[#f97316] font-medium">Sign Up</span>
                    </a>
                  </Button>
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
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    disabled={loading}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    autoComplete="email"
                  />
                </div>

                {/* 🔒 PASSWORD FIELD */}
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
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
                className="w-full h-10 sm:h-11 mt-4 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2 bg-gradient-to-br from-[#ffb690] to-[#f97316] text-[#131313] font-medium shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.08)] border-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogInIcon size={16} color="currentColor" strokeWidth={2.5} className="flex-shrink-0" />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            {/* 🔹 DIVIDER - No background */}
            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs uppercase text-muted-foreground/70">
                  Or continue with
                </span>
              </div>
            </div>

            {/* 🔹 GOOGLE SIGN-IN BUTTON */}
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              className="w-full h-10 sm:h-11 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 px-6"
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