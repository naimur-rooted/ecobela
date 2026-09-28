import { requireAdmin } from "@/lib/auth";
import { buildUniqueSlug } from "@/lib/catalog";
import { handleRouteError, jsonError, jsonOk, zodResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/serializers";
import { categorySchema } from "@/lib/validators";

/** GET /api/admin/categories — flat list for the product form dropdown. */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true, children: true } } },
    });

    return jsonOk({
      categories: categories.map((category) => ({
        ...serializeCategory(category),
        productCount: category._count.products,
        childCount: category._count.children,
      })),
    });
  } catch (error) {
    return handleRouteError(error, "admin/categories:GET");
  }
}

/** POST /api/admin/categories */
export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const body = await request.json().catch(() => null);
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return zodResponse(parsed.error);

    const { name, parentId } = parsed.data;

    if (parentId) {
      const parent = await prisma.category.findUnique({ where: { id: parentId }, select: { id: true } });
      if (!parent) return jsonError("The selected parent category does not exist.", 422);
    }

    const slug = await buildUniqueSlug(parsed.data.slug || name, "category");

    const category = await prisma.category.create({
      data: { name, slug, parentId: parentId ?? null },
    });

    return jsonOk({ category: serializeCategory(category) }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "admin/categories:POST");
  }
}
