import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      chapters: true,
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("ALL_COURSES_DATA:", JSON.stringify(courses, null, 2));

  return (
    <div>
      <h1>Course List</h1>
      {courses.map((course) => {
        const priceTag = course.price === 0 ? "Free" : `Rs. ${course.price}`;

        return (
          <div key={course.id}>
            <h2>{course.title}</h2>
            <p>Price: {priceTag}</p>
            <p>Instructor: {course.instructor.name}</p>

            <Link href={`/courses/${course.id}`} className="cursor-pointer">
              <button style={{ cursor: "pointer" }}>View Details</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
