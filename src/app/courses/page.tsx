import React from "react";
import Link from "next/link";
import { Metadata } from "next"; 
import { getAllCourses } from "@/server/action";

export const metadata: Metadata = {
  title: "Available Courses | LearnHub",
  description: "Explore our wide range of AI-powered online courses and start learning today.",
  openGraph: {
    title: "LearnHub Courses",
    description: "Browse all available courses on our platform.",
  },
};

export default async function CoursesPage() {
  const response = await getAllCourses();

  if (!response.success) {
    return <div>Error: {response.error}</div>;
  }

  const courses = response.data || [];

  return (
    <div>
      <h1>Available Courses</h1>

      {courses.length === 0 ? (
        <p>No courses available at this time</p>
      ) : (
        <table border={1}>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course: any) => (
              <tr key={course.id}>
                <td>
                  <strong>{course.title}</strong>
                </td>
                <td>{course.category}</td>
                <td>
                  {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                </td>
                <td>
                  <Link href={`/courses/${course.id}`}>
                    <button>View Details</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}