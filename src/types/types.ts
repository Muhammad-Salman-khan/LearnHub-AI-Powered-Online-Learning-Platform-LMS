import z from "zod";

export interface getSearchedCoursesParams {
  search?: string;
  category?: string;
  level?: string;
  price?: string;
}
