"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge, Alert } from "@/components/ui/feedback";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type ImageItem = {
  id?: string;
  imageUrl: string;
  publicId: string | null;
  isMain: boolean;
  position: number;
};

type SignResponse = {
  provider: "cloudinary" | "local";
  maxBytes: number;
  uploadUrl?: string;
  apiKey?: string;
  timestamp?: number;
  folder?: string;
  signature?: string;
  localUploadUrl?: string;
};

type PendingUpload = { name: string; progress: number };

const MAX_IMAGES = 12;
const ACCEPTED = "image/png,image/jpeg,image/webp,image/avif,image/gif";

/** XHR upload so we can show real per-file progress. */
function uploadWithProgress(url: string, formData: FormData, onProgress: (percent: number) => void): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      let body: unknown = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = null;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body);
        return;
      }
      const withMessage = body as { message?: string; error?: { message?: string } } | null;
      reject(new Error(withMessage?.message ?? withMessage?.error?.message ?? `Upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error("Network error while uploading. Please try again."));
    xhr.send(formData);
  });
}

export function ImageUploader({
  images,
  onChange,
  errors,
  disabled,
}: {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
}) {
  const [sign, setSign] = useState<SignResponse | null>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Ask the server which storage driver is active and get a signature.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/uploads/sign")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.ok) setSign(data as SignResponse);
      })
      .catch(() => setError("Could not reach the upload service."));
    return () => {
      cancelled = true;
    };
  }, []);

  const commit = useCallback(
    (next: ImageItem[]) => {
      // Keep exactly one main image and sequential positions.
      const mainIndex = next.findIndex((image) => image.isMain);
      onChange(
        next.slice(0, MAX_IMAGES).map((image, index) => ({
          ...image,
          isMain: index === (mainIndex === -1 ? 0 : mainIndex),
          position: index,
        })),
      );
    },
    [onChange],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!sign) {
        setError("Upload service is still initialising — please try again in a moment.");
        return;
      }
      setError(null);

      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) {
        setError(`You can upload up to ${MAX_IMAGES} images per product.`);
        return;
      }

      const queue = files.slice(0, remaining);
      const uploaded: ImageItem[] = [];

      for (const file of queue) {
        if (file.size > sign.maxBytes) {
          setError(`"${file.name}" is larger than ${Math.round(sign.maxBytes / (1024 * 1024))} MB.`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          setError(`"${file.name}" is not an image file.`);
          continue;
        }

        setPending((current) => [...current, { name: file.name, progress: 0 }]);
        const reportProgress = (progress: number) =>
          setPending((current) => current.map((item) => (item.name === file.name ? { ...item, progress } : item)));

        try {
          const formData = new FormData();
          formData.append("file", file);

          if (sign.provider === "cloudinary" && sign.uploadUrl && sign.apiKey) {
            formData.append("api_key", sign.apiKey);
            formData.append("timestamp", String(sign.timestamp));
            formData.append("folder", sign.folder ?? "");
            formData.append("signature", sign.signature ?? "");

            const response = (await uploadWithProgress(sign.uploadUrl, formData, reportProgress)) as {
              secure_url?: string;
              public_id?: string;
            } | null;

            if (!response?.secure_url) throw new Error("Cloudinary did not return a secure URL.");
            uploaded.push({ imageUrl: response.secure_url, publicId: response.public_id ?? null, isMain: false, position: 0 });
          } else {
            const response = (await uploadWithProgress(
              sign.localUploadUrl ?? "/api/admin/uploads/local",
              formData,
              reportProgress,
            )) as { asset?: { url: string; publicId: string | null } } | null;

            if (!response?.asset?.url) throw new Error("The local uploader did not return a URL.");
            uploaded.push({ imageUrl: response.asset.url, publicId: response.asset.publicId, isMain: false, position: 0 });
          }
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
        } finally {
          setPending((current) => current.filter((item) => item.name !== file.name));
        }
      }

      if (uploaded.length) commit([...images, ...uploaded]);
    },
    [sign, images, commit],
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length) void uploadFiles(files);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length) void uploadFiles(files);
  }

  function setMain(index: number) {
    commit(images.map((image, position) => ({ ...image, isMain: position === index })));
  }

  function removeAt(index: number) {
    commit(images.filter((_, position) => position !== index));
  }

  function moveBy(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  function addFromUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    commit([...images, { imageUrl: url, publicId: null, isMain: false, position: images.length }]);
    setUrlDraft("");
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
          isDragging ? "border-brand-500 bg-brand-50" : "border-ink-200 bg-ink-50/40",
          disabled && "opacity-60",
        )}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-card">
          🖼️
        </div>
        <p className="text-sm font-medium text-ink-800">Drag &amp; drop product photos here</p>
        <p className="mt-1 text-xs text-ink-500">
          JPG, PNG, WEBP, AVIF or GIF · up to {MAX_IMAGES} images · max{" "}
          {sign ? Math.round(sign.maxBytes / (1024 * 1024)) : 8} MB each
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button type="button" size="sm" onClick={() => inputRef.current?.click()} disabled={disabled || !sign}>
            Choose files
          </Button>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED} multiple hidden onChange={handleInputChange} />
        <p className="mt-3">
          {sign?.provider === "cloudinary" ? (
            <Badge tone="success">Cloudinary direct upload</Badge>
          ) : sign ? (
            <Badge tone="warning">Local storage (dev) — add Cloudinary keys for production</Badge>
          ) : (
            <span className="text-xs text-ink-400">Preparing uploader…</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={urlDraft}
          onChange={(event) => setUrlDraft(event.target.value)}
          placeholder="…or paste an image URL and press Add"
          aria-label="Image URL"
          className="field"
        />
        <Button type="button" variant="outline" onClick={addFromUrl} disabled={disabled || !urlDraft.trim()}>
          Add URL
        </Button>
      </div>

      {error ? <Alert tone="danger">{error}</Alert> : null}
      <FieldError messages={errors?.images} />

      {pending.length ? (
        <ul className="space-y-2">
          {pending.map((item) => (
            <li key={item.name} className="rounded-lg border border-ink-100 bg-white px-3 py-2">
              <div className="flex items-center justify-between text-xs text-ink-600">
                <span className="truncate">{item.name}</span>
                <span>{item.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${item.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {images.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li key={`${image.imageUrl}-${index}`} className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.imageUrl} alt={`Product image ${index + 1}`} className="h-32 w-full object-cover" />
              {image.isMain ? (
                <span className="absolute left-2 top-2">
                  <Badge tone="brand">Main</Badge>
                </span>
              ) : null}
              <div className="flex items-center justify-between gap-1 border-t border-ink-100 p-2">
                <div className="flex gap-1">
                  <IconButton label="Move left" onClick={() => moveBy(index, -1)} disabled={index === 0}>
                    ←
                  </IconButton>
                  <IconButton label="Move right" onClick={() => moveBy(index, 1)} disabled={index === images.length - 1}>
                    →
                  </IconButton>
                </div>
                <div className="flex gap-1">
                  {!image.isMain ? (
                    <IconButton label="Set as main image" onClick={() => setMain(index)}>
                      ★
                    </IconButton>
                  ) : null}
                  <IconButton label="Remove image" onClick={() => removeAt(index)} tone="danger">
                    ✕
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  tone = "neutral",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "neutral" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border text-xs transition disabled:opacity-40",
        tone === "danger"
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-ink-200 text-ink-600 hover:border-brand-500 hover:text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

