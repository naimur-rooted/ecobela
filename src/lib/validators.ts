import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9\u0980-\u09FF]+(?:-[a-z0-9\u0980-\u09FF]+)*$/, "Slug may only contain lowercase letters, numbers and hyphens"),
  parentId: z.string().cuid().nullable().optional(),
});

/** One size/color combination with its own SKU + stock. */
export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  sku: z.string().trim().min(1, "SKU is required").max(64),
  size: z.string().trim().max(40).nullable().optional(),
  color: z.string().trim().max(40).nullable().optional(),
  stockQuantity: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

export const imageSchema = z.object({
  id: z.string().cuid().optional(),
  imageUrl: z.string().trim().min(1, "Image URL is required").max(2048),
  publicId: z.string().trim().max(255).nullable().optional(),
  isMain: z.boolean().default(false),
  position: z.coerce.number().int().min(0).default(0),
});

export const productSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(180)
      .regex(/^[a-z0-9\u0980-\u09FF]+(?:-[a-z0-9\u0980-\u09FF]+)*$/, "Slug may only contain lowercase letters, numbers and hyphens"),
    description: z.string().trim().max(5000).nullable().optional(),
    basePrice: z.coerce.number().positive("Price must be greater than 0").max(9_999_999),
    categoryId: z.string().cuid("Select a category").nullable().optional(),
    isActive: z.boolean().default(true),
    variants: z.array(variantSchema).min(1, "Add at least one variant (size / color) to track stock"),
    images: z.array(imageSchema).max(12, "Maximum 12 images per product").default([]),
  })
  .superRefine((value, ctx) => {
    // No duplicate SKUs inside one payload (the DB enforces this globally too)
    const seen = new Map<string, number>();
    value.variants.forEach((variant, index) => {
      const key = variant.sku.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "sku"],
          message: "Duplicate SKU in this product",
        });
      }
      seen.set(key, index);
    });

    // No duplicate size+color combinations (mirrors the DB @@unique constraint)
    const combos = new Set<string>();
    value.variants.forEach((variant, index) => {
      const key = `${(variant.size ?? "").toLowerCase()}::${(variant.color ?? "").toLowerCase()}`;
      if (combos.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "size"],
          message: "Duplicate size / color combination",
        });
      }
      combos.add(key);
    });

    if (value.images.length && !value.images.some((image) => image.isMain)) {
      value.images[0].isMain = true;
    }
  });

export const productUpdateSchema = productSchema;

export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
