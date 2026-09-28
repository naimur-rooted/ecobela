"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/storefront/product-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, itemCount, isReady, updateQuantity, removeItem, clearCart } = useCart();

  if (!isReady) {
    return (
      <div className="container-page py-16">
        <p className="text-sm text-ink-500">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Shopping cart</h1>
        <EmptyState
          className="mt-8"
          icon="🛒"
          title="Your cart is empty"
          description="Browse the collection and add something you love — it will stay here until you are ready."
          action={{ href: "/products", label: "Start shopping" }}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Shopping cart</h1>
        <button type="button" onClick={clearCart} className="text-sm text-ink-500 underline hover:text-red-600">
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-ink-100 border-y border-ink-100">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-5">
              <Link href={`/products/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-clay-100">
                <ProductImage src={item.imageUrl} alt={item.title} sizes="96px" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-medium text-ink-900 hover:text-brand-700">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-500">
                    {[item.size, item.color].filter(Boolean).join(" · ") || "Standard"}
                    <span className="ml-2 font-mono">{item.sku}</span>
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-lg border border-ink-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="h-9 w-9 text-ink-600 hover:bg-ink-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="h-9 w-9 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-sm text-ink-500 underline hover:text-red-600"
                  >
                    Remove
                  </button>

                  <span className="ml-auto text-sm font-semibold text-ink-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-ink-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold text-ink-900">Order summary</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Items</dt>
              <dd className="font-medium text-ink-900">{itemCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Subtotal</dt>
              <dd className="font-medium text-ink-900">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
              <dt className="font-semibold text-ink-900">Total</dt>
              <dd className="font-semibold text-ink-900">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          <Alert tone="neutral" className="mt-5">
            Online checkout (payments &amp; order tracking) is part of the next phase. Save your cart and we will pick
            up right where you left off.
          </Alert>

          <div className="mt-5 space-y-3">
            <Button type="button" fullWidth disabled>
              Checkout — coming soon
            </Button>
            <ButtonLink href="/products" variant="outline" fullWidth>
              Continue shopping
            </ButtonLink>
          </div>
        </aside>
      </div>
    </div>
  );
}
