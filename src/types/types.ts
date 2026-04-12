import z from "zod";

export interface GetSearchedCoursesParams {
  search?: string;
  category?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: string;
  page?: number;
  pageSize?: number;
}

export type PaginatedResponse<T> = {
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};
