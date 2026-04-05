// Top of your file
// lib/validations.ts
// Written by: Abdullah
// Purpose: All Zod validation schemas for LearnHub forms
// Used by: Mubeen (React Hook Form), Zaid (API input validation)
import { z } from "zod";
//  Auth Schemas
// loginSchema, registerSchema
//  Course Schemas
// courseSchema, chapterSchema
//  User Schemas
// profileSchema, reviewSchema, commentSchema, searchSchema

// -----------------------------loginSchema----------------------------- //
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});
export type LoginInput = z.infer<typeof loginSchema>;

// -----------------------------registerSchema----------------------------- //
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      })
      .max(100, {
        message: "Confirm Password must be at most 100 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// -----------------------------courseSchema----------------------------- //
export const courseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
  price: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(50000, "Price seems too high"),
  isPublished: z.boolean().default(true),
  category: z.string().min(1, "Please select a category"),
  content: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    message: "Please select a valid level",
  }),
  thumbnail: z.file().optional(),
});
export type CourseInput = z.infer<typeof courseSchema>;

// -----------------------------chapterSchema----------------------------- //
export const chapterSchema = z.object({
  title: z
    .string()
    .min(3, "Chapter title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  videoUrl: z
    .string()
    .url("Must be a valid video URL")
    .optional()
    .or(z.literal("")),
  content: z.string().optional(),
  position: z.number().int(),
  isPublished: z.boolean().optional(),
  isFree: z.boolean().default(false),
});
export type ChapterInput = z.infer<typeof chapterSchema>;

// -----------------------------reviewSchema----------------------------- //
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot be more than 5 stars")
    .int("Rating must be a whole number"),
  comment: z.string().max(1000, "Review is too long").optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

// -----------------------------profileSchema----------------------------- //
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  bio: z.string().max(500, "Bio is too long").optional(),
  headline: z.string().max(100, "Headline is too long").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;

// -----------------------------searchSchema----------------------------- //
export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});
export type SearchInput = z.infer<typeof searchSchema>;

// -----------------------------commentSchema----------------------------- //
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
  parentId: z.string().optional(),
  // parentId is the ID of the comment being replied to.
  // If it is a top-level comment, parentId is not provided.
});
export type CommentInput = z.infer<typeof commentSchema>;
