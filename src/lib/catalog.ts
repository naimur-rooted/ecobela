import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  productListInclude,
  serializeCategory,
  serializeProduct,
  serializeProductListItem,
  type CategoryDTO,
  type CategoryWithChildrenDTO,
  type ProductDetailDTO,
  type ProductListItemDTO,
} from "@/lib/serializers";
import { buildPagination, slugify } from "@/lib/utils";

/**
 * Every catalogue read goes through this module.
 *
 * IMPORTANT: the catalogue is intentionally empty until the admin adds
 * products, so each helper returns a discriminated result that lets the UI
 * render an elegant empty state instead of crashing — and it also survives the
 * database being briefly unreachable (e.g. Postgres not started yet).
 */
export type DataResult<T> =
  | { status: "ok"; data: T }
  | { status: "empty"; data: T }
  | { status: "unavailable"; data: T; error: string };

export type ProductQuery = {
  q?: string;
  categorySlug?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "title-asc";
  page?: number;
  pageSize?: number;
  includeInactive?: boolean;
};

type ProductPage = {
  items: ProductListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function unavailable<T>(data: T, error: unknown): DataResult<T> {
  const message = error instanceof Error ? error.message : "Unknown database error";
  console.error("[catalog] database unavailable:", message);
  return { status: "unavailable", data, error: message };
}

/** Collects a category id together with every descendant id (multi-level tree). */
export async function getCategoryIdsInSubtree(rootId: string): Promise<string[]> {
  const categories = await prisma.category.findMany({ select: { id: true, parentId: true } });
  const childrenByParent = new Map<string, string[]>();
  for (const category of categories) {
    if (!category.parentId) continue;
    childrenByParent.set(category.parentId, [...(childrenByParent.get(category.parentId) ?? []), category.id]);
  }

  const collected: string[] = [];
  const queue = [rootId];
  while (queue.length) {
    const current = queue.shift() as string;
    collected.push(current);
    queue.push(...(childrenByParent.get(current) ?? []));
  }
  return collected;
}

export async function getProducts(query: ProductQuery = {}): Promise<DataResult<ProductPage>> {
  const page = Math.max(query.page ?? 1, 1);
  const pageSize = Math.min(Math.max(query.pageSize ?? 12, 1), 48);
  const empty: ProductPage = { items: [], total: 0, page, pageSize, totalPages: 1 };

  try {
    const where: Prisma.ProductWhereInput = {};

    if (!query.includeInactive) where.isActive = true;

    if (query.q?.trim()) {
      const term = query.q.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { variants: { some: { sku: { contains: term, mode: "insensitive" } } } },
        { category: { name: { contains: term, mode: "insensitive" } } },
      ];
    }

    if (query.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: query.categorySlug } });
      if (!category) return { status: "empty", data: empty };
      where.categoryId = { in: await getCategoryIdsInSubtree(category.id) };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === "price-asc"
        ? { basePrice: "asc" }
        : query.sort === "price-desc"
          ? { basePrice: "desc" }
          : query.sort === "title-asc"
            ? { title: "asc" }
            : { createdAt: "desc" };

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, include: productListInclude }),
    ]);

    const pagination = buildPagination(page, pageSize, total);
    const payload: ProductPage = {
      items: products.map(serializeProductListItem),
      total,
      page: pagination.page,
      pageSize,
      totalPages: pagination.totalPages,
    };

    return { status: total === 0 ? "empty" : "ok", data: payload };
  } catch (error) {
    return unavailable(empty, error);
  }
}

export async function getProductBySlug(slug: string): Promise<DataResult<ProductDetailDTO | null>> {
  try {
    const product = await prisma.product.findUnique({ where: { slug }, include: productListInclude });
    if (!product) return { status: "empty", data: null };
    return { status: "ok", data: serializeProduct(product) };
  } catch (error) {
    return unavailable<ProductDetailDTO | null>(null, error);
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4,
): Promise<ProductListItemDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, id: { not: productId }, ...(categoryId ? { categoryId } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: productListInclude,
    });
    return products.map(serializeProductListItem);
  } catch (error) {
    console.error("[catalog] related products failed:", error);
    return [];
  }
}

export async function getCategoryTree(): Promise<DataResult<CategoryWithChildrenDTO[]>> {
  try {
    const [categories, grouped] = await prisma.$transaction([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.product.groupBy({
        by: ["categoryId"],
        where: { isActive: true },
        orderBy: { categoryId: "asc" },
        _count: { _all: true },
      }),
    ]);

    const countByCategory = new Map<string, number>(
      grouped.map((row) => [row.categoryId ?? "", (row._count as { _all?: number } | undefined)?._all ?? 0]),
    );
    const nodes = new Map<string, CategoryWithChildrenDTO>();
    for (const category of categories) {
      nodes.set(category.id, {
        ...serializeCategory(category),
        children: [],
        productCount: countByCategory.get(category.id) ?? 0,
      });
    }

    const roots: CategoryWithChildrenDTO[] = [];
    for (const node of nodes.values()) {
      if (node.parentId && nodes.has(node.parentId)) nodes.get(node.parentId)!.children.push(node);
      else roots.push(node);
    }

    // Bubble descendant counts up so parent categories show a meaningful total.
    const bubble = (node: CategoryWithChildrenDTO): number => {
      const childTotal = node.children.reduce((sum, child) => sum + bubble(child), 0);
      node.productCount = (node.productCount ?? 0) + childTotal;
      return node.productCount ?? 0;
    };
    roots.forEach(bubble);

    return { status: roots.length ? "ok" : "empty", data: roots };
  } catch (error) {
    return unavailable<CategoryWithChildrenDTO[]>([], error);
  }
}

export async function getFlatCategories(): Promise<DataResult<CategoryDTO[]>> {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return { status: categories.length ? "ok" : "empty", data: categories.map(serializeCategory) };
  } catch (error) {
    return unavailable<CategoryDTO[]>([], error);
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    return category ? serializeCategory(category) : null;
  } catch (error) {
    console.error("[catalog] category lookup failed:", error);
    return null;
  }
}

export type AdminDashboardStats = {
  productCount: number;
  activeProductCount: number;
  categoryCount: number;
  variantCount: number;
  outOfStockVariants: number;
  inventoryUnits: number;
  customerCount: number;
  recentProducts: ProductListItemDTO[];
};

export async function getAdminDashboardStats(): Promise<DataResult<AdminDashboardStats>> {
  const empty: AdminDashboardStats = {
    productCount: 0,
    activeProductCount: 0,
    categoryCount: 0,
    variantCount: 0,
    outOfStockVariants: 0,
    inventoryUnits: 0,
    customerCount: 0,
    recentProducts: [],
  };

  try {
    const [
      productCount,
      activeProductCount,
      categoryCount,
      variantAggregate,
      outOfStockVariants,
      customerCount,
      recentProducts,
    ] = await prisma.$transaction([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.productVariant.aggregate({ _count: { _all: true }, _sum: { stockQuantity: true } }),
      prisma.productVariant.count({ where: { stockQuantity: 0 } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: productListInclude }),
    ]);

    const data: AdminDashboardStats = {
      productCount,
      activeProductCount,
      categoryCount,
      variantCount: variantAggregate._count._all,
      outOfStockVariants,
      inventoryUnits: variantAggregate._sum.stockQuantity ?? 0,
      customerCount,
      recentProducts: recentProducts.map(serializeProductListItem),
    };

    return { status: productCount === 0 ? "empty" : "ok", data };
  } catch (error) {
    return unavailable(empty, error);
  }
}

/** Builds a collision-free slug for the admin forms. */
export async function buildUniqueSlug(name: string, table: "category" | "product", ignoreId?: string) {
  const base = slugify(name) || `item-${Date.now()}`;
  let candidate = base;
  let suffix = 1;

  for (;;) {
    const existing =
      table === "category"
        ? await prisma.category.findUnique({ where: { slug: candidate }, select: { id: true } })
        : await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } });

    if (!existing || existing.id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

export async function getVariantSkuExists(sku: string, ignoreVariantId?: string) {
  const variant = await prisma.productVariant.findUnique({ where: { sku }, select: { id: true } });
  if (!variant) return false;
  return variant.id !== ignoreVariantId;
}
