import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "handbags",
  "shoes",
  "accessories",
  "new_arrivals",
] as const;

export const PRODUCT_BADGES = ["Bestseller", "New", "Limited"] as const;

const MAX_NAME = 200;
const MAX_DESC = 5000;
const MAX_URL = 2048;

export const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(MAX_NAME, `Name must be ≤ ${MAX_NAME} chars`),
  price: z
    .number()
    .finite()
    .min(0, "Price cannot be negative")
    .max(10_000_000, "Price is unreasonably large"),
  description: z.string().trim().max(MAX_DESC).default(""),
  category: z.enum(PRODUCT_CATEGORIES).default("accessories"),
  imageUrl: z.string().trim().url().max(MAX_URL).or(z.literal("")).default(""),
  badge: z.enum(PRODUCT_BADGES).nullable().default(null),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().min(-9999).max(9999).default(0),
});

export const productUpdateSchema = z.object({
  id: z.string().trim().min(1, "Product ID is required"),
  name: z.string().trim().min(1).max(MAX_NAME).optional(),
  price: z.number().finite().min(0).max(10_000_000).optional(),
  description: z.string().trim().max(MAX_DESC).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  imageUrl: z.string().trim().url().max(MAX_URL).or(z.literal("")).optional(),
  badge: z.enum(PRODUCT_BADGES).nullable().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(-9999).max(9999).optional(),
});

export const productIdSchema = z.object({
  id: z.string().trim().min(1, "Product ID is required"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required").max(1024),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validate<T>(
  schema: z.ZodSchema<T>,
  raw: unknown
): ValidationResult<T> {
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message ?? "Invalid input" };
}