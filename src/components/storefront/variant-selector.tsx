"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import type { ProductDetailDTO } from "@/lib/serializers";
import { cn, sortSizes } from "@/lib/utils";

export function VariantSelector({ product }: { product: ProductDetailDTO }) {
  const { addItem } = useCart();

  const sizes = useMemo(
    () => sortSizes(product.variants.map((variant) => variant.size).filter((size): size is string => Boolean(size))),
    [product.variants],
  );
  const colors = useMemo(
    () => [
      ...new Set(product.variants.map((variant) => variant.color).filter((color): color is string => Boolean(color))),
    ],
    [product.variants],
  );

  const [size, setSize] = useState<string | null>(sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<"added" | null>(null);

  const matchedVariant =
    product.variants.find((variant) => (variant.size ?? null) === size && (variant.color ?? null) === color) ??
    product.variants.find((variant) => variant.stockQuantity > 0) ??
    product.variants[0];

  const stock = matchedVariant?.stockQuantity ?? 0;
  const isSoldOut = stock === 0;
  const maxQuantity = Math.max(1, Math.min(stock, 10));

  function isAvailable(nextSize: string | null, nextColor: string | null) {
    return product.variants.some(
      (variant) =>
        (variant.size ?? null) === nextSize && (variant.color ?? null) === nextColor && variant.stockQuantity > 0,
    );
  }

  function handleAddToCart() {
    if (!matchedVariant || isSoldOut) return;
    addItem(
      {
        variantId: matchedVariant.id,
        productId: product.id,
        slug: product.slug,
        title: product.title,
        sku: matchedVariant.sku,
        size: matchedVariant.size,
        color: matchedVariant.color,
        price: product.basePrice,
        imageUrl: product.mainImage?.imageUrl ?? null,
        maxQuantity: stock,
      },
      quantity,
    );
    setFeedback("added");
  }

  return (
    <div className="space-y-5">
      {sizes.length ? (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-800">Size</span>
            {size ? <span className="text-xs text-ink-500">Selected: {size}</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((option) => {
              const available = isAvailable(option, color);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSize(option);
                    setQuantity(1);
                    setFeedback(null);
                  }}
                  className={cn(
                    "h-10 min-w-12 rounded-lg border px-3 text-sm font-medium transition",
                    option === size
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-ink-200 text-ink-800 hover:border-brand-500",
                    !available && "opacity-40",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {colors.length ? (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-800">Color</span>
            {color ? <span className="text-xs text-ink-500">Selected: {color}</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((option) => {
              const available = isAvailable(size, option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setColor(option);
                    setQuantity(1);
                    setFeedback(null);
                  }}
                  className={cn(
                    "h-10 rounded-lg border px-3 text-sm font-medium transition",
                    option === color
                      ? "border-brand-700 bg-brand-50 text-brand-800"
                      : "border-ink-200 text-ink-800 hover:border-brand-500",
                    !available && "opacity-40",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="quantity" className="label">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            disabled={isSoldOut}
            onChange={(event) => setQuantity(Math.min(Math.max(1, Number(event.target.value) || 1), maxQuantity))}
            className="field w-24"
          />
        </div>
        <Button type="button" size="lg" onClick={handleAddToCart} disabled={isSoldOut} className="flex-1 sm:flex-none">
          {isSoldOut ? "Sold out" : "Add to cart"}
        </Button>
      </div>

      <div className="text-xs text-ink-500">
        {matchedVariant ? (
          <>
            SKU <span className="font-mono text-ink-700">{matchedVariant.sku}</span>
            {isSoldOut ? (
              <span className="ml-2 text-red-600">Out of stock</span>
            ) : (
              <span className="ml-2">{stock} in stock</span>
            )}
          </>
        ) : (
          "This product has no variants yet."
        )}
      </div>

      {feedback === "added" ? (
        <Alert tone="success">
          Added to your cart.{" "}
          <Link href="/cart" className="font-medium underline">
            View cart
          </Link>
        </Alert>
      ) : null}
    </div>
  );
}
