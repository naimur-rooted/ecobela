import { getCategoryTree } from "@/lib/catalog";
import { handleRouteError, jsonOk } from "@/lib/http";

/** Public category tree used by the storefront navigation. */
export async function GET() {
  try {
    const result = await getCategoryTree();
    return jsonOk({ categories: result.data, available: result.status !== "unavailable" });
  } catch (error) {
    return handleRouteError(error, "categories");
  }
}
