"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enrollInCourse, getCourseProgress } from "@/server/action";
import { toast } from "sonner";

export default function EnrollButton({ courseId, price, userProgress }: { courseId: string; price: number; userProgress?: { percentage: number } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update enrollment status and progress
  useEffect(() => {
    if (userProgress) {
      setIsEnrolled(true);
      setProgress(userProgress.percentage || 0);
    }
  }, [userProgress]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        toast.success("Successfully enrolled in the course!");
        setIsEnrolled(true);
        setTimeout(() => {
          router.push("/dashboard/student");
        }, 1500);
      } else {
        if (result.error === "Already enrolled") {
          toast.info("You are already enrolled in this course.");
          setIsEnrolled(true);
        } else if (result.error === "Not authenticated") {
          router.push(`/login?callbackUrl=/courses/${courseId}`);
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

  const handleResume = () => {
    router.push(`/courses/${courseId}`);
  };

  const handleLoginRedirect = () => {
    router.push(`/login?callbackUrl=/courses/${courseId}`);
  };

  // Loading state
  if (status === "loading") {
    return (
      <button
        disabled
        className="w-full h-12 font-semibold rounded cursor-wait animate-pulse flex items-center justify-center gap-2"
        style={{ backgroundColor: "#f0eded", color: "#424654" }}
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
        className="w-full h-12 font-semibold rounded transition-all flex items-center justify-center gap-2"
        style={{ backgroundColor: "#0040a1", color: "#ffffff" }}
      >
        <span className="material-symbols-outlined text-base">login</span>
        Log in to Enroll
      </button>
    );
  }

  // Already enrolled with progress
  if (isEnrolled) {
    if (progress === 100) {
      return (
        <button
          disabled
          className="w-full h-12 font-semibold cursor-default rounded flex items-center justify-center gap-2"
          style={{
            backgroundColor: "rgba(0, 64, 161, 0.08)",
            color: "#0040a1",
            border: "1px solid rgba(0, 64, 161, 0.2)",
          }}
        >
          <span className="material-symbols-outlined text-base">check_circle</span>
          Course Completed
        </button>
      );
    }

    if (progress > 0) {
      return (
        <button
          onClick={handleResume}
          className="w-full h-12 font-semibold rounded transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0040a1", color: "#ffffff" }}
        >
          <span className="material-symbols-outlined text-base">play_circle</span>
          Resume Progress ({progress}%)
        </button>
      );
    }

    return (
      <button
        disabled
        className="w-full h-12 font-semibold cursor-default rounded flex items-center justify-center gap-2"
        style={{
          backgroundColor: "rgba(0, 64, 161, 0.08)",
          color: "#0040a1",
          border: "1px solid rgba(0, 64, 161, 0.2)",
        }}
      >
        <span className="material-symbols-outlined text-base">check_circle</span>
        Already Enrolled
      </button>
    );
  }

  // Logged in, can enroll
  return (
    <button
      onClick={handleEnroll}
      disabled={isEnrolling}
      className="w-full h-12 font-semibold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style={{ backgroundColor: "#0040a1", color: "#ffffff" }}
    >
      {isEnrolling ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Enrolling...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-base">menu_book</span>
          <span>Enroll Now {price === 0 ? "(Free)" : `— $${price}`}</span>
        </>
      )}
    </button>
  );
}