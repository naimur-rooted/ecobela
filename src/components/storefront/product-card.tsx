"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { ProductImage } from "@/components/storefront/product-image";
import { Badge } from "@/components/ui/feedback";
import type { ProductListItemDTO } from "@/lib/serializers";
import { formatPrice } from "@/lib/utils";

/**
 * ProductCard — Aarong-inspired design with:
 * - Wishlist hover button
 * - Quick-add to cart button
 * - Image hover cycler
 * - "New" / "Low stock" badges
 */
export function ProductCard({
  product,
  priority,
  images,
}: {
  product: ProductListItemDTO;
  priority?: boolean;
  images?: string[];
}) {
  const isSoldOut = product.totalStock === 0;
  const isLowStock = !isSoldOut && product.variantCount > 0 && product.totalStock <= 5;

  return (
    <article className="group animate-fade-up">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image area */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-clay-100">
          {images && images.length > 0 ? (
            <HoverImageCarousel images={images} priority={priority} />
          ) : (
            <ProductImage
              src={product.mainImage?.imageUrl}
              alt={product.title}
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {isSoldOut && (
              <span className="rounded-full bg-ink-800/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Sold Out
              </span>
            )}
            {isLowStock && (
              <span className="rounded-full bg-brand-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Only {product.totalStock} left
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-400 opacity-0 shadow-sm transition-all duration-200 hover:text-maroon-800 group-hover:opacity-100 backdrop-blur-sm"
          >
            <HeartIcon className="h-4 w-4" />
          </button>

          {/* Quick-add overlay */}
          {!isSoldOut && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="w-full bg-maroon-800/95 py-3 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-maroon-900"
              >
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1 px-0.5">
          {product.categoryName && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {product.categoryName}
            </p>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink-900 group-hover:text-maroon-800 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-bold text-ink-900">
              {formatPrice(product.basePrice)}
            </span>
            {product.sizeCount > 1 && (
              <span className="text-[11px] text-ink-400">{product.sizeCount} sizes</span>
            )}
            {product.colorCount > 1 && (
              <span className="text-[11px] text-ink-400">{product.colorCount} colours</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductListItemDTO[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}

function HoverImageCarousel({
  images,
  priority,
}: {
  images: string[];
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || images.length < 2) return;
    const interval = setInterval(() => {
      setIndex((curr) => (curr + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [images, isHovering]);

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIndex(0);
      }}
    >
      {images.map((src, imgIdx) => (
        <div
          key={`${src}-${imgIdx}`}
          className="absolute inset-0 h-full w-full transition-opacity duration-500 ease-linear"
          style={{ opacity: imgIdx === index ? 1 : 0 }}
          aria-hidden={imgIdx !== index}
        >
          <ProductImage
            src={src}
            alt={imgIdx === 0 ? "Primary product image" : `Product view ${imgIdx + 1}`}
            priority={priority && imgIdx === 0}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="h-full w-full"
          />
        </div>
      ))}
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
