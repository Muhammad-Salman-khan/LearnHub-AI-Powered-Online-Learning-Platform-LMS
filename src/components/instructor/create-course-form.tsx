"use client";

import { useState, useRef } from "react";
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
import { CreateCourse } from "@/server/action";
// this is a function that you'll be using to create course
// name CreateCourse
const CATEGORIES = [
  "Web Dev",
  "Data Science",
  "Design",
  "Backend",
  "DevOps",
  "Mobile",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export function CreateCourseForm() {
  const [formData, setFormData] = useState({
    title: "",
    fullDescription: "",
    category: "",
    level: "Beginner",
    price: "0",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    formData.title.length >= 5 &&
    formData.fullDescription.length >= 20 &&
    formData.category !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Course created! (Mock)");
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPG, PNG, WebP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Details Card */}
      <div className="glass-card-no-glow rounded-xl border border-border p-6 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center amber-glow">
            <span className="material-symbols-outlined text-primary text-xl">
              edit
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Course Details
            </h2>
            <p className="text-xs text-muted-foreground">
              Fill in the basic information about your course
            </p>
          </div>
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-foreground flex items-center gap-1"
          >
            Course Title <span className="text-primary font-bold">*</span>
          </Label>
          <div className="relative">
            <Input
              id="title"
              placeholder="e.g. Complete React Bootcamp"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary pl-10 transition-all duration-300 group-hover:border-primary/50 h-11"
              maxLength={100}
            />
            <span className="material-symbols-outlined text-primary absolute left-3 top-1/2 -translate-y-1/2 text-base">
              title
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span
              className={
                formData.title.length < 5 ?
                  "text-destructive"
                : "text-primary/70"
              }
            >
              Min 5 characters
            </span>
            <span
              className={`font-mono ${formData.title.length >= 90 ? "text-destructive" : "text-primary/70"}`}
            >
              {formData.title.length}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
        </div>

        {/* Full Description Field */}
        <div className="space-y-2">
          <Label
            htmlFor="fullDesc"
            className="text-foreground flex items-center gap-1"
          >
            Full Description <span className="text-primary font-bold">*</span>
          </Label>
          <div className="relative">
            <Textarea
              id="fullDesc"
              placeholder="Detailed course description for the course page"
              value={formData.fullDescription}
              onChange={(e) => updateField("fullDescription", e.target.value)}
              className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary pl-10 transition-all duration-300 group-hover:border-primary/50 min-h-[150px]"
            />
            <span className="material-symbols-outlined text-primary absolute left-3 top-4 text-base">
              notes
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span
              className={
                formData.fullDescription.length < 20 ?
                  "text-destructive"
                : "text-primary/70"
              }
            >
              Min 20 characters
            </span>
            <span className="font-mono text-primary/70">
              {formData.fullDescription.length}
              <span className="text-muted-foreground"> chars</span>
            </span>
          </div>
        </div>

        {/* Thumbnail Upload - Horizontal Layout */}
        <div className="space-y-3">
          <Label className="text-foreground flex items-center gap-1">
            Course Thumbnail <span className="text-primary font-bold">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Preview Box */}
            <div
              className={`aspect-video rounded-lg border-2 transition-all duration-300 overflow-hidden flex items-center justify-center ${
                thumbnailPreview ?
                  "border-primary amber-glow"
                : "border-border bg-muted/30"
              }`}
            >
              {thumbnailPreview ?
                <div className="relative w-full h-full group">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-destructive"
                  >
                    <span className="material-symbols-outlined text-base">
                      close
                    </span>
                  </button>
                </div>
              : <div className="text-center p-3 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-xl text-primary">
                      image
                    </span>
                  </div>
                  <p className="text-[10px] text-primary font-medium">
                    16:9 ratio
                  </p>
                  <p className="text-[10px] text-muted-foreground">Max 5MB</p>
                </div>
              }
            </div>

            {/* Upload Button Box */}
            <div className="flex flex-col justify-center items-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <Label
                htmlFor="thumbnail-upload"
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-300 font-medium ${
                  thumbnailPreview ?
                    "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  : "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 amber-glow hover:scale-[1.02]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {thumbnailPreview ? "refresh" : "cloud_upload"}
                </span>
                <span className="text-sm">
                  {thumbnailPreview ? "Change" : "Upload"}
                </span>
              </Label>
              <div className="w-full space-y-1 px-2">
                <p className="text-[10px] text-muted-foreground text-center">
                  <span className="text-primary">JPG</span> •{" "}
                  <span className="text-primary">PNG</span> •{" "}
                  <span className="text-primary">WebP</span>
                </p>
                {thumbnailFile && (
                  <p className="text-[10px] text-primary flex items-center justify-center gap-1 bg-primary/10 px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    <span className="truncate">{thumbnailFile.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="glass-card-no-glow rounded-xl border border-border p-6 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center amber-glow">
            <span className="material-symbols-outlined text-primary text-xl">
              settings
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Course Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure category, level, and pricing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-foreground flex items-center gap-1"
            >
              Category <span className="text-primary font-bold">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(v) => updateField("category", v)}
            >
              <SelectTrigger className="bg-background border-border focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary/50 h-11">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    category
                  </span>
                  <SelectValue placeholder="Select category" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-foreground focus:bg-primary/10 focus:text-primary cursor-pointer hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {cat}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label
              htmlFor="level"
              className="text-foreground flex items-center gap-1"
            >
              Level <span className="text-primary font-bold">*</span>
            </Label>
            <Select
              value={formData.level}
              onValueChange={(v) => updateField("level", v)}
            >
              <SelectTrigger className="bg-background border-border focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary/50 h-11">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    school
                  </span>
                  <SelectValue placeholder="Select level" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {LEVELS.map((level) => (
                  <SelectItem
                    key={level}
                    value={level}
                    className="text-foreground focus:bg-primary/10 focus:text-primary cursor-pointer hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          level === "Beginner" ? "bg-green-500"
                          : level === "Intermediate" ? "bg-primary"
                          : "bg-red-500"
                        }`}
                      />
                      {level}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label
              htmlFor="price"
              className="text-foreground flex items-center gap-1"
            >
              Price (Rs.)
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary pl-10 transition-all duration-300 group-hover:border-primary/50 h-11"
              />
              <span className="material-symbols-outlined text-primary absolute left-3 top-1/2 -translate-y-1/2 text-base">
                attach_money
              </span>
            </div>
            <p className="text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">
                info
              </span>
              <span className="text-muted-foreground">
                Enter <span className="text-primary font-medium">0</span> for
                free courses
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-4 pb-8">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`h-14 px-10 font-bold text-base transition-all duration-300 rounded-xl ${
            isValid && !isSubmitting ?
              "bg-primary text-primary-foreground hover:opacity-90 amber-glow hover:scale-[1.02]"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          {isSubmitting ?
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-primary">
                progress_activity
              </span>
              Creating...
            </span>
          : <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">
                add_circle
              </span>
              Create Course
            </span>
          }
        </Button>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-primary amber-glow" />
          <p className="text-muted-foreground">
            <span className="text-primary font-bold">*</span> Required fields
          </p>
        </div>

        {isValid && (
          <div className="ml-auto flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-base">
              check_circle
            </span>
            Form ready to submit
          </div>
        )}
      </div>
    </form>
  );
}
