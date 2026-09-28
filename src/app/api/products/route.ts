import { getProducts } from "@/lib/catalog";
import { handleRouteError, jsonOk } from "@/lib/http";

/** Public, paginated product feed: /api/products?q=&category=&sort=&page=&pageSize= */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await getProducts({
      q: searchParams.get("q") ?? undefined,
      categorySlug: searchParams.get("category") ?? undefined,
      sort: (searchParams.get("sort") as "newest" | "price-asc" | "price-desc" | "title-asc" | null) ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    });

    return jsonOk({ ...result.data, available: result.status !== "unavailable" });
  } catch (error) {
    return handleRouteError(error, "products");
  }
}
