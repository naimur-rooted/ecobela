"use client";

import { useState } from "react";

import { ProductImage } from "@/components/storefront/product-image";
import type { ProductImageDTO } from "@/lib/serializers";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: ProductImageDTO[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-clay-100">
        <ProductImage src={null} alt={title} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-clay-100">
        <ProductImage src={active.imageUrl} alt={title} priority sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-clay-100 transition",
                  index === activeIndex ? "border-brand-600" : "border-transparent hover:border-ink-200",
                )}
              >
                <ProductImage src={image.imageUrl} alt="" sizes="64px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
