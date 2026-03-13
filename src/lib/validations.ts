import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  contact_name: z.string().max(100).optional().or(z.literal("")),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  is_active: z.boolean().optional(),
});

export const albumSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  is_published: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const mediaUpdateSchema = z.object({
  caption: z.string().max(500).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).optional(),
});

// Helper to generate slug from name
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
