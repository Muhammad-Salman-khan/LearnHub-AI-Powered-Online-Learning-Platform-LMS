/**
 * LearnHub — Homepage
 *
 * Design System: The Scholarly Architect
 * Palette: primary #0040a1, background #fcf9f8, cream surfaces
 * Typography: Manrope (headlines) + Inter (body)
 * Rule: No 1px borders for structure — use background color shifts
 *
 * Sections:
 * 1. TopNavBar   — sticky header with nav + auth buttons + theme toggle
 * 2. Hero        — 12-col grid, headline + CTA + architectural image
 * 3. Standards   — 3-col feature grid on surface-container-low
 * 4. Modules     — course cards from DB on surface
 * 5. Newsletter  — primary-background CTA section
 * 6. Footer      — 4-col on surface-container-low
 * 7. AI Chatbot  — persistent floating trigger (only element breaking grid)
 */

import Link from "next/link";
import Image from "next/image";
import { getAllCourses } from "@/server/action";
import { ThemeToggle } from "@/components/themeProvider/theme-toggle";

/* ─── AI Chatbot Widget ─────────────────────────────────────
   Floats above all content. Full (9999px) roundedness per spec.
   "Deep Breath" ambient shadow: blur 32px, 6% opacity.
──────────────────────────────────────────────────────────── */
function AIChatbotWidget() {
  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button
        aria-label="Open Architect Assistant"
        className="p-4 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group ambient-shadow"
        style={{ backgroundColor: "var(--surface-container-high)", color: "var(--primary)" }}
      >
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
        {/* Tooltip label appears on hover */}
        <span className="absolute right-full mr-4 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-bold shadow-sm"
          style={{ backgroundColor: "var(--surface-container-high)", color: "var(--on-surface)" }}>
          Architect Assistant
        </span>
      </button>
    </div>
  );
}

export default async function HomePage() {
  /* Fetch up to 3 real courses from DB for the Elite Modules section */
  const response = await getAllCourses(1, 3);
  const courses =
    response.success && response.data ? response.data.items : [];

  return (
    <div className="antialiased"
      style={{ backgroundColor: "var(--background)", color: "var(--on-surface)" }}
    >

      {/* ═══════════════════════════════════════════════════
          TOP NAV BAR
          Sticky, same background as hero — no border separator.
          Brand uses section gap to separate, not a 1px line.
      ═══════════════════════════════════════════════════ */}
      <header className="w-full top-0 sticky z-50"
        style={{ backgroundColor: "var(--background)" }}
      >
        <nav className="flex items-center justify-between px-8 md:px-12 py-4 max-w-[1440px] mx-auto">
          {/* Brand + Primary Nav */}
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tighter"
              style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--primary)" }}
            >
              LearnHub
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              {/* Active link gets bottom border accent */}
              <Link
                href="/courses"
                className="font-bold text-sm tracking-tight border-b-2 pb-1 transition-colors"
                style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--primary)", borderColor: "var(--primary)" }}
              >
                Courses
              </Link>
              <Link
                href="/mentors"
                className="font-bold text-sm tracking-tight transition-colors hover:opacity-70"
                style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
              >
                Mentors
              </Link>
            </div>
          </div>

          {/* Auth Buttons + Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="font-bold text-sm tracking-tight px-4 py-2 rounded-sm transition-all duration-200 active:scale-95 hover:opacity-70"
              style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
            >
              Sign In
            </Link>
            {/* Primary button: sharp 0.25rem radius per design spec */}
            <Link
              href="/signup"
              className="px-6 py-2 rounded font-bold text-sm tracking-tight transition-all duration-200 active:scale-95 hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-headline, Manrope)" }}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main>

        {/* ═══════════════════════════════════════════════════
            HERO SECTION
            12-col asymmetric grid: 7 content / 5 image
            Background: surface — base canvas layer
        ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-20 pb-32"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-12 gap-8 items-center">

            {/* Left: Editorial Headline + CTAs */}
            <div className="col-span-12 lg:col-span-7">
              {/* Eyebrow — uppercase tracking for editorial voice */}
              <span className="font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
                style={{ color: "var(--primary)" }}
              >
                Redefining Academic Excellence
              </span>

              {/* Display headline — Manrope, extrabold, tight tracking */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-8"
                style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
              >
                The Blueprint for <br />
                <span style={{ color: "var(--primary)" }}>Elite Learning.</span>
              </h1>

              {/* Body copy — Inter, generous line-height */}
              <p className="text-xl max-w-xl mb-10 leading-relaxed"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Access a curated ecosystem of scholarly resources designed for
                high-impact professional and academic growth. Structured by
                architects of education.
              </p>

              {/* CTA row — primary button + secondary surface button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded font-bold transition-all active:scale-95 hover:opacity-90"
                  style={{ fontFamily: "var(--font-headline, Manrope)", backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                >
                  Explore Catalog
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded font-bold transition-all active:scale-95 hover:opacity-90"
                  style={{ fontFamily: "var(--font-headline, Manrope)", backgroundColor: "var(--surface-container-high)", color: "var(--on-surface)" }}
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Right: Architectural image — 4/5 aspect ratio */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--surface-container-low)" }}
              >
                <Image
                  src="/heropic.png"
                  alt="Architectural learning environment"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            INSTITUTIONAL STANDARDS
            Background shifts to surface-container-low
            — architectural sectioning without borders
        ═══════════════════════════════════════════════════ */}
        <section className="py-24"
          style={{ backgroundColor: "var(--surface-container-low)" }}
        >
          <div className="max-w-[1440px] mx-auto px-8 md:px-12">
            {/* Section header with primary accent bar */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2
                  className="text-4xl font-extrabold tracking-tight mb-4"
                  style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
                >
                  Institutional Standards
                </h2>
                {/* Primary accent line replaces any border/rule */}
                <div className="h-1 w-20" style={{ backgroundColor: "var(--primary)" }} />
              </div>
              <p className="max-w-md text-right mt-6 md:mt-0"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Our curriculum is built upon rigorous pedagogical frameworks
                recognized by global leaders in education.
              </p>
            </div>

            {/* 3-col feature grid — separated by white space, no dividers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="space-y-6">
                <div style={{ color: "var(--primary)" }}>
                  <span className="material-symbols-outlined text-4xl">
                    account_balance
                  </span>
                </div>
                <h3
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
                >
                  Accredited Pedagogy
                </h3>
                <p className="leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Courses structured using verified academic blueprints that
                  ensure knowledge retention and practical application.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-6">
                <div style={{ color: "var(--primary)" }}>
                  <span className="material-symbols-outlined text-4xl">
                    architecture
                  </span>
                </div>
                <h3
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
                >
                  Structured Hierarchy
                </h3>
                <p className="leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  A clear, multi-layered learning path that guides students
                  from foundational concepts to expert mastery.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-6">
                <div style={{ color: "var(--primary)" }}>
                  <span className="material-symbols-outlined text-4xl">
                    verified
                  </span>
                </div>
                <h3
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
                >
                  Verified Mentors
                </h3>
                <p className="leading-relaxed"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  Learn from leading architects of industry who bring
                  real-world complexity into a controlled learning environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ELITE MODULES (course cards)
            Background returns to surface — layering effect
            Cards are surface-container-low with image hover scale
        ═══════════════════════════════════════════════════ */}
        <section className="py-24"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="max-w-[1440px] mx-auto px-8 md:px-12">
            {/* Section header — left-aligned per "Architectural" grid rule */}
            <div className="mb-16">
              <h2
                className="text-4xl font-extrabold tracking-tight mb-2"
                style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
              >
                Elite Modules
              </h2>
              <p style={{ color: "var(--on-surface-variant)" }}>
                Selected masterclasses for high-performance individuals.
              </p>
            </div>

            {/* Course cards grid — 3 columns */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {courses.map((course: any) => (
                  /* Course card — no border, uses surface-container-low bg */
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-video rounded-xl mb-6 overflow-hidden relative"
                      style={{ backgroundColor: "var(--surface-container-low)" }}
                    >
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        /* Placeholder when no thumbnail */
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--surface-container)" }}
                        >
                          <span className="material-symbols-outlined text-5xl"
                            style={{ color: "var(--outline-variant)" }}
                          >
                            play_circle
                          </span>
                        </div>
                      )}
                      {/* Level badge */}
                      <div className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider"
                        style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
                      >
                        {course.level || "Course"}
                      </div>
                    </div>

                    {/* Card meta */}
                    <h4
                      className="text-lg font-bold mb-2 transition-colors"
                      style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
                    >
                      {course.title}
                    </h4>
                    <p className="text-sm mb-4 line-clamp-2"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-semibold"
                      style={{ color: "var(--on-surface-variant)" }}>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          group
                        </span>
                        {course.price === 0
                          ? "Free"
                          : `Rs. ${course.price}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-12 rounded-xl"
                style={{ backgroundColor: "var(--surface-container-low)" }}
              >
                <p style={{ color: "var(--on-surface-variant)" }}>No courses available yet.</p>
              </div>
            )}

            {/* View all link — primary color, arrow hover animation */}
            <div className="mt-16 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 font-bold group"
                style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--primary)" }}
              >
                View Entire Curriculum
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            NEWSLETTER / CTA SECTION
            Background: primary — bold full-bleed block
            Text: on_primary
            No gradients — pure solid architectural color block
        ═══════════════════════════════════════════════════ */}
        <section className="py-24"
          style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
        >
          <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <div>
              <h2
                className="text-5xl font-extrabold tracking-tighter mb-6"
                style={{ fontFamily: "var(--font-headline, Manrope)" }}
              >
                Stay ahead of the <br />
                academic curve.
              </h2>
              <p className="text-lg max-w-md opacity-90"
                style={{ color: "var(--on-primary-container)" }}
              >
                Join our exclusive mailing list for early access to modules and
                institutional insights.
              </p>
            </div>

            {/* Right: Email form */}
            <div>
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Institutional Email Address"
                  className="w-full border-none px-6 py-4 rounded focus:ring-2 outline-none"
                  style={{
                    backgroundColor: "var(--on-primary)",
                    color: "var(--primary)",
                  }}
                />
                <button
                  type="submit"
                  className="font-bold py-4 rounded transition-colors hover:opacity-90"
                  style={{ fontFamily: "var(--font-headline, Manrope)", backgroundColor: "var(--on-primary)", color: "var(--primary)" }}
                >
                  Request Invitation
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          Background: surface-container-low — architectural section
          4-col grid, no top border — color shift provides separation
      ═══════════════════════════════════════════════════ */}
      <footer className="w-full py-12"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 md:px-12 max-w-[1440px] mx-auto">
          {/* Brand column */}
          <div className="col-span-1">
            <span
              className="font-bold text-lg mb-4 block"
              style={{ fontFamily: "var(--font-headline, Manrope)", color: "var(--on-surface)" }}
            >
              LearnHub
            </span>
            <p className="text-xs leading-relaxed"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Developing the next generation of industry architects through
              structured, scholarly education.
            </p>
          </div>

          {/* Platform links */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm mb-2"
              style={{ color: "var(--on-surface)" }}
            >
              Platform
            </span>
            <Link
              href="/courses"
              className="text-xs hover:opacity-70 hover:underline underline-offset-4 transition-opacity"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Browse Courses
            </Link>
            <Link
              href="/mentors"
              className="text-xs hover:opacity-70 hover:underline underline-offset-4 transition-opacity"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Find Mentors
            </Link>
          </div>

          {/* Resources links */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm mb-2"
              style={{ color: "var(--on-surface)" }}
            >
              Resources
            </span>
            <a
              href="#"
              className="text-xs hover:opacity-70 hover:underline underline-offset-4 transition-opacity"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Contact Support
            </a>
            <a
              href="#"
              className="text-xs hover:opacity-70 hover:underline underline-offset-4 transition-opacity"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Privacy Policy
            </a>
          </div>

          {/* Social icons */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm mb-2"
              style={{ color: "var(--on-surface)" }}
            >
              Connect
            </span>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:opacity-70"
                style={{ color: "var(--on-surface-variant)" }}
              >
                public
              </span>
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:opacity-70"
                style={{ color: "var(--on-surface-variant)" }}
              >
                share
              </span>
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:opacity-70"
                style={{ color: "var(--on-surface-variant)" }}
              >
                mail
              </span>
            </div>
          </div>
        </div>

        {/* Copyright row — ghost border separates from columns */}
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 mt-12 pt-8"
          style={{ borderTop: "1px solid rgba(195, 198, 214, 0.2)" }}
        >
          <p className="text-xs"
            style={{ color: "var(--on-surface-variant)" }}
          >
            © 2024 LearnHub. The Scholarly Architect.
          </p>
        </div>
      </footer>

      {/* Persistent AI Chatbot Widget — only element that breaks the grid */}
      <AIChatbotWidget />
    </div>
  );
}
