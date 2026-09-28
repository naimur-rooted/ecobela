import { requireAdmin } from "@/lib/auth";
import { buildUniqueSlug, getCategoryIdsInSubtree } from "@/lib/catalog";
import { handleRouteError, jsonError, jsonOk, zodResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/serializers";
import { categorySchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

/** PATCH /api/admin/categories/:id — rename or re-parent a category. */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return zodResponse(parsed.error);

    const { name, parentId } = parsed.data;

    if (parentId) {
      if (parentId === id) return jsonError("A category cannot be its own parent.", 422);
      // Prevent cycles: the new parent must not be a descendant of this node.
      const subtree = await getCategoryIdsInSubtree(id);
      if (subtree.includes(parentId)) return jsonError("A category cannot be moved inside one of its own sub-categories.", 422);
    }

    const slug = await buildUniqueSlug(parsed.data.slug || name, "category", id);

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parentId: parentId ?? null },
    });

    return jsonOk({ category: serializeCategory(category) });
  } catch (error) {
    return handleRouteError(error, "admin/categories/[id]:PATCH");
  }
}

/**
 * DELETE /api/admin/categories/:id
 * Refuses to delete a category that still holds products or sub-categories, so
 * the catalogue can never be silently orphaned.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!category) return jsonError("Category not found.", 404);

    if (category._count.products > 0) {
      return jsonError(
        `This category still has ${category._count.products} product(s). Move or delete them first.`,
        409,
      );
    }
    if (category._count.children > 0) {
      return jsonError(
        `This category has ${category._count.children} sub-category(ies). Delete or re-parent them first.`,
        409,
      );
    }

    await prisma.category.delete({ where: { id } });
    return jsonOk({ deleted: { id } });
  } catch (error) {
    return handleRouteError(error, "admin/categories/[id]:DELETE");
  }
}
