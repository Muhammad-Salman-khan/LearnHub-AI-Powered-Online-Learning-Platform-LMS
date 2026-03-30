"use client";
import React, { useState } from "react";

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    level: "BEGINNER",
    instructorId: "user_clt12345",
    chapters: [{ title: "", description: "", position: 1 }],
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChapterChange = (index: any, e: any) => {
    const newChapters = [...formData.chapters];
    (newChapters[index] as any)[e.target.name] = e.target.value;
    setFormData({ ...formData, chapters: newChapters });
  };

  const addChapter = () => {
    setFormData({
      ...formData,
      chapters: [
        ...formData.chapters,
        { title: "", description: "", position: formData.chapters.length + 1 },
      ],
    });
  };

  const removeChapter = (index: number) => {
    if (formData.chapters.length <= 1) {
      alert("At least one chapter is required!");
      return;
    }

    const filteredChapters = formData.chapters.filter((_, i) => i !== index);

    const updatedChapters = filteredChapters.map((chapter, i) => ({
      ...chapter,
      position: i + 1,
    }));

    setFormData({ ...formData, chapters: updatedChapters });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Course created successfully!");
      } else {
        alert("Server error: " + response.statusText);
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div>
      <h1>Create New Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title: </label>
          <input name="title" onChange={handleChange} required />
        </div>
        <div>
          <label>Description: </label>
          <textarea name="description" onChange={handleChange} required />
        </div>
        <div>
          <label>Category: </label>
          <input name="category" onChange={handleChange} required />
        </div>
        <div>
          <label>Course Level: </label>
          <select name="level" onChange={handleChange}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <hr />

        <h2>Course Curriculum (Chapters)</h2>
        {formData.chapters.map((chapter, index) => (
          <div key={index}>
            <strong>Chapter {index + 1}: </strong>
            <input
              placeholder="Chapter Title"
              name="title"
              value={chapter.title}
              onChange={(e) => handleChapterChange(index, e)}
              required
            />
            <input
              placeholder="Short Description"
              name="description"
              value={chapter.description}
              onChange={(e) => handleChapterChange(index, e)}
            />

            <button type="button" onClick={() => removeChapter(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addChapter}>
          + Add New Chapter
        </button>

        <br />
        <br />

        <button type="submit">Submit Full Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;
