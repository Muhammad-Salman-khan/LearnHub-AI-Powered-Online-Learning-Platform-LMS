import { ChapterForm } from "@/components/instructor/chapter-form";

export default async function CreateChapterPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Blurred background overlay - matches LoginPage */}
      <div className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm" />

      <div className="flex min-h-screen items-center justify-center p-4">
        <ChapterForm courseId={courseId} />
      </div>
    </main>
  );
}
