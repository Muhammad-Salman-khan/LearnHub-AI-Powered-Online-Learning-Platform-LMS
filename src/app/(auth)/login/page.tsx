"use client";

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
import { useState, useEffect } from "react";
// ✅ Import your custom icons
import LogInIcon from "@/components/ui/loginicon";
import GoogleIcon from "@/components/ui/GoogleIcon"; // ✅ Google icon for OAuth

/**
 * CardDemo - A responsive login card with Google sign-in option
 * Features: Blurred background, animations, password visibility toggle, Google OAuth button
 */
export default function CardDemo() {
  // ✅ Prevent hydration mismatch: only animate after client mount
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Login submitted:", data);
    // 🔹 Add your login API call here
    // Example: await signInUser(data);
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
            <CardTitle className="text-xl sm:text-2xl">
              Login to your account
            </CardTitle>
            <CardDescription className="text-sm">
              Enter your email below to login to your account
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
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* 📧 EMAIL FIELD */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                    required
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            {/* ✅ PRIMARY LOGIN BUTTON with LogInIcon */}
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] gap-2"
            >
              <LogInIcon
                size={16}
                color="currentColor"
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
              <span>Login</span>
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

            {/* 🔹 GOOGLE SIGN-IN BUTTON (Centered, Full-width) */}
            <Button
              variant="outline"
              type="button"
              className="w-full h-10 sm:h-11 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                // 🔹 Add your Google OAuth logic here
                console.log("Google sign-in initiated");
                // Example with NextAuth.js:
                // signIn("google", { callbackUrl: "/dashboard" });
              }}
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
