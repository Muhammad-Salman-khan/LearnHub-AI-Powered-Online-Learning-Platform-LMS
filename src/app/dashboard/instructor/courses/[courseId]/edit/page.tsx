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
import Image from "next/image";
import { getCourseById, courseUpdateFields } from "@/server/action";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const CATEGORIES = [
  "Web Dev",
  "Data Science",
  "Design",
  "Backend",
  "DevOps",
  "Mobile",
];
const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { data: session, status } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  const [showPublishTooltip, setShowPublishTooltip] = useState(false);

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
        if (!course) {
          setError("Course data unavailable");
          return;
        }
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
          course.chapters?.map((ch) => ({
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

  // Remove chapter (with confirmation)
  const removeChapter = useCallback((index: number) => {
    if (!confirm("Delete this chapter? This cannot be undone.")) return;
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
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const result = await courseUpdateFields(courseId, formData );
      if (result && result.success) {
        setSuccess("Course updated successfully!");
        setTimeout(
          () => router.push(`/dashboard/instructor/courses/${courseId}`),
          1500,
        );
      } else {
        setError(result?.error || "Failed to update course");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle publish toggle with validation
  const handlePublishToggle = async (checked: boolean) => {
    if (checked && chapters.filter((c) => c.isPublished).length === 0) {
      setShowPublishTooltip(true);
      setTimeout(() => setShowPublishTooltip(false), 3000);
      return;
    }
    setFormData((prev) => ({ ...prev, isPublished: checked }));
    // TODO: Call togglePublish Server Action here
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
          <Button
            onClick={() => router.push("/dashboard/instructor")}
            className="mt-6 bg-primary text-primary-foreground hover:opacity-90"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-fit flex-shrink-0">
        <DashboardSidebar role="instructor" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar */}
        <DashboardNavbar
          title="Edit Course"
          role="instructor"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={() => router.push("/dashboard/instructor")}
                className="hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <button
                onClick={() =>
                  router.push(`/dashboard/instructor/courses/${courseId}`)
                }
                className="hover:text-primary transition-colors truncate"
              >
                {formData.title || "Course"}
              </button>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-primary font-medium">Edit</span>
            </nav>

            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Edit Course
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Update course details and manage chapters
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/instructor/courses/${courseId}`)
                }
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <span className="material-symbols-outlined text-base mr-2">
                  arrow_back
                </span>
                Back
              </Button>
            </div>

            {/* Success/Error Alerts */}
            {success && (
              <div className="glass-card-no-glow rounded-xl p-4 border border-green-500/30 bg-green-500/10 animate-fade-in flex items-center gap-3">
                <span className="material-symbols-outlined text-green-400">
                  check_circle
                </span>
                <p className="text-green-400 font-medium">{success}</p>
              </div>
            )}
            {error && (
              <div className="glass-card-no-glow rounded-xl p-4 border border-destructive/30 bg-destructive/10 animate-fade-in flex items-center gap-3">
                <span className="material-symbols-outlined text-destructive">
                  error
                </span>
                <p className="text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* TWO-COLUMN LAYOUT: Left 40% (5/12), Right 60% (7/12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Course Metadata (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Course Details Card */}
                <div className="glass-card-no-glow rounded-xl border border-border p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center amber-glow">
                      <span className="material-symbols-outlined text-primary text-xl">
                        description
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        Course Details
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Edit course metadata
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center gap-1">
                        Course Title{" "}
                        <span className="text-primary font-bold">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Complete React Bootcamp"
                          className={`bg-background border-border focus-visible:ring-2 focus-visible:ring-primary pl-10 h-11 ${errors.title ? "border-destructive" : ""}`}
                          maxLength={100}
                        />
                        <span className="material-symbols-outlined text-primary absolute left-3 top-1/2 -translate-y-1/2 text-base">
                          title
                        </span>
                      </div>
                      {errors.title && (
                        <p className="text-xs text-destructive">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Category & Level */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">
                          Category{" "}
                          <span className="text-primary font-bold">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) =>
                            setFormData({ ...formData, category: v })
                          }
                        >
                          <SelectTrigger className="bg-background border-border h-11">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            {CATEGORIES.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="text-foreground focus:bg-primary/10 focus:text-primary"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-xs text-destructive">
                            {errors.category}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">
                          Level{" "}
                          <span className="text-primary font-bold">*</span>
                        </Label>
                        <Select
                          value={formData.level}
                          onValueChange={(v) =>
                            setFormData({ ...formData, level: v as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" })
                          }
                        >
                          <SelectTrigger className="bg-background border-border h-11">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            {LEVELS.map((level) => (
                              <SelectItem
                                key={level}
                                value={level}
                                className="text-foreground focus:bg-primary/10 focus:text-primary"
                              >
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label className="text-foreground">Price (Rs.)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary pl-10 h-11"
                        />
                        <span className="material-symbols-outlined text-primary absolute left-3 top-1/2 -translate-y-1/2 text-base">
                          attach_money
                        </span>
                      </div>
                      {errors.price && (
                        <p className="text-xs text-destructive">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center gap-1">
                        Description{" "}
                        <span className="text-primary font-bold">*</span>
                      </Label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What will students learn?"
                        className={`bg-background border-border focus-visible:ring-2 focus-visible:ring-primary min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                      />
                      <div className="flex justify-between text-xs">
                        <span
                          className={
                            formData.description.length < 20
                              ? "text-destructive"
                              : "text-primary/70"
                          }
                        >
                          Min 20 characters
                        </span>
                        <span className="font-mono text-primary/70">
                          {formData.description.length}
                          <span className="text-muted-foreground"> chars</span>
                        </span>
                      </div>
                      {errors.description && (
                        <p className="text-xs text-destructive">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                      <Label className="text-foreground">
                        Course Thumbnail
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`aspect-video rounded-lg border-2 overflow-hidden flex items-center justify-center ${thumbnailPreview || thumbnail ? "border-primary amber-glow" : "border-border bg-muted/30"}`}
                        >
                          {thumbnailPreview || thumbnail ? (
                            <Image
                              src={thumbnailPreview || thumbnail!}
                              alt="Thumbnail"
                              width={320}
                              height={180}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <span className="material-symbols-outlined text-2xl text-primary">
                                image
                              </span>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                16:9 ratio
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center items-center space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <Label
                            htmlFor="thumbnail-upload"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 amber-glow transition-all"
                          >
                            <span className="material-symbols-outlined text-xl">
                              cloud_upload
                            </span>
                            <span className="text-sm">Upload</span>
                          </Label>
                          <p className="text-[10px] text-muted-foreground text-center">
                            JPG • PNG • WebP • Max 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publish Toggle Card (at bottom of left column) */}
                <div className="glass-card-no-glow rounded-xl border border-border p-6 relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${formData.isPublished ? "bg-green-500" : "bg-gradient-to-r from-primary via-orange-500 to-primary"} opacity-80`}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.isPublished ? "bg-green-500/20" : "bg-primary/20"} ${!formData.isPublished ? "amber-glow" : ""}`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl ${formData.isPublished ? "text-green-500" : "text-primary"}`}
                        >
                          {formData.isPublished ? "check_circle" : "public"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {formData.isPublished
                            ? "Published"
                            : "Ready to Publish?"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formData.isPublished
                            ? "Visible to students"
                            : "Draft - not visible"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={handlePublishToggle}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  {/* Publish Validation Tooltip */}
                  {showPublishTooltip && (
                    <div className="absolute -top-3 right-0 bg-destructive text-destructive-foreground text-xs px-3 py-1.5 rounded-lg shadow-lg animate-slide-up flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        warning
                      </span>
                      Publish at least 1 chapter first
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Chapter Management (7 columns) */}
              <div className="lg:col-span-7">
                <div className="glass-card-no-glow rounded-xl border border-border p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center amber-glow">
                        <span className="material-symbols-outlined text-primary text-xl">
                          playlist_play
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          Course Content
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {chapters.length} chapters
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chapter List */}
                  <div className="space-y-2">
                    {chapters.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-3xl text-primary">
                            video_library
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          No chapters yet. Add your first chapter to get
                          started.
                        </p>
                        <Button
                          onClick={addChapter}
                          className="bg-primary text-primary-foreground hover:opacity-90"
                        >
                          <span className="material-symbols-outlined text-base mr-2">
                            add
                          </span>
                          Add Chapter
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((chapter, index) => (
                          <div
                            key={chapter.id || index}
                            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background/50 hover:border-primary/30 transition-all duration-300 group"
                          >
                            {/* Position Badge */}
                            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center font-mono text-sm font-bold text-muted-foreground">
                              {chapter.position < 10
                                ? `0${chapter.position}`
                                : chapter.position}
                            </div>
                            {/* Chapter Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground truncate">
                                  {chapter.title ||
                                    `Chapter ${chapter.position}`}
                                </h3>
                                {chapter.isFree && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                                    FREE
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {chapter.videoUrl ? (
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">
                                      youtube
                                    </span>
                                    Video added
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-destructive">
                                    <span className="material-symbols-outlined text-xs">
                                      warning
                                    </span>
                                    No video
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Published Toggle */}
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs ${chapter.isPublished ? "text-green-500" : "text-muted-foreground"}`}
                              >
                                {chapter.isPublished ? "Published" : "Draft"}
                              </span>
                              <Switch
                                checked={chapter.isPublished}
                                onCheckedChange={() =>
                                  handleChapterChange(
                                    index,
                                    "isPublished",
                                    !chapter.isPublished,
                                  )
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            {/* Move Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => moveChapter(index, "up")}
                                disabled={index === 0}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  arrow_upward
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => moveChapter(index, "down")}
                                disabled={index === chapters.length - 1}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  arrow_downward
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeChapter(index)}
                                disabled={chapters.length <= 1}
                                className="p-1.5 rounded hover:bg-destructive/20 text-destructive disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  delete
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Chapter Button */}
                  <Button
                    onClick={addChapter}
                    variant="outline"
                    className="w-full border-2 border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary h-12"
                  >
                    <span className="material-symbols-outlined text-base mr-2">
                      add_circle
                    </span>
                    Add Chapter
                  </Button>
                </div>
              </div>
            </div>

            {/* Save Button - Below both columns */}
            <div className="flex justify-end pt-4 pb-8">
              <Button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="h-14 px-10 font-bold bg-primary text-primary-foreground hover:opacity-90 amber-glow hover:scale-[1.02] transition-all"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined">save</span>Save
                    Changes
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[240px] p-0 bg-background border-r border-border"
        >
          <DashboardSidebar
            role="instructor"
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
