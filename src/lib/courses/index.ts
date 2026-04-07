import { Course } from "../types";
import { electrocutionHazardsPart1Course } from "./con_368_int_en";

export const COURSES: Course[] = [
  electrocutionHazardsPart1Course,
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
