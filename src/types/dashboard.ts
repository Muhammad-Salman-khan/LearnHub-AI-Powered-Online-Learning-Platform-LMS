// Shared DTOs for dashboard data display
// Eliminates `any` casting across dashboard pages

export type RecentUserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
};

export type RecentCourseDTO = {
  id: string;
  title: string;
  instructorName?: string;
  category: string;
  isPublished: boolean;
  createdAt: Date | string;
  price?: number;
};

export type DashboardCourseDTO = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  category: string;
  level: string;
  isPublished: boolean;
  instructorId: string;
  rating: number;
  createdAt: Date;
};

export type DashboardUserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: Date;
};
