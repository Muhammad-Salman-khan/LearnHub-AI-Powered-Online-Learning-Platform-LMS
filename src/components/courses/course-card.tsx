import Link from "next/link";
import Image from "next/image";

/**
 * CourseCard — Scholarly Architect Design System
 *
 * Card structure per design spec:
 *   - aspect-video image with hover scale
 *   - Institution label (10px uppercase tracking-widest text-primary)
 *   - Course title (text-lg font-bold font-headline)
 *   - Instructor name
 *   - Rating: score + 5 filled stars (tertiary #822800) + review count
 *   - Price (text-lg font-extrabold)
 */

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail: string | null;
  price: number;
  category: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  instructor: { name: string; image: string | null };
  rating?: number;
  students?: number;
  institution?: string;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) =>
    price === 0 ? "Free" : `$${price.toFixed(2)}`;

  // Generate star rating display
  const renderStars = (rating: number = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Filled star
        stars.push(
          <span
            key={i}
            className="material-symbols-outlined text-xs"
            style={{
              color: "var(--tertiary)",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            star
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star
        stars.push(
          <span
            key={i}
            className="material-symbols-outlined text-xs"
            style={{ color: "var(--tertiary)" }}
          >
            star_half
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span
            key={i}
            className="material-symbols-outlined text-xs"
            style={{ color: "var(--tertiary)" }}
          >
            star
          </span>
        );
      }
    }
    return stars;
  };

  const rating = course.rating ?? 4.5;
  const reviewCount = course.students
    ? `${(course.students / 1000).toFixed(1)}k`
    : "1.2k";

  // Use category as institution if not provided
  const institution = course.institution || course.category || "LearnHub";

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div
        className="relative aspect-video rounded overflow-hidden mb-4"
        style={{ backgroundColor: "var(--surface-container)" }}
      >
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--surface-container-high)" }}
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ color: "var(--outline)" }}
            >
              school
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="space-y-2">
        {/* Institution label */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)", fontFamily: "var(--font-body)" }}
          >
            {institution}
          </span>
        </div>

        {/* Course title */}
        <h3
          className="text-lg font-bold leading-tight transition-colors"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--on-surface)",
          }}
        >
          <span className="group-hover:text-[var(--primary)]">{course.title}</span>
        </h3>

        {/* Instructor */}
        <p
          className="text-sm"
          style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
        >
          {course.instructor.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-1">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--tertiary)", fontFamily: "var(--font-headline)" }}
          >
            {rating.toFixed(1)}
          </span>
          <div className="flex" style={{ color: "var(--tertiary)" }}>
            {renderStars(rating)}
          </div>
          <span
            className="text-xs"
            style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
          >
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <p
          className="text-lg font-extrabold pt-1"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--on-surface)",
          }}
        >
          {formatPrice(course.price)}
        </p>
      </div>
    </Link>
  );
}
