"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CourseDetails() {
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Backend API call
        const response = await fetch(`/api/courses/${courseId}`);

        if (!response.ok) throw new Error("Course not found or server error");

        const data = await response.json();
        setCourse(data.course);
        setIsEnrolled(data.isEnrolled);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);
  const handleEnroll = async () => {
    try {
      const response = await fetch(`/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId }),
      });

      if (response.ok) {
        alert("Successfully enrolled!");
        setIsEnrolled(true);
      } else {
        const errorData = await response.json();
        alert("Enrollment failed: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Network error. Please try again.");
    }
  };

  // --- VALIDATIONS & STATES ---
  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course data found.</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* --- COURSE HEADER --- */}
      <h1>{course.title}</h1>
      <p>
        <b>Instructor:</b> {course.instructor?.name || "Unknown"}
      </p>
      <p>
        <b>Description:</b> {course.description}
      </p>
      <p>
        <b>Level:</b> {course.level}
      </p>
      <p>
        <b>Category:</b> {course.category}
      </p>

      <hr />

      {isEnrolled ?
        <div>
          <h2>You are enrolled in this course</h2>
          <h3>Curriculum (Chapters)</h3>
          {course.chapters && course.chapters.length > 0 ?
            <ul>
              {course.chapters.map((chapter: any) => (
                <li key={chapter.id}>
                  <strong>{chapter.title}</strong>
                  <p>{chapter.description}</p>
                  {/* Agar video hai to link dikha sakte hain */}
                  {chapter.videoUrl && (
                    <a href={chapter.videoUrl} target="_blank">
                      Watch Video
                    </a>
                  )}
                </li>
              ))}
            </ul>
          : <p>No chapters available yet.</p>}
        </div>
      : <div>
          <p>Price: {course.price === 0 ? "Free" : `Rs. ${course.price}`}</p>
          <p>Please enroll to access chapters and videos.</p>
          <button onClick={handleEnroll}>Enroll Now</button>
        </div>
      }
    </div>
  );
}
