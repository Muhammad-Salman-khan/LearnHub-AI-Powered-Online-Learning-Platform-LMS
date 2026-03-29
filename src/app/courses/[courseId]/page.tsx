import { courses } from "@/lib/data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetail({ params }: PageProps) {
  const { courseId } = await params;
  const course = courses.find((c) => c.id === Number(courseId));

  if (!course) return <h1 className="p-10 text-center text-2xl font-bold">Course Not Found</h1>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{course.description}</p>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Course Curriculum</h2>
      <div className="space-y-4">
        {course.chapters.map((chapter, index) => (
          <Link 
            key={chapter.id} 
            href={`/courses/${courseId}/learn/${chapter.id}`}
            className="flex items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-4 group-hover:bg-blue-200 font-bold text-sm">
              {index + 1}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
              <p className="text-sm text-gray-500">Video Lesson</p>
            </div>
            <span className="text-blue-600 font-medium text-sm">Start Learning</span>
          </Link>
        ))}
      </div>
    </div>
  );
}