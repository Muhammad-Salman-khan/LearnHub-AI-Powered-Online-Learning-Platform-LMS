import React from "react";
import { notFound } from "next/navigation";
import { getCourseById } from "@/server/action";
import EnrollButton from "./_components/EnrollButton";
import BackButton from "./_components/BackButton"; // Import Back Button
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const response = await getCourseById(courseId);

  if (!response.success || !response.data) {
    return { title: "Course Not Found | LearnHub" };
  }

  return {
    title: `${response.data.title} | LearnHub`,
    description: response.data.description,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { courseId } = await params;
  const response = await getCourseById(courseId);

  if (!response.success || !response.data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <BackButton />
        <h1>404 - Course Not Found</h1>
        <p>
          Sorry, the course you are looking for does not exist or has been
          removed.
        </p>
      </div>
    );
  }

  const course = response.data;

  return (
    <div>
      <BackButton />

      <section>
        <h1>{course.title}</h1>
        <p>
          <b>Description:</b> {course.description}
        </p>
        <p>
          <b>Category:</b> {course.category}
        </p>
        <p>
          <b>Level:</b> {course.level}
        </p>
        <p>
          <b>Price:</b> {course.price === 0 ? "Free" : `Rs. ${course.price}`}
        </p>
      </section>
      <hr />
      <section>
        <EnrollButton courseId={course.id} price={course.price} />
      </section>
      <section>
        <h3>Course Curriculum</h3>
        <p>
          Full access to chapters and video lectures will be granted upon
          successful enrollment.
        </p>
      </section>
    </div>
  );
}
