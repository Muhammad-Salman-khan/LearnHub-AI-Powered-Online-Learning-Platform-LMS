"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Use shadcn components for consistency with LoginPage
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChapterFormProps {
  courseId: string;
  onCancel?: () => void;
}

export function ChapterForm({ courseId, onCancel }: ChapterFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    position: 1,
    content: "",
    isFree: false,
    isPublished: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ BACKEND READY - Exact Prisma structure
    const payload = {
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      position: formData.position,
      content: formData.content,
      isFree: formData.isFree,
      isPublished: formData.isPublished,
      courseId: courseId,
    };

    console.log("📦 SUBMIT PAYLOAD:", payload);

    // TODO: Replace with actual server action
    // await createChapter(payload)

    await new Promise((r) => setTimeout(r, 800));

    router.push(`/dashboard/instructor/courses/${courseId}`);
    router.refresh();
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border-0 sm:border">
      <CardHeader className="pb-4">
        <p className="text-xs uppercase tracking-wider text-[#f97316] mb-2">
          Course Builder
        </p>
        <CardTitle className="text-xl sm:text-2xl">
          Create New Chapter
        </CardTitle>
        <CardDescription className="text-sm">
          Course ID:{" "}
          <span className="text-[#f97316] font-mono">{courseId}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm">
              Chapter Title <span className="text-[#f97316]">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Introduction to Design Tokens"
              className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
              placeholder="What will students learn in this chapter?"
              className="w-full min-h-[80px] bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 focus:outline-none disabled:opacity-50 resize-none transition-all"
            />
          </div>

          {/* Video URL */}
          <div className="grid gap-2">
            <Label htmlFor="videoUrl" className="text-sm">
              Video URL
            </Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="https://youtube.com/watch?v=..."
              className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 disabled:opacity-50"
            />
          </div>

          {/* Position + Free Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="position" className="text-sm">
                Position <span className="text-[#f97316]">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                type="number"
                value={formData.position}
                onChange={handleChange}
                min={1}
                required
                disabled={isSubmitting}
                className="h-10 sm:h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 disabled:opacity-50"
              />
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-input bg-background text-[#f97316] focus:ring-[#f97316] focus:ring-offset-2 accent-[#f97316]"
                />
                <Label
                  htmlFor="isFree"
                  className="text-sm cursor-pointer text-foreground"
                >
                  Free preview
                </Label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-sm">
              Content (Optional)
            </Label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
              placeholder="# Chapter Notes&#10;&#10;## Key Concepts&#10;- Concept 1&#10;- Concept 2"
              className="w-full min-h-[120px] bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 focus:outline-none disabled:opacity-50 resize-none font-mono transition-all"
            />
          </div>

          {/* Publish Checkbox - Exact LoginPage Style */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-4 h-4 rounded border-input bg-background text-[#f97316] focus:ring-[#f97316] focus:ring-offset-2 accent-[#f97316]"
            />
            <Label
              htmlFor="isPublished"
              className="text-sm cursor-pointer text-foreground"
            >
              Publish immediately
            </Label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel || (() => router.back())}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 sm:h-11 px-6 bg-gradient-to-br from-[#ffb690] to-[#f97316] text-[#131313] font-medium shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.08)] border-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#131313] border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                "Create Chapter"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
