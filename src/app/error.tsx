"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/errors/error-display";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      statusCode={500}
      title="Internal Server Error"
      message="The obsidian depths are currently unreachable. We're working on restoring the connection to your learning resources."
      onRetry={reset}
    />
  );
}
