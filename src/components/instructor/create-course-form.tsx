"use client";

import { CreateCourse } from "@/server/action";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCourseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null as File | null,
    price: "",
    category: "",
    level: "BEGINNER",
    isPublished: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend connectivity logic
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price), // Prisma/Zod price number mangta hai
      };

      const response = await CreateCourse(dataToSubmit as any);

      if (response?.success) {
        alert("Course created successfully!");
        router.push("/dashboard/instructor");
        router.refresh();
      } else {
        alert(response?.error || "Kuch ghalat hogaya!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server se connect nahi ho saka");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            className="w-full px-3 py-2 border rounded-md min-h-[120px] bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData((prev) => ({ ...prev, thumbnail: file }));
              }
            }}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Price ($)</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          >
            <option value="">Select a category</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
            <option value="Photography">Photography</option>
            <option value="Music">Music</option>
            <option value="Data Science">Data Science</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-transparent"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
            className="w-4 h-4"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-foreground">
            Publish Course
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}