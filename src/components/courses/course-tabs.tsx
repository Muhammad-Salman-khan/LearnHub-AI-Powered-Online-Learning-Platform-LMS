"use client";

import { useState } from "react";
import Image from "next/image";

interface CourseTabsProps {
  course: {
    id: string;
    description: string;
    requirements?: string[];
    // ✅ reviews is optional now
    reviews?: Array<{
      id: string;
      rating: number;
      comment: string;
      user: { name: string; image?: string };
    }>;
  };
  enrolled: boolean;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    user: { name: string; image?: string };
  }>; // ✅ Optional prop
}

/**
 * CourseTabs - Tabbed content (Overview, Reviews, Q&A)
 *
 * DESIGN.md Compliance:
 * - No-Line Rule: Tab indicators use amber accent line
 * - Surface Hierarchy: Active tab has tonal shift
 * - Typography: label-md for tab labels
 */
export function CourseTabs({ course, enrolled }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "faq">(
    "overview",
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: `Reviews (${course.reviews?.length || 0})` },
    { id: "faq", label: "FAQ" },
  ] as const;

  return (
    <div className="mt-8">
      {/* Tab Headers */}
      <div className="flex items-center gap-8 border-b border-[#584237]/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? "text-[#f97316]"
                : "text-[#8a8a8a] hover:text-[#e2e2e2]"
            }`}
          >
            {tab.label}
            {/* Amber Accent Line */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f97316] to-transparent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#e2e2e2] mb-3">
                Description
              </h3>
              <p className="text-sm text-[#e0c0b1] leading-relaxed">
                {course.description}
              </p>
            </div>
            {course.requirements && (
              <div>
                <h3 className="text-lg font-semibold text-[#e2e2e2] mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#e0c0b1]"
                    >
                      <span className="material-symbols-outlined text-[#f97316] text-lg shrink-0 mt-0.5">
                        circle
                      </span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {course.reviews && course.reviews.length > 0 ? (
              course.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#0e0e0e] overflow-hidden">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#8a8a8a] text-sm">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e2e2e2]">
                        {review.user.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${i < review.rating ? "text-[#f97316]" : "text-[#5a5a5a]"}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#e0c0b1]">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-[#5a5a5a] text-3xl mb-3">
                  rate_review
                </span>
                <p className="text-sm text-[#8a8a8a]">
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-4">
              <h4 className="text-sm font-medium text-[#e2e2e2] mb-2">
                Can I get a refund?
              </h4>
              <p className="text-sm text-[#e0c0b1]">
                Yes! We offer a 30-day money-back guarantee if you're not
                satisfied.
              </p>
            </div>
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-4">
              <h4 className="text-sm font-medium text-[#e2e2e2] mb-2">
                Do I get lifetime access?
              </h4>
              <p className="text-sm text-[#e0c0b1]">
                Yes, once enrolled, you have lifetime access to all course
                content and updates.
              </p>
            </div>
            <div className="bg-[#1b1b1b] rounded-[min(var(--radius-md),4px)] p-4">
              <h4 className="text-sm font-medium text-[#e2e2e2] mb-2">
                Is there a certificate?
              </h4>
              <p className="text-sm text-[#e0c0b1]">
                Yes, you'll receive a certificate of completion after finishing
                all lessons.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
