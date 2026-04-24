"use client";

/**
 * CourseSidebar — Scholarly Architect Design System
 *
 * Sticky enrollment card — 4-col sidebar in the 12-col grid.
 * Card: surface-container-lowest, ambient-shadow.
 * No amber, no glow. Primary blue CTAs.
 * Progress: primary blue progress fill.
 *
 * Backend preserved: EnrollButtonWrapper, Link to /learn, progress bar.
 */

import Link from "next/link";
import Image from "next/image";
import EnrollButtonWrapper from "@/app/courses/[courseId]/_components/EnrollButtonWrapper";

interface CourseSidebarProps {
  course: {
    id: string;
    price: number;
    title: string;
    thumbnail?: string | null;
  };
  enrolled: boolean;
  progress: number;
  totalChapters: number;
  totalDuration: number;
  userProgress?: { percentage: number };
}

export function CourseSidebar({
  course,
  enrolled,
  progress,
  totalChapters,
  totalDuration,
}: CourseSidebarProps) {

  const formatPrice = (price: number) =>
    price === 0 ? "Free" : `Rs. ${price.toLocaleString()}`;

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  /* Icon row items */
  const features = [
    { icon: "menu_book", label: `${totalChapters} chapters` },
    { icon: "schedule", label: `${formatDuration(totalDuration)} total` },
    { icon: "workspace_premium", label: "Certificate of completion" },
    { icon: "download", label: "Downloadable resources" },
  ];

  return (
    <div className="lg:sticky lg:top-8">
      {/* ── Enrollment card ──────────────────────────────────────────── */}
      <div
        className="rounded-lg overflow-hidden ambient-shadow"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        {/* Mobile thumbnail */}
        <div className="relative aspect-video lg:hidden" style={{ backgroundColor: "var(--surface-container-high)" }}>
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 1024px) 100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" style={{ color: "var(--on-surface-variant)" }}>
                school
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">

          {/* Price */}
          <div className="text-center">
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
            >
              {formatPrice(course.price)}
            </p>
            {course.price > 0 && (
              <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)" }}>
                One-time payment
              </p>
            )}
          </div>

          {/* CTA button */}
          {enrolled ? (
            <Link
              href={`/courses/${course.id}/learn`}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-sm text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}
            >
              <span className="material-symbols-outlined text-lg">play_circle</span>
              Continue Learning
            </Link>
          ) : (
            <EnrollButtonWrapper
              courseId={course.id}
              price={course.price}
              userProgress={enrolled ? { percentage: progress } : undefined}
            />
          )}

          {/* Progress bar (enrolled users only) */}
          {enrolled && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--on-surface-variant)" }}>Your progress</span>
                <span
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--primary)" }}
                >
                  {progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* ── Course features list ─────────────────────────────────── */}
          {/*
           * No-Divider Rule: 1.5rem vertical space separates items,
           * not a 1px line.
           */}
          <div
            className="space-y-3 pt-4"
            style={{ borderTop: "1px solid var(--outline-variant)" }}
          >
            {features.map(({ icon, label }) => (
              <div key={icon} className="flex items-center gap-3 text-sm">
                <span
                  className="material-symbols-outlined text-lg flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  {icon}
                </span>
                <span style={{ color: "var(--on-surface-variant)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Guarantee note — tonal surface shift */}
          <div
            className="rounded-sm px-4 py-3 text-center text-xs"
            style={{ backgroundColor: "var(--surface-container-low)", color: "var(--on-surface-variant)" }}
          >
            <span
              className="material-symbols-outlined text-sm align-middle mr-1"
              style={{ color: "var(--primary)" }}
            >
              verified
            </span>
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </div>
  );
}
