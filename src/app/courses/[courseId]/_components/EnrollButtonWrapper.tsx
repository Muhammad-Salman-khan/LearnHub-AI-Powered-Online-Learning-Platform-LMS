"use client";

import { SessionProvider } from "next-auth/react";
import EnrollButton from "./EnrollButton";

export default function EnrollButtonWrapper({ courseId, price, userProgress }: { courseId: string; price: number; userProgress?: { percentage: number } }) {
  return (
    <SessionProvider>
      <EnrollButton courseId={courseId} price={price} userProgress={userProgress} />
    </SessionProvider>
  );
}
