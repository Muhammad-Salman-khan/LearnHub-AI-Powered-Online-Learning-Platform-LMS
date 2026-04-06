"use client";

/**
 * LearnHub - Homepage
 *
 * Structure:
 * - Hero Section: Main CTA with headline + buttons
 * - Features Section: 3-column grid showcasing platform capabilities
 * - Stats Bar: Key metrics displayed in 4-column grid
 * - Course Tracks: Featured courses with images and metadata
 * - CTA Section: Final conversion prompt with gradient background
 * - Footer: Navigation links and branding
 *
 * Theme: Dark Amber (oklch color space)
 * Components: glass-card, glass-card-no-glow, Material Symbols, shadcn/ui
 */

import Link from "next/link";
import Header from "@/components/themeProvider/Header/page";
import { useState } from "react";

export default function HomePage() {


  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* 
        Header Component
        - Contains navigation, auth buttons, mobile menu
        - Included only on homepage per design spec
      */}
      <Header />

      {/* 
        ========================================
        HERO SECTION
        ========================================
        - Full-width hero with gradient background accents
        - Primary headline with amber accent text
        - Dual CTA buttons (primary + secondary)
        - Background glows use low opacity for subtlety
      */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Background accent glows - subtle, low opacity */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 via-primary/20 to-transparent pointer-events-none blur-xl" />
        <div className="absolute top-20 right-40 w-[400px] h-[400px] bg-primary/25 rounded-sm pointer-events-none blur-lg" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Master the <span className="text-primary text-glow">Future</span>
            <br />
            of Human Capital.
          </h1>

          {/* Hero Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl">
            A deep-tech learning environment designed for precision, speed, and
            absolute mastery. Curated by industry titans for the next generation
            of engineers.
          </p>

          {/* 
            Primary Action Buttons
            - Primary button: Solid amber with subtle hover shadow
            - Secondary button: Transparent with border, hover fill
            - Responsive: Stack on mobile, row on desktop
          */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 sm:mb-16 w-full sm:w-auto">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-[0_2px_10px_rgba(249,115,22,0.15)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.25)]"
            >
              Start Learning
            </Link>
            <Link
              href="#curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-transparent text-foreground rounded-lg font-medium hover:bg-muted/50 transition-all border border-border"
            >
              Explore Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        FEATURES SECTION
        ========================================
        - 3-column grid on desktop, stacked on mobile
        - Each feature card uses glass-card styling
        - Icons from Material Symbols library
        - Hover effects: subtle border color change
      */}
      <section id="curriculum" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Neural Curriculum Design */}
            <div className="glass-card rounded-xl p-6 border border-border/50">
              <span className="material-symbols-outlined text-primary text-3xl mb-4">
                neurology
              </span>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Neural Curriculum Design
              </h3>
              <p className="text-muted-foreground text-sm">
                Our AI adapts your learning path in real-time, focusing on
                high-impact skills that the market demands right now.
              </p>
            </div>

            {/* Feature 2: Hyper-Speed Mentoring */}
            <div className="glass-card rounded-xl p-6 border border-border/50">
              <span className="material-symbols-outlined text-primary text-3xl mb-4">
                bolt
              </span>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Hyper-Speed Mentoring
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with industry experts in real-time. Get instant
                feedback, code reviews, and career guidance when you need it
                most.
              </p>
              {/* Mentor avatars stack */}
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-background overflow-hidden flex-shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFmkhjDE4bYxGTJjNGYN9GfdGEH_eKWRhVbIojtYt4bVYhqdtmwt4fXYkIQay_oaTq4K7DraJTLtUpQk2zr3ZlSA2Wfv2nhxJoIkGXW0yGirkySKXkLjQvv0qUF0I80OcTSNUOWAqjrJ8VL4GAFfrC9j6-hWSrh7ABRvwYknFDi6-YotHjt5Wf4UOehONWEA6S6TJdPrGkhdICm-xQqwbjmtY619z79STLQDwcMO57P9Dx9nYTEGjzQcUGhWW3O8kNabtmE5i8pU4k"
                    alt="Mentor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-background overflow-hidden flex-shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz1CfV0oXCShGy1Xs0mj4EQJG76ujbDpIVcyqib8YVcWgRXPRmjdIllWB1Ful7gRFt_Su8Uab1rCY_dK--NGOHf4mmt20xQQm7D5zoGFQMINXwVv85Ie1DDEd7T0bf0StNdceL9TyTRsoCKKbc52HRhWRzZNGPkgy_Rg9ttmnmDfJwu1zNX2Hb7KTU8VHJu0aG73At24yySYUghj-2cGXSGiQAwrxRo2Ye-gdr8EhGHwzKvexTL4N_Dron9U3hUgTrmdwKow-MAS-s"
                    alt="Mentor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground flex-shrink-0">
                  +42
                </div>
              </div>
            </div>

            {/* Feature 3: Split layout for stats + engine */}
            <div className="grid grid-rows-2 gap-6">
              {/* Stat Card: Latency */}
              <div className="glass-card-no-glow rounded-xl p-6 border border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-1">
                    0.2ms Latency
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time collaboration across 40 global regions.
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">
                  public
                </span>
              </div>
              {/* Engine Card: Obsidian */}
              <div className="glass-card rounded-xl p-6 border border-border/50 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr6Uw1MI_Opd9B6wtL3Bgv97lzh3l7EEAT3tTMFYDKpULkoU-v85d8fausafoIoY9JPaNcGEv9Lu5nrz6ldQCHTUruO-tpfXsPoU8dy38DA_RYXySf7shIGYN08KDY6skVhmo9ZU1ykDAnrGJpbn00Rs-EZt4CcCymXmw_rG1JR-Gz4ImBn-0ndMQfrVKDQeZkXgLdxUKn__NC7gBPmur4MODPmgvfTY6GZlYKBh26tA7_OFFwZsiZVYhF8NarjYMJhuMi87MeCV2a"
                    alt="Obsidian Engine"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-1">
                    The Obsidian Engine
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Proprietary architecture that powers your virtual labs,
                    built on the fastest silicon available today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        STATS BAR
        ========================================
        - Dark background section with 4 key metrics
        - Each stat: icon + value + label
        - Uses glass-card-no-glow for subtle depth
        - Responsive: 2-col mobile, 4-col desktop
      */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-black/95">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {/* Stat: Latency */}
            <div className="text-center glass-card-no-glow p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <span className="material-symbols-outlined text-sm">speed</span>
                <span className="font-heading font-bold text-xl sm:text-2xl">
                  0.2ms
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Latency</p>
            </div>
            {/* Stat: Global Regions */}
            <div className="text-center glass-card-no-glow p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <span className="material-symbols-outlined text-sm">
                  public
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl">
                  40+
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Global Regions</p>
            </div>
            {/* Stat: Active Learners */}
            <div className="text-center glass-card-no-glow p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <span className="material-symbols-outlined text-sm">
                  groups
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl">
                  10k+
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Active Learners</p>
            </div>
            {/* Stat: Success Rate */}
            <div className="text-center glass-card-no-glow p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl">
                  98%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        COURSE TRACKS SECTION
        ========================================
        - Section header with title + "View All" link
        - 3-column grid of course cards
        - Each card: image, tag, title, description, metadata
        - Hover effects: image scale + border color change
      */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary mb-2">
                The Selection
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Advanced Track
                <br />
                <span className="text-muted-foreground">Modules.</span>
              </h2>
            </div>
            <Link
              href="#courses"
              className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
            >
              VIEW ALL TRACKS
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course 1: Quantum Security */}
            <Link
              href="#"
              className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all group block"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0TfcVMpP5qQqa2bT0qjOp-YnXgVpcuO9x0YzHEgiStUd9nl7iIWiVUzcwClFy4sXwe7OBlFhI8HQLRZaQkLZBsLFosDgnnY09aWsae4y1iRixamkUMiiO0EpV4gABESa6ojuhPFn9tp5mOxkDZaLslYXf_iv4jByQk4S_bW7GuaxQFq8qXG79QYTgUbNnjUqaGCbAE3iGgNh-VV4-4dDhRic0harrWhyBkbr1hRKPsLiqyXNSFzTatbIQkkxe4Q6h2phFtSQc1cR5"
                  alt="Quantum Security Protocols"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-4 left-4 inline-flex px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground">
                  Advanced
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Quantum Security Protocols
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Master the cryptographic systems that will define the next
                  decade of digital sovereignty.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>12 Weeks • Certification Incl.</span>
                  <span className="material-symbols-outlined text-[14px]">
                    north_east
                  </span>
                </div>
              </div>
            </Link>

            {/* Course 2: Neural Network Architecture */}
            <Link
              href="#"
              className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all group block"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS-9XTd03DQVROdxMRSJ-NDiL1Uyc-9SbOG6ItVaXP54kpK_t0hp5gbNfZNhLUaY2EayGMDngBrq1r6bXJ99E_Q_5S2E1Gnk4jeq3Hx5DB6iqCGs7yy_iOOmsUXD2DVWpZ81plZoV8REvtb3gUf53HekxfwPRmFAatG0AmehExyG277JUG_Rnqz8YkIp-RYCW7Qy4-a4XzTxNOb3IgcIUM3mVM6amzdI0WopliMwiiHMBwgi774g6gP1QeZ0Q2Glq7ZKTyMhPK_PWn"
                  alt="Neural Network Architecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-4 left-4 inline-flex px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground">
                  Core
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Neural Network Architecture
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Building scalable transformer models from the ground up using
                  distributed GPU clusters.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>8 Weeks • Lab Intense</span>
                  <span className="material-symbols-outlined text-[14px]">
                    north_east
                  </span>
                </div>
              </div>
            </Link>

            {/* Course 3: Systematic Algo-Trading */}
            <Link
              href="#"
              className="glass-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all group block"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzCCPVqN3aRtTG7ys3Kc8t7AQUZhpX3anDrvXj9ov0MKMkJ1UggeLCzUH8Fbd73pGBPlepo7X4gX-k6IA0_TVFQX5ekerwggY1aVPTLoRO7FXfcziUHkjdDoPxsaIZDszNQuLDu9IvGCydNt1EnZjBw20aGh135TRccIB--BLVdXxFPjF04DkwLqmUlmh9QorW-7nZ1D5o8wr20S3mWJFMXJLJ37aQR04n78GKe-us0YP8En2vmx7QrFWIc454TU2iWRXopBtJyyP1"
                  alt="Systematic Algo-Trading"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-4 left-4 inline-flex px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground">
                  Strategic
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Systematic Algo-Trading
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  High-frequency trading engineering and market microstructure
                  analysis for institutional environments.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>16 Weeks • HFT Ready</span>
                  <span className="material-symbols-outlined text-[14px]">
                    north_east
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        CTA SECTION
        ========================================
        - Full-width conversion section with gradient background
        - Headline with amber accent text
        - Single primary CTA button with subtle shadow
        - Background glows use blur + low opacity for depth
      */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background accent glows - subtle, layered */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-t from-[#f97316]/50 via-[#f97316]/20 to-transparent pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#f97316]/30 rounded-full pointer-events-none blur-xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#ffb690]/40 rounded-full pointer-events-none blur-lg" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* CTA Headline */}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to leave the <br className="sm:hidden" />
            <span
              className="text-[#f97316]"
              style={{
                textShadow:
                  "0 0 40px rgba(249, 115, 22, 1), 0 0 80px rgba(249, 115, 22, 0.5), 0 0 120px rgba(249, 115, 22, 0.3)",
              }}
            >
              standard
            </span>{" "}
            behind?
          </h2>

          {/* CTA Subheadline */}
          <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
            The next intake begins in{" "}
            <span className="text-[#f97316] font-semibold">72 hours</span>. Your
            transformation into a technical architect starts with a single
            click.
          </p>

          {/* 
            Primary CTA Button
            - Solid amber background with subtle hover shadow
            - No kinetic-gradient or intense glow per design feedback
          */}
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary text-primary-foreground rounded-lg font-bold text-base sm:text-lg hover:bg-primary/90 transition-colors shadow-[0_2px_10px_rgba(249,115,22,0.15)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.25)]"
          >
            SECURE YOUR SPOT
          </Link>
        </div>
      </section>

      {/* 
        ========================================
        FOOTER
        ========================================
        - Branding + navigation links
        - Logo uses clean amber text (no glow)
        - Social/utility icons on right
        - Subtle top gradient accent
      */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none blur-xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* Logo Icon - clean amber, no glow */}
                <span className="material-symbols-outlined text-primary">
                  school
                </span>
                {/* Logo Text - clean amber, no glow */}
                <span className="font-heading font-bold text-primary">
                  LearnHub
                </span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                © 2024 LearnHub. The Kinetic Monolith.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-sm">
              {["Curriculum", "Mentors", "Pricing", "Privacy"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-xs"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Utility Icons */}
            <div className="flex items-center justify-center md:justify-end gap-4 text-muted-foreground">
              <span className="material-symbols-outlined text-sm">
                language
              </span>
              <span className="material-symbols-outlined text-sm">
                monitoring
              </span>
              <span className="material-symbols-outlined text-sm">
                terminal
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
