import { getProducts } from "@/lib/catalog";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, jsonOk, zodResponse } from "@/lib/http";
import { createProduct, describePrismaError, ProductServiceError } from "@/lib/product-service";
import { serializeProduct } from "@/lib/serializers";
import { productSchema } from "@/lib/validators";

/** GET /api/admin/products — full catalogue including inactive products. */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const { searchParams } = new URL(request.url);
    const result = await getProducts({
      q: searchParams.get("q") ?? undefined,
      includeInactive: true,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 20,
    });

    return jsonOk(result.data);
  } catch (error) {
    return handleRouteError(error, "admin/products:GET");
  }
}

/**
 * POST /api/admin/products
 * Body: validated ProductInput (product + variants[] + images[]).
 * Writes everything in a single database transaction.
 */
export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const body = await request.json().catch(() => null);
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return zodResponse(parsed.error);

    const product = await createProduct(parsed.data);

    return jsonOk({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    const described = error instanceof ProductServiceError ? error : describePrismaError(error);
    if (described) return jsonError(described.message, described.status);
    return handleRouteError(error, "admin/products:POST");
  }
}
