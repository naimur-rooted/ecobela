import { requireAdmin } from "@/lib/auth";
import { createUploadSignature, getStorageProvider, isCloudinaryConfigured } from "@/lib/cloudinary";
import { handleRouteError, jsonError, jsonOk } from "@/lib/http";

/**
 * GET /api/admin/uploads/sign
 *
 * Returns a short-lived Cloudinary signature so the browser can upload the file
 * directly to Cloudinary (the API secret never leaves the server).
 * When Cloudinary is not configured we advertise the local disk uploader
 * instead, which keeps local development fully functional.
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return jsonError(guard.message, guard.status);

    const provider = getStorageProvider();

    if (provider === "local" || !isCloudinaryConfigured()) {
      return jsonOk({
        provider: "local",
        maxBytes: 8 * 1024 * 1024,
        localUploadUrl: "/api/admin/uploads/local",
      });
    }

    const signature = createUploadSignature();
    return jsonOk({ provider: "cloudinary", maxBytes: 10 * 1024 * 1024, ...signature });
  } catch (error) {
    return handleRouteError(error, "admin/uploads:sign");
  }
}
