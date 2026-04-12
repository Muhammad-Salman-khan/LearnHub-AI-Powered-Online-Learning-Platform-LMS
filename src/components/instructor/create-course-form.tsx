"use client";

import { CreateCourse } from "@/server/action";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";

// ✅ shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// ✅ Icons
import { Upload, Image, DollarSign, BookOpen, Trophy, Tags, TrendingUp } from "lucide-react";

export function CreateCourseForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null as File | null,
    price: "",
    category: "",
    level: "BEGINNER",
    isPublished: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (JPG, PNG, WebP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (error) setError(null);
    }
  };

  const handleLevelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, level: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Course title is required");
      return;
    }
    if (formData.title.length < 10) {
      setError("Course title must be at least 10 characters");
      return;
    }
    if (!formData.description.trim()) {
      setError("Course description is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.thumbnail) {
      setError("Please upload a course thumbnail");
      return;
    }

    setLoading(true);

    try {
      await CreateCourse(formData);
      router.push("/dashboard/instructor/courses");
      router.refresh();
    } catch (err) {
      console.error("Create course error:", err);
      setError("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔹 ERROR BANNER */}
        {error && (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 flex items-start gap-3">
            <span className="material-symbols-outlined text-destructive text-lg shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-destructive/60 hover:text-destructive transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* 🔹 COURSE THUMBNAIL CARD */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="w-5 h-5 text-[#f97316]" />
              Course Thumbnail
            </CardTitle>
            <CardDescription>
              Upload a 16:9 ratio image (recommended: 1280 x 720 px, max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                thumbnailPreview
                  ? "border-[#f97316]/50 bg-[#f97316]/5"
                  : "border-border/50 hover:border-[#f97316]/50 hover:bg-muted/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              
              {thumbnailPreview ? (
                <div className="relative">
                  <NextImage
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={384}
                    height={192}
                    className="max-h-48 mx-auto rounded-lg shadow-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#f97316]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP • Max 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 🔹 COURSE DETAILS CARD */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#f97316]" />
              Course Details
            </CardTitle>
            <CardDescription>
              Basic information about your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm">
                Course Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Web Development Bootcamp 2025"
                className="h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-0"
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100 characters (min 10)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                className="min-h-[140px] transition-all duration-300 focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-0 resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* 🔹 COURSE SETTINGS CARD */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#f97316]" />
              Course Settings
            </CardTitle>
            <CardDescription>
              Configure category, level, and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 🔹 CATEGORY with Orange Icon */}
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-sm flex items-center gap-1.5">
                  <Tags className="w-3.5 h-3.5 text-[#f97316]" />
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316]/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 🔹 LEVEL with Orange Icon */}
              <div className="grid gap-2">
                <Label htmlFor="level" className="text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#f97316]" />
                  Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger className="h-11 transition-all duration-300 focus:ring-2 focus:ring-[#f97316]/50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 🔹 PRICE with Orange Icon */}
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-sm flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#f97316]" />
                  Price (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f97316]" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-11 pl-9 transition-all duration-300 focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter 0 for free courses
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="isPublished" className="text-sm font-medium">
                  Publish Course
                </Label>
                <p className="text-xs text-muted-foreground">
                  Make this course visible to students immediately
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublished: checked }))
                }
                className="data-[state=checked]:bg-[#f97316]"
              />
            </div>
          </CardContent>
        </Card>

        {/* 🔹 SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 gap-2 shadow-lg shadow-[#f97316]/20"
          style={{ backgroundColor: "#f97316", color: "white" }}
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Creating Course...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Create Course</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}