import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Function 1 — cn() — Class Name Helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function 2 — formatPrice() — Price Display
export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

// Function 3 — formatDuration() — Video Duration
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

// Function 4 — slugify() — URL Slug Generator
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Function 5 — getInitials() — Avatar Letters
export function getInitials(name: string): string {
  if (!name || name.trim() === "") return "?";
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Function 6 — truncate() — Text Shortening
export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Function 7 — timeAgo() — Relative Time
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}
