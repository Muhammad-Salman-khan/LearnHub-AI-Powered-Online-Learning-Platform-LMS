import { courses } from "@/lib/data";
import Link from "next/link";

interface ChapterProps {
  params: Promise<{ courseId: string; chapterId: string }>;
}

export default async function ChapterPage({ params }: ChapterProps) {
  const { courseId, chapterId } = await params;

  const course = courses.find((c) => c.id === Number(courseId));
  const chapter = course?.chapters.find((ch) => ch.id === Number(chapterId));

  if (!course || !chapter) return <h1 className="p-10 text-center">Content not found!</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/courses" className="hover:text-blue-600">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${courseId}`} className="hover:text-blue-600">{course.title}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{chapter.title}</span>
        </div>

        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-video">
          <iframe
            src={chapter.videoUrl}
            className="w-full h-full"
            allowFullScreen
            title={chapter.title}
          />
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{chapter.title}</h1>
          <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
            {chapter.content}
          </div>
          
          <div className="mt-10 pt-6 border-t flex justify-between items-center">
             <Link href={`/courses/${courseId}`} className="text-gray-600 hover:text-blue-600 font-medium">
               Back to Overview
             </Link>
             <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-green-100">
               Mark as Completed ✅
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}