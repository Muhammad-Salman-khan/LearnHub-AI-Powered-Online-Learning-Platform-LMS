import Link from "next/link";
import { courses } from "@/lib/data";

export default function CoursesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Courses</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id} className="group">
            <div className="border rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{course.title}</h2>
              <p className="text-gray-500 mt-2 text-sm italic">By {course.instructor}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {course.level}
                </span>
                <span className="font-bold text-green-600">
                  {course.price === 0 ? "FREE" : `Rs. ${course.price}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}