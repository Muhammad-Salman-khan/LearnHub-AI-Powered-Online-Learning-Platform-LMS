"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogInIcon from "@/components/ui/loginicon";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔹 DUMMY USER DATA (Backend dev ke liye placeholder)
  const dummyUser = {
    isLoggedIn: false, // ✅ Change to 'true' when backend ready
    name: "User",
    email: "user@example.com",
    avatar: "/placeholder-avatar.jpg",
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#f97316] hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-[#f97316] text-2xl logo-glow group-hover:scale-110 transition-transform">
                school
              </span>
              <span
                className="font-heading font-bold text-xl tracking-tight logo-glow"
                style={{ color: "#f97316" }}
              >
                LearnHub
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: "Home", href: "/" },
              { name: "Curriculum", href: "#curriculum" },
              { name: "Mentors", href: "#mentors" },
              { name: "Pricing", href: "#pricing" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-[#f97316] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: 🔹 LOGIN / PROFILE BUTTON */}
          <div className="flex items-center gap-4">
            {/* ✅ Desktop: Show Login Button if NOT logged in */}
            {!dummyUser.isLoggedIn ? (
              <Button
                asChild
                variant="default"
                size="sm"
                className="hidden md:flex h-9 gap-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-none focus:ring-0 focus:outline-none"
                style={{ backgroundColor: "#f97316", color: "white" }}
              >
                <Link href="/login" className="flex items-center gap-1.5">
                  <LogInIcon size={14} color="currentColor" strokeWidth={2.5} />
                  <span>Login</span>
                </Link>
              </Button>
            ) : (
              /* ✅ Desktop: Show Profile if logged in */
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-2 p-1 pr-3 rounded-full border border-border hover:border-[#f97316] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#f97316]/20 flex items-center justify-center">
                  <span className="text-[#f97316] font-semibold text-sm">
                    {dummyUser.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {dummyUser.name}
                </span>
              </Link>
            )}

            {/* ✅ Mobile: Icon Button */}
            <Link
              href={!dummyUser.isLoggedIn ? "/login" : "/dashboard"}
              className="md:hidden p-2 text-[#f97316] hover:bg-muted rounded-full transition-colors"
              aria-label={!dummyUser.isLoggedIn ? "Login" : "Profile"}
              style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" }}
            >
              <span className="material-symbols-outlined text-xl">
                {!dummyUser.isLoggedIn ? "login" : "account_circle"}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-4">
              {[
                { name: "Home", href: "/" },
                { name: "Curriculum", href: "#curriculum" },
                { name: "Mentors", href: "#mentors" },
                { name: "Pricing", href: "#pricing" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-[#f97316] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* ✅ Mobile Menu: Login Button */}
              {!dummyUser.isLoggedIn ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-sm border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/login" className="flex items-center justify-center gap-1.5">
                    <LogInIcon size={14} />
                    <span>Login</span>
                  </Link>
                </Button>
              ) : (
                /* ✅ Mobile Menu: Profile Link */
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="w-full gap-2 text-sm"
                  style={{ backgroundColor: "#f97316", color: "white" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      dashboard
                    </span>
                    <span>Dashboard</span>
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}