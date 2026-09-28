import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";
import { saveFileLocally } from "@/lib/uploads";

/**
 * POST /api/admin/uploads/local
 * multipart/form-data with a single `file` field.
 * Used only when Cloudinary credentials are absent (local development).
 */
export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");

    if (!(file instanceof File)) return jsonError("No file was received.", 400);

    const saved = await saveFileLocally(file);
    return jsonOk({ asset: saved }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /Unsupported file type|larger than/.test(error.message)) {
      return jsonError(error.message, 422);
    }
    return handleRouteError(error, "admin/uploads:local");
  }
}
