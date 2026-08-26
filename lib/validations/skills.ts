import { z } from "zod";

export const skillFormSchema = z.object({
  name: z.string().min(2, "Skill name is required"),
  icon: z.string().optional(),
  level: z.string().optional(),
  percentage: z.coerce.number().int().min(0).max(100).optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().optional(),
});

export const skillCategoryFormSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
