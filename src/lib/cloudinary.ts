import { v2 as cloudinary } from "cloudinary";

/**
 * Storage layer supports two providers:
 *
 *  1. `cloudinary` — used automatically when CLOUDINARY_* env vars are present.
 *     The browser uploads the file straight to Cloudinary using a short-lived
 *     signature generated on the server (`/api/admin/uploads/sign`), so the
 *     API secret never reaches the client and files never proxy through Next.js.
 *
 *  2. `local` — development fallback. Files go to /public/uploads through
 *     `/api/admin/uploads/local`. Handy before real credentials exist.
 */
export type StorageProvider = "cloudinary" | "local";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

export function getStorageProvider(): StorageProvider {
  return isCloudinaryConfigured() ? "cloudinary" : "local";
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function uploadFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "ecobela/products";
}

/** Short-lived signature for a direct browser → Cloudinary upload. */
export function createUploadSignature() {
  if (!isCloudinaryConfigured()) return null;
  configureCloudinary();

  const timestamp = Math.round(Date.now() / 1000);
  const folder = uploadFolder();

  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET as string);

  return {
    provider: "cloudinary" as const,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    timestamp,
    folder,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
  };
}

/** Used when a product/image is deleted. Silently ignores unknown assets. */
export async function destroyCloudinaryAsset(publicId: string) {
  if (!isCloudinaryConfigured() || !publicId) return;
  configureCloudinary();
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    console.error("[cloudinary] failed to destroy asset", publicId, error);
  }
}
