import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleRouteError, jsonError, jsonOk, zodResponse } from "@/lib/http";
import { deleteProduct, describePrismaError, ProductServiceError, setProductActive, updateProduct } from "@/lib/product-service";
import { productListInclude, serializeProduct } from "@/lib/serializers";
import { productSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/admin/products/:id */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, include: productListInclude });
    if (!product) return jsonError("Product not found.", 404);

    return jsonOk({ product: serializeProduct(product) });
  } catch (error) {
    return handleRouteError(error, "admin/products/[id]:GET");
  }
}

/** PATCH /api/admin/products/:id — full update, or { isActive } for a quick toggle. */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { id } = await params;
    const body = await request.json().catch(() => null);

    // Quick visibility toggle from the products table.
    if (body && typeof body === "object" && Object.keys(body).length === 1 && typeof body.isActive === "boolean") {
      const updated = await setProductActive(id, body.isActive);
      return jsonOk({ productId: updated.id, isActive: updated.isActive });
    }

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return zodResponse(parsed.error);

    const product = await updateProduct(id, parsed.data);
    return jsonOk({ product: serializeProduct(product) });
  } catch (error) {
    const described = error instanceof ProductServiceError ? error : describePrismaError(error);
    if (described) return jsonError(described.message, described.status);
    return handleRouteError(error, "admin/products/[id]:PATCH");
  }
}

/** DELETE /api/admin/products/:id — cascades to variants + images. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { id } = await params;
    const result = await deleteProduct(id);
    return jsonOk({ deleted: result });
  } catch (error) {
    const described = error instanceof ProductServiceError ? error : describePrismaError(error);
    if (described) return jsonError(described.message, described.status);
    return handleRouteError(error, "admin/products/[id]:DELETE");
  }
}
