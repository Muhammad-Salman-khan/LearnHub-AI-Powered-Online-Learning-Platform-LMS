"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Right: Account */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="p-2 text-[#f97316] hover:bg-muted rounded-full transition-colors"
              aria-label="Account"
              style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" }}
            >
              <span className="material-symbols-outlined text-xl">
                account_circle
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
