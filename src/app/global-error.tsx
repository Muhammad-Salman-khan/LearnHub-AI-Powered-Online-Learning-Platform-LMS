"use client";

import { ErrorDisplay } from "@/components/errors/error-display";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorDisplay
          statusCode={500}
          title="Internal Server Error"
          message="The obsidian depths are currently unreachable. We're working on restoring the connection to your learning resources."
        />
      </body>
    </html>
  );
}
