"use client";

import React, { useState } from "react";
import titleCase from "@/components/titleCase";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [chapters, setChapters] = useState([{ title: "" }]);

  const [loading, setLoading] = useState(false);

  const addChapterField = () => {
    setChapters([...chapters, { title: "" }]);
  };

  const handleChapterChange = (index: number, value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].title = value;
    setChapters(updatedChapters);
  };

  const removeChapterField = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  async function handleCreateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const filterdChapters = chapters.filter((ch) => ch.title !== "");
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify({
          title: titleCase(title),
          description: titleCase(description),
          category: titleCase(category),
          price,
          chapters: filterdChapters,
        }),
      });

      if (response.ok) {
        alert("Course with Chapters Created!");
        setTitle("");
        setDescription("");
        setCategory("");
        setPrice("");
        setChapters([{ title: "" }]);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Add Course</h1>
      <form
        onSubmit={handleCreateCourse}
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          placeholder="Course Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <input
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />

        <hr />
        <h3>Course Chapters</h3>

        {chapters.map((chapter, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
          >
            <input
              placeholder={`Chapter ${index + 1} Title`}
              value={chapter.title}
              onChange={(e) => handleChapterChange(index, e.target.value)}
              required
            />
            {chapters.length > 1 && (
              <button
                type="button"
                onClick={() => removeChapterField(index)}
                style={{ color: "red" }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addChapterField}>
          + Add More Chapter
        </button>

        <hr />

        <button disabled={loading} type="submit">
          {loading ? "Creating..." : "Create Course & Chapters"}
        </button>
      </form>
    </div>
  );
}
