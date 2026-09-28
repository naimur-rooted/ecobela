import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductGrid } from "@/components/storefront/product-card";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { Badge } from "@/components/ui/feedback";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  return { title: result.data?.title ?? "Product" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  const product = result.data;

  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);

  return (
    <div className="container-page py-10">
      <nav className="text-xs text-ink-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        {product.category ? (
          <>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:underline">
              {product.category.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-ink-700">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          {product.category ? <p className="text-xs uppercase tracking-wide text-ink-400">{product.category.name}</p> : null}
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-ink-900">{formatPrice(product.basePrice)}</span>
            {product.totalStock === 0 ? (
              <Badge tone="danger">Out of stock</Badge>
            ) : product.totalStock <= 5 ? (
              <Badge tone="warning">Low stock</Badge>
            ) : (
              <Badge tone="success">In stock</Badge>
            )}
          </div>

          {product.description ? (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-600">{product.description}</p>
          ) : (
            <p className="mt-5 text-sm text-ink-500">No description has been added for this product yet.</p>
          )}

          <div className="mt-8 border-t border-ink-100 pt-6">
            <VariantSelector product={product} />
          </div>

          <dl className="mt-8 space-y-2 border-t border-ink-100 pt-6 text-sm text-ink-600">
            <div className="flex gap-2">
              <dt className="w-28 text-ink-500">Variants</dt>
              <dd>{product.variantCount}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-ink-500">Sizes</dt>
              <dd>{product.sizeCount || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-ink-500">Colors</dt>
              <dd>{product.colorCount || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-ink-500">Product code</dt>
              <dd className="font-mono text-xs">{product.slug}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length ? (
        <section className="mt-16 border-t border-ink-100 pt-10">
          <h2 className="font-display text-2xl font-semibold text-ink-900">You may also like</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
