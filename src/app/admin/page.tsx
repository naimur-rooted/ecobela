import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Alert, Badge } from "@/components/ui/feedback";
import { EmptyState } from "@/components/ui/empty-state";
import { getAdminDashboardStats } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const { status, data } = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Catalogue health at a glance.</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/admin/products/new" size="sm">
            + Add product
          </ButtonLink>
          <ButtonLink href="/admin/categories" variant="outline" size="sm">
            Manage categories
          </ButtonLink>
        </div>
      </header>

      {status === "unavailable" ? (
        <Alert tone="danger" title="Database unreachable">
          Could not read the catalogue. Make sure PostgreSQL is running (<code>npm run dev:db</code>) and the
          <code> DATABASE_URL</code> in <code>.env</code> is correct.
        </Alert>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={data.productCount} hint={`${data.activeProductCount} published`} />
        <StatCard label="Categories" value={data.categoryCount} hint="Multi-level tree" />
        <StatCard label="Variants" value={data.variantCount} hint={`${data.inventoryUnits} units in stock`} />
        <StatCard label="Customers" value={data.customerCount} hint="Registered shoppers" />
      </section>

      {data.outOfStockVariants > 0 ? (
        <Alert tone="warning" title={`${data.outOfStockVariants} variant(s) are out of stock`}>
          Update stock counts from the product edit screen to keep the storefront accurate.
        </Alert>
      ) : null}

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Recently added</h2>
          <Link href="/admin/products" className="text-sm text-brand-700 hover:underline">
            View all
          </Link>
        </div>

        {data.recentProducts.length === 0 ? (
          <EmptyState
            className="mt-5"
            icon="📦"
            title="Your catalogue is empty"
            description="The storefront is ready and waiting. Add your first product with images, sizes, colours and stock."
            action={{ href: "/admin/products/new", label: "Add your first product" }}
          />
        ) : (
          <ul className="mt-5 divide-y divide-ink-100">
            {data.recentProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-4 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  {product.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.mainImage.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${product.id}/edit`} className="truncate font-medium text-ink-900 hover:text-brand-700">
                    {product.title}
                  </Link>
                  <p className="text-xs text-ink-500">
                    {product.categoryName ?? "Uncategorised"} · {product.variantCount} variant(s) · {product.totalStock} in stock
                  </p>
                </div>
                <span className="text-sm font-medium text-ink-800">{formatPrice(product.basePrice)}</span>
                <Badge tone={product.isActive ? "success" : "neutral"}>{product.isActive ? "Live" : "Draft"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}
