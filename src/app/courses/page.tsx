"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        setLoading(true);
        // Backend API endpoint for getting all published courses
        const response = await fetch("/api/courses");

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              <th>Instructor</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <strong>{course.title}</strong>
                </td>
                <td>{course.category}</td>
                <td>{course.instructor?.name || "Unknown"}</td>
                <td>{course.price === 0 ? "Free" : `Rs. ${course.price}`}</td>
                <td>{course.isEnrolled ? "Enrolled" : "Not Enrolled"}</td>
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
