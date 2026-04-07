"use client";
import React, { useState } from "react";

export default function EnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = async () => {
    try {
      const response = await fetch(`/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        alert("Successfully enrolled!");
        setIsEnrolled(true);
      } else {
        alert("Enrollment failed.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  if (isEnrolled) {
    return <button disabled>Already Enrolled ✅</button>;
  }

  return (
    <button onClick={handleEnroll}>
      Enroll Now {price === 0 ? "(Free)" : `for Rs. ${price}`}
    </button>
  );
}