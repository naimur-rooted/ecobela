import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Local-disk upload fallback used when Cloudinary credentials are not set.
 * Files are written to /public/uploads so they are served by Next.js directly.
 */
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export type LocalUploadResult = { url: string; publicId: null; width: null; height: null };

export async function saveFileLocally(file: File): Promise<LocalUploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type "${file.type || "unknown"}". Use JPG, PNG, WEBP, AVIF or GIF.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is larger than 8 MB. Please compress the image and try again.");
  }

  const extension = EXTENSION_BY_TYPE[file.type] ?? "jpg";
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

  return { url: `/uploads/${fileName}`, publicId: null, width: null, height: null };
}
