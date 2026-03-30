import { prisma } from "@/lib/prisma";

interface Props {
  params: { courseId: string };
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: true,
      chapters: true,
    },
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>

      <p>
        Instructor: <span>{course.instructor.name}</span>
      </p>

      <p>
        Price:{" "}
        <span>{course.price === 0 ? "Free" : `Rs. ${course.price}`}</span>
      </p>

      <p>Level: {course.level}</p>

      <div>
        <h2>Description</h2>
        <p>{course.description}</p>
      </div>

      <div>
        <h2>Course Content</h2>

        {course.chapters.length === 0 ? (
          <p>No chapters added yet</p>
        ) : (
          <div>
            {course.chapters.map((chapter, index) => (
              <div key={chapter.id}>
                <div>
                  <h3>
                    {index + 1}. {chapter.title}
                  </h3>

                  <p>{chapter.isFree ? "Free Preview" : "Locked"}</p>
                </div>

                <button>View</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button>Enroll Now</button>
      </div>
    </div>
  );
}
