import { Prisma } from "@prisma/client";

import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { productListInclude } from "@/lib/serializers";
import type { ProductInput } from "@/lib/validators";

/**
 * Product write operations.
 *
 * A product, its variants and its images are ALWAYS written inside a single
 * `prisma.$transaction`, so a half-created product can never reach the store.
 */

/** Guarantees exactly one main image and a stable `position` for every image. */
function normaliseImages(images: ProductInput["images"]) {
  const cleaned = images
    .filter((image) => image.imageUrl.trim().length > 0)
    .map((image, index) => ({ ...image, position: index }));

  const mainIndex = cleaned.findIndex((image) => image.isMain);
  return cleaned.map((image, index) => ({
    imageUrl: image.imageUrl,
    publicId: image.publicId ?? null,
    isMain: index === (mainIndex === -1 ? 0 : mainIndex),
    position: index,
  }));
}

function normaliseVariants(variants: ProductInput["variants"]) {
  return variants.map((variant) => ({
    sku: variant.sku.trim(),
    size: variant.size?.trim() ? variant.size.trim() : null,
    color: variant.color?.trim() ? variant.color.trim() : null,
    stockQuantity: Math.max(0, Math.trunc(variant.stockQuantity)),
  }));
}

async function assertCategoryExists(categoryId: string | null | undefined) {
  if (!categoryId) return null;
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) throw new ProductServiceError("The selected category no longer exists.", 422);
  return category.id;
}

export class ProductServiceError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "ProductServiceError";
    this.status = status;
  }
}

/** Human-readable translation of raw Prisma errors. */
export function describePrismaError(error: unknown): ProductServiceError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  if (error.code === "P2002") {
    const target = Array.isArray(error.meta?.target) ? (error.meta?.target as string[]).join(", ") : String(error.meta?.target ?? "");
    if (target.includes("sku")) return new ProductServiceError("A variant with one of these SKUs already exists.", 409);
    if (target.includes("slug")) return new ProductServiceError("A product with this slug already exists.", 409);
    if (target.includes("name") || target.includes("slug")) return new ProductServiceError("A category with this name or slug already exists.", 409);
    if (target.includes("email")) return new ProductServiceError("An account with this email already exists.", 409);
    return new ProductServiceError(`Duplicate value for ${target || "a unique field"}.`, 409);
  }

  if (error.code === "P2003") {
    return new ProductServiceError("Related record is missing or still referenced by other data.", 409);
  }

  if (error.code === "P2025") {
    return new ProductServiceError("The requested record could not be found.", 404);
  }

  if (error.code === "P2014") {
    return new ProductServiceError("This record is referenced by other data and cannot be changed.", 409);
  }

  return null;
}

/** Creates product + variants + images in ONE transaction. */
export async function createProduct(input: ProductInput) {
  const categoryId = await assertCategoryExists(input.categoryId ?? null);
  const images = normaliseImages(input.images);
  const variants = normaliseVariants(input.variants);

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        title: input.title.trim(),
        slug: input.slug.trim(),
        description: input.description?.trim() || null,
        basePrice: new Prisma.Decimal(input.basePrice),
        categoryId,
        isActive: input.isActive,
        images: images.length ? { create: images } : undefined,
        variants: { create: variants },
      },
      select: { id: true },
    });

    return tx.product.findUniqueOrThrow({ where: { id: created.id }, include: productListInclude });
  });

  return product;
}


/** Updates product + variants + images in ONE transaction. */
export async function updateProduct(id: string, input: ProductInput) {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: { select: { id: true } } },
  });
  if (!existing) throw new ProductServiceError("Product not found.", 404);

  const categoryId = await assertCategoryExists(input.categoryId ?? null);
  const images = normaliseImages(input.images);
  const ownVariantIds = new Set(existing.variants.map((variant) => variant.id));

  // Reject attempts to update a variant that belongs to a different product.
  for (const variant of input.variants) {
    if (variant.id && !ownVariantIds.has(variant.id)) {
      throw new ProductServiceError("One of the variants does not belong to this product.", 422);
    }
  }

  const keptVariantIds = input.variants.map((variant) => variant.id).filter(Boolean) as string[];
  const removedVariantIds = [...ownVariantIds].filter((variantId) => !keptVariantIds.includes(variantId));
  const removedImagePublicIds = existing.images
    .filter((image) => !input.images.some((incoming) => incoming.id === image.id))
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => Boolean(publicId));

  const product = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        title: input.title.trim(),
        slug: input.slug.trim(),
        description: input.description?.trim() || null,
        basePrice: new Prisma.Decimal(input.basePrice),
        categoryId,
        isActive: input.isActive,
      },
    });

    if (removedVariantIds.length) {
      await tx.productVariant.deleteMany({ where: { id: { in: removedVariantIds } } });
    }

    for (const variant of input.variants) {
      const data = {
        sku: variant.sku.trim(),
        size: variant.size?.trim() || null,
        color: variant.color?.trim() || null,
        stockQuantity: Math.max(0, Math.trunc(variant.stockQuantity)),
      };

      if (variant.id) {
        await tx.productVariant.update({ where: { id: variant.id }, data });
      } else {
        await tx.productVariant.create({ data: { ...data, productId: id } });
      }
    }

    // Images carry no foreign keys, so replacing the set is safe and simple.
    await tx.productImage.deleteMany({ where: { productId: id } });
    if (images.length) {
      await tx.productImage.createMany({ data: images.map((image) => ({ ...image, productId: id })) });
    }

    return tx.product.findUniqueOrThrow({ where: { id }, include: productListInclude });
  });

  // Remote cleanup happens after the DB commit so a Cloudinary hiccup can never
  // roll back a successful product update.
  if (removedImagePublicIds.length) {
    await Promise.all(removedImagePublicIds.map((publicId) => destroyCloudinaryAsset(publicId)));
  }

  return product;
}

export async function setProductActive(id: string, isActive: boolean) {
  const product = await prisma.product.update({ where: { id }, data: { isActive }, select: { id: true, isActive: true } });
  return product;
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: { select: { publicId: true } }, _count: { select: { variants: true } } },
  });
  if (!existing) throw new ProductServiceError("Product not found.", 404);

  await prisma.$transaction(async (tx) => {
    // Variants + images cascade via the schema's onDelete: Cascade.
    await tx.product.delete({ where: { id } });
  });

  const publicIds = existing.images.map((image) => image.publicId).filter((publicId): publicId is string => Boolean(publicId));
  if (publicIds.length) await Promise.all(publicIds.map((publicId) => destroyCloudinaryAsset(publicId)));

  return { id, deletedVariants: existing._count.variants };
}
