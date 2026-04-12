"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/server/action";
import { toast } from "sonner";

export default function EnrollButton({ courseId, price, isEnrolled: initialEnrolled }: { courseId: string; price: number; isEnrolled?: boolean }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled || false);

  // Update enrollment status if prop changes
  useEffect(() => {
    if (initialEnrolled) {
      setIsEnrolled(true);
    }
  }, [initialEnrolled]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        toast.success("Successfully enrolled in the course!");
        setIsEnrolled(true);
        // Redirect to student dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard/student");
        }, 1500);
      } else {
        if (result.error === "Already enrolled") {
          toast.info("You are already enrolled in this course.");
          setIsEnrolled(true);
        } else {
          toast.error(result.error || "Enrollment failed.");
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/login?callbackUrl=/courses/${courseId}`);
  };

  // Loading state
  if (status === "loading") {
    return (
      <button
        disabled
        className="px-6 py-3 bg-[#F97316]/50 text-white rounded-lg font-medium cursor-wait animate-pulse"
      >
        Checking...
      </button>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <button
        onClick={handleLoginRedirect}
        className="w-full h-12 bg-gradient-to-br from-[#ffb690] to-[#f97316] text-[#131313] font-semibold rounded-[min(var(--radius-md),4px)] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.08)] flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">login</span>
        Log in to Enroll
      </button>
    );
  }

  // Already enrolled
  if (isEnrolled) {
    return (
      <button
        disabled
        className="w-full h-12 bg-green-500/20 text-green-400 border border-green-500/30 rounded-[min(var(--radius-md),4px)] font-semibold cursor-default flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">check_circle</span>
        Already Enrolled ✅
      </button>
    );
  }

  // Logged in, can enroll
  return (
    <button
      onClick={handleEnroll}
      disabled={isEnrolling}
      className="w-full h-12 bg-gradient-to-br from-[#ffb690] to-[#f97316] text-[#131313] font-semibold rounded-[min(var(--radius-md),4px)] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.08)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isEnrolling ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Enrolling...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-base">menu_book</span>
          <span>Enroll Now {price === 0 ? "(Free)" : `— Rs. ${price}`}</span>
        </>
      )}
    </button>
  );
}