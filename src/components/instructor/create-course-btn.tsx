"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CreateCourseBtn() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/dashboard/instructor/courses/create")}
      className="bg-primary text-primary-foreground hover:opacity-90 amber-glow h-12 px-6 font-bold"
    >
      <span className="material-symbols-outlined mr-2">add_circle</span>
      Create New Course
    </Button>
  );
}
