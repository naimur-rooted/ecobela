import type { Prisma, Product, ProductImage, ProductVariant, Category } from "@prisma/client";
import { toNumber } from "@/lib/utils";

/**
 * Data Transfer Objects.
 *
 * Prisma returns `Decimal` instances for prices, which cannot cross the
 * server → client boundary. Every product leaving the data layer is normalised
 * into these plain objects by `serializeProduct`.
 */
export type ProductImageDTO = {
  id: string;
  imageUrl: string;
  publicId: string | null;
  isMain: boolean;
  position: number;
};

export type ProductVariantDTO = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stockQuantity: number;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type CategoryWithChildrenDTO = CategoryDTO & {
  children: CategoryWithChildrenDTO[];
  productCount?: number;
};

export type ProductListItemDTO = {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
  mainImage: ProductImageDTO | null;
  totalStock: number;
  variantCount: number;
  colorCount: number;
  sizeCount: number;
};

export type ProductDetailDTO = ProductListItemDTO & {
  description: string | null;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  category: CategoryDTO | null;
};

type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category | null;
  _count?: { variants: number };
};

export function serializeImage(image: ProductImage): ProductImageDTO {
  return {
    id: image.id,
    imageUrl: image.imageUrl,
    publicId: image.publicId ?? null,
    isMain: image.isMain,
    position: image.position,
  };
}

export function serializeVariant(variant: ProductVariant): ProductVariantDTO {
  return {
    id: variant.id,
    sku: variant.sku,
    size: variant.size ?? null,
    color: variant.color ?? null,
    stockQuantity: variant.stockQuantity,
  };
}

export function serializeCategory(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId ?? null,
  };
}

function pickMainImage(images: ProductImage[]): ProductImageDTO | null {
  if (!images.length) return null;
  const main = images.find((image) => image.isMain) ?? [...images].sort((a, b) => a.position - b.position)[0];
  return serializeImage(main);
}

export function serializeProductListItem(product: ProductWithRelations): ProductListItemDTO {
  const variants = product.variants ?? [];
  const colors = new Set(variants.map((variant) => variant.color).filter(Boolean) as string[]);
  const sizes = new Set(variants.map((variant) => variant.size).filter(Boolean) as string[]);

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    basePrice: toNumber(product.basePrice),
    isActive: product.isActive,
    categoryId: product.categoryId ?? null,
    categoryName: product.category?.name ?? null,
    createdAt: product.createdAt.toISOString(),
    mainImage: pickMainImage(product.images ?? []),
    totalStock: variants.reduce((sum, variant) => sum + variant.stockQuantity, 0),
    variantCount: product._count?.variants ?? variants.length,
    colorCount: colors.size,
    sizeCount: sizes.size,
  };
}

export function serializeProduct(product: ProductWithRelations): ProductDetailDTO {
  return {
    ...serializeProductListItem(product),
    description: product.description ?? null,
    images: [...(product.images ?? [])]
      .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.position - b.position)
      .map(serializeImage),
    variants: [...(product.variants ?? [])]
      .sort((a, b) => a.sku.localeCompare(b.sku))
      .map(serializeVariant),
    category: product.category ? serializeCategory(product.category) : null,
  };
}

/** Shared Prisma include so list + detail views stay consistent. */
export const productListInclude = {
  images: { orderBy: [{ isMain: "desc" }, { position: "asc" }] },
  variants: true,
  category: true,
} satisfies Prisma.ProductInclude;
