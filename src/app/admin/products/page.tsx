import Link from "next/link";

import { ProductRowActions } from "@/components/admin/product-row-actions";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert, Badge } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Products" };

type SearchParams = Promise<{ q?: string; page?: string; created?: string; deleted?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", page = "1", created, deleted } = await searchParams;

  const result = await getProducts({
    q: q || undefined,
    includeInactive: true,
    page: Number(page) || 1,
    pageSize: 20,
  });

  const { items, total, page: currentPage, totalPages } = result.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-500">
            {total === 0 ? "No products yet" : `${total} product${total === 1 ? "" : "s"} in the catalogue`}
          </p>
        </div>
        <ButtonLink href="/admin/products/new" size="sm">
          + Add product
        </ButtonLink>
      </header>

      {created ? <Alert tone="success">“{created}” was created successfully.</Alert> : null}
      {deleted ? <Alert tone="neutral">The product was deleted.</Alert> : null}
      {result.status === "unavailable" ? (
        <Alert tone="danger" title="Database unreachable">
          Start PostgreSQL with <code>npm run dev:db</code>.
        </Alert>
      ) : null}

      <form className="flex flex-wrap gap-2" action="/admin/products">
        <Input name="q" defaultValue={q} placeholder="Search by title, SKU or category…" className="max-w-sm" />
        <ButtonLink href="/admin/products" variant="outline" size="md">
          Reset
        </ButtonLink>
      </form>

      {items.length === 0 ? (
        <EmptyState
          icon="📦"
          title={q ? "No products match your search" : "No products yet"}
          description={
            q
              ? "Try a different keyword, or clear the search to see the whole catalogue."
              : "Add your first product — upload images, define sizes and colours, and set stock per variant."
          }
          action={{
            href: q ? "/admin/products" : "/admin/products/new",
            label: q ? "Clear search" : "Add your first product",
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Variants</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                        {product.mainImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.mainImage.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="block max-w-[240px] truncate font-medium text-ink-900 hover:text-brand-700"
                        >
                          {product.title}
                        </Link>
                        <span className="font-mono text-xs text-ink-400">/{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{product.categoryName ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatPrice(product.basePrice)}</td>
                  <td className="px-4 py-3 text-ink-600">
                    {product.variantCount}
                    <span className="text-xs text-ink-400">
                      {product.sizeCount ? ` · ${product.sizeCount}S` : ""}
                      {product.colorCount ? ` · ${product.colorCount}C` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.totalStock === 0 ? "font-medium text-red-600" : "text-ink-700"}>
                      {product.totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={product.isActive ? "success" : "neutral"}>{product.isActive ? "Live" : "Draft"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
                      >
                        Edit
                      </Link>
                      <ProductRowActions productId={product.id} title={product.title} isActive={product.isActive} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={`/admin/products?page=${pageNumber}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={
                pageNumber === currentPage
                  ? "rounded-lg bg-brand-700 px-3 py-2 font-medium text-white"
                  : "rounded-lg border border-ink-200 px-3 py-2 text-ink-700 hover:border-brand-500"
              }
            >
              {pageNumber}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
