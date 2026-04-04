"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCourseById, courseUpdateFields } from "@/server/action";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    level: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    isPublished: false,
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [chapters, setChapters] = useState<
    {
      id?: string;
      title: string;
      description: string;
      videoUrl: string;
      position: number;
      isFree: boolean;
      isPublished: boolean;
    }[]
  >([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await getCourseById(courseId);
        if (!result || !result.success) {
          setError(result?.error || "Course not found");
          return;
        }

        const course = result.data;
        setFormData({
          title: course.title || "",
          description: course.description || "",
          price: course.price || 0,
          category: course.category || "",
          level: course.level || "BEGINNER",
          isPublished: course.isPublished || false,
        });

        setThumbnail(course.thumbnail || null);
        setChapters(
          course.chapters?.map((ch: any) => ({
            id: ch.id,
            title: ch.title || "",
            description: ch.description || "",
            videoUrl: ch.videoUrl || "",
            position: ch.position || 0,
            isFree: ch.isFree || false,
            isPublished: ch.isPublished || false,
          })) || [],
        );
      } catch {
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  // Handle form field changes
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else if (name === "price") {
        setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors],
  );

  // Handle thumbnail change
  const handleThumbnailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Image must be less than 5MB",
        }));
        return;
      }

      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.thumbnail;
        return next;
      });
    },
    [],
  );

  // Handle chapter field changes
  const handleChapterChange = useCallback(
    (index: number, field: string, value: string | boolean) => {
      setChapters((prev) =>
        prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch)),
      );
    },
    [],
  );

  // Add new chapter
  const addChapter = useCallback(() => {
    setChapters((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        videoUrl: "",
        position: prev.length + 1,
        isFree: false,
        isPublished: false,
      },
    ]);
  }, []);

  // Remove chapter
  const removeChapter = useCallback((index: number) => {
    setChapters((prev) => {
      if (prev.length <= 1) return prev;
      return prev
        .filter((_, i) => i !== index)
        .map((ch, i) => ({ ...ch, position: i + 1 }));
    });
  }, []);

  // Move chapter up/down
  const moveChapter = useCallback((index: number, direction: "up" | "down") => {
    setChapters((prev) => {
      const newChapters = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newChapters.length) return prev;

      [newChapters[index], newChapters[targetIndex]] = [
        newChapters[targetIndex],
        newChapters[index],
      ];
      return newChapters.map((ch, i) => ({ ...ch, position: i + 1 }));
    });
  }, []);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";

    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";

    if (formData.price < 0) newErrors.price = "Price cannot be negative";

    if (!formData.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const result = await courseUpdateFields(courseId, {
        ...formData,
      });

      if (result && result.success) {
        setSuccess("Course updated successfully!");
        router.push(`/dashboard/instructor/courses/${courseId}`);
      } else {
        setError(result?.error || "Failed to update course");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-muted-foreground">Loading course data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card rounded-xl p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-destructive">
            error
          </span>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Error</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/dashboard/instructor")}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push("/dashboard/instructor")}
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </button>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <button
            onClick={() =>
              router.push(`/dashboard/instructor/courses/${courseId}`)
            }
            className="hover:text-primary transition-colors"
          >
            Course Details
          </button>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-foreground font-medium">Edit Course</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
            <p className="mt-1 text-muted-foreground">
              Update your course details and manage chapters
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/dashboard/instructor/courses/${courseId}`)
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back
          </button>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="glass-card-no-glow rounded-xl p-4 border border-green-500/30 bg-green-500/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-400">
                check_circle
              </span>
              <p className="text-green-400 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-card-no-glow rounded-xl p-4 border border-destructive/30 bg-destructive/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-destructive">
                error
              </span>
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Details Card */}
          <div className="glass-card rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                info
              </span>
              <h2 className="text-xl font-semibold text-foreground">
                Course Details
              </h2>
            </div>

            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-start gap-6">
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-border/50 bg-card flex-shrink-0">
                    {thumbnailPreview ?
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    : thumbnail ?
                      <img
                        src={thumbnail}
                        alt="Current thumbnail"
                        className="w-full h-full object-cover"
                      />
                    : <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="material-symbols-outlined text-4xl opacity-50">
                          image
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Course Title <span className="text-destructive">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete React Course 2024"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    errors.title ? "border-destructive" : "border-border/50"
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what students will learn in this course..."
                  rows={6}
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    errors.description ? "border-destructive" : (
                      "border-border/50"
                    )
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ?
                    <p className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  : <span />}
                  <span
                    className={`text-xs ${
                      formData.description.length < 20 ?
                        "text-muted-foreground"
                      : "text-green-400"
                    }`}
                  >
                    {formData.description.length}/2000
                  </span>
                </div>
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Category <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Development"
                    className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                      errors.category ? "border-destructive" : (
                        "border-border/50"
                      )
                    } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors capitalize`}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Difficulty Level <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Price & Published Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Price (Rs.)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                      errors.price ? "border-destructive" : "border-border/50"
                    } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {formData.isPublished ? "Published" : "Draft"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {formData.isPublished ?
                          "Visible to students"
                        : "Only you can see this course"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Card */}
          <div className="glass-card rounded-xl p-6 animate-fade-in animation-delay-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  menu_book
                </span>
                <h2 className="text-xl font-semibold text-foreground">
                  Chapters
                </h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                  {chapters.length}
                </span>
              </div>
              <button
                type="button"
                onClick={addChapter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Chapter
              </button>
            </div>

            {chapters.length === 0 ?
              <div className="text-center py-12 text-muted-foreground">
                <span className="material-symbols-outlined text-5xl mb-3 opacity-50">
                  folder_open
                </span>
                <p>No chapters added yet</p>
                <button
                  type="button"
                  onClick={addChapter}
                  className="mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  + Add your first chapter
                </button>
              </div>
            : <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <h3 className="font-medium text-foreground">
                          {chapter.title || `Chapter ${index + 1}`}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => moveChapter(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <span className="material-symbols-outlined text-sm">
                            arrow_upward
                          </span>
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => moveChapter(index, "down")}
                          disabled={index === chapters.length - 1}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <span className="material-symbols-outlined text-sm">
                            arrow_downward
                          </span>
                        </button>
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeChapter(index)}
                          disabled={chapters.length <= 1}
                          className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Remove chapter"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Chapter Fields */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) =>
                            handleChapterChange(index, "title", e.target.value)
                          }
                          placeholder="Chapter title"
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        />
                        <input
                          type="text"
                          value={chapter.videoUrl}
                          onChange={(e) =>
                            handleChapterChange(
                              index,
                              "videoUrl",
                              e.target.value,
                            )
                          }
                          placeholder="Video URL (optional)"
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        />
                      </div>
                      <textarea
                        value={chapter.description}
                        onChange={(e) =>
                          handleChapterChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Chapter description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                      />

                      {/* Chapter Toggles */}
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={chapter.isFree}
                              onChange={(e) =>
                                handleChapterChange(
                                  index,
                                  "isFree",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-input rounded-full peer-checked:bg-green-500 transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Free preview
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={chapter.isPublished}
                              onChange={(e) =>
                                handleChapterChange(
                                  index,
                                  "isPublished",
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-input rounded-full peer-checked:bg-primary transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Published
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(`/dashboard/instructor/courses/${courseId}`)
              }
              className="px-6 py-2.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ?
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    progress_activity
                  </span>
                  Saving...
                </>
              : <>
                  <span className="material-symbols-outlined text-sm">
                    save
                  </span>
                  Save Changes
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
