import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Product imagery comes from Cloudinary (remote) or the local /uploads folder.
 * `next/image` is only used for hosts we can optimise — anything else (e.g. a
 * pasted external URL) falls back to a plain <img> so nothing ever breaks.
 */
const OPTIMISABLE_HOSTS = ["res.cloudinary.com"];

function canOptimise(url: string) {
  if (url.startsWith("/uploads/")) return true;
  try {
    const parsed = new URL(url);
    return OPTIMISABLE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  priority,
  fill = true,
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!src) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-clay-100 text-2xl text-clay-400", className)}>
        <span aria-hidden>🌿</span>
      </div>
    );
  }

  if (canOptimise(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
