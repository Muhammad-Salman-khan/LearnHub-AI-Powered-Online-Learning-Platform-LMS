"use client";

import { SessionProvider } from "next-auth/react";
import EnrollButton from "./EnrollButton";

/**
 * Wraps EnrollButton with SessionProvider so it can check auth status.
 * SessionProvider is only available in dashboard layout, so course pages
 * need their own wrapper for the enroll button.
 */
export default function EnrollButtonWrapper({ courseId, price }: { courseId: string; price: number }) {
  return (
    <SessionProvider>
      <EnrollButton courseId={courseId} price={price} />
    </SessionProvider>
  );
}
