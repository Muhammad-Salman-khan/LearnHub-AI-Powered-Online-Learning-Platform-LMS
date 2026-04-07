import { ErrorDisplay } from "@/components/errors/error-display";

export default function NotFound() {
  return (
    <ErrorDisplay
      statusCode={404}
      title="Resource Not Found"
      message="The sector you are searching for does not exist in our archives. Verify your coordinates and attempt again."
    />
  );
}
