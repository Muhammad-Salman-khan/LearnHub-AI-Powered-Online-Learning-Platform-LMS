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
import GoogleIcon from "@/components/ui/GoogleIcon";

/**
 * SignUpPage - A responsive signup form with blurred background
 * Features: Google-only social signup, password visibility toggle, terms checkbox
 */
export default function SignUpPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions to continue.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Signup submitted:", data);
    // 🔹 Add your signup API call here
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
        {/* 🔹 SIGNUP CARD */}
        <Card
          className={`w-full max-w-sm sm:max-w-md shadow-lg border-0 sm:border transition-all duration-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm">
              Enter your details below to create your account
            </CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="px-0 text-sm sm:text-base"
                asChild
              >
                <a href="/login">Already have an account? Login</a>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
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
                    required
                    minLength={2}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    autoComplete="name"
                  />
                </div>

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

                {/* 🔒 PASSWORD FIELD */}
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
                    minLength={8}
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. 8 characters
                  </p>
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
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                    required
                    className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    autoComplete="new-password"
                  />
                </div>

                {/* ✅ TERMS & CONDITIONS CHECKBOX */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs sm:text-sm leading-tight cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="underline underline-offset-4 hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            {/* ✅ PRIMARY SIGNUP BUTTON */}
            <Button
              type="submit"
              disabled={!acceptedTerms}
              className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2"
            >
              <LogInIcon
                size={16}
                color="currentColor"
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
              <span>Create Account</span>
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

            {/* 🔹 GOOGLE SIGNUP BUTTON ONLY (Centered) */}
            <Button
              variant="outline"
              type="button"
              className="w-full h-10 sm:h-11 gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                // 🔹 Add your Google OAuth logic here
                console.log("Google signup initiated");
                // Example: window.location.href = "/api/auth/google";
              }}
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
