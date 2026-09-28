import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { Badge } from "@/components/ui/feedback";
import { getFlatCategories } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { productListInclude, serializeProduct } from "@/lib/serializers";
export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [categories, record] = await Promise.all([
    getFlatCategories(),
    prisma.product.findUnique({ where: { id }, include: productListInclude }).catch(() => null),
  ]);

  if (!record) notFound();
  const product = serializeProduct(record);

  return (
    <div className="space-y-6">
      <header>
        <nav className="text-xs text-ink-500">
          <Link href="/admin/products" className="hover:underline">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>Edit</span>
        </nav>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-ink-900">{product.title}</h1>
          <Badge tone={product.isActive ? "success" : "neutral"}>{product.isActive ? "Published" : "Draft"}</Badge>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          {product.variantCount} variant(s) · {product.totalStock} units in stock ·{" "}
          <Link href={`/products/${product.slug}`} className="link-muted">
            view on storefront
          </Link>
        </p>
      </header>

      <ProductForm categories={categories.data} product={product} />
    </div>
  );
}
