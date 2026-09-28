import Link from "next/link";

import { ProductGrid } from "@/components/storefront/product-card";
import { SortSelect } from "@/components/storefront/sort-select";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/feedback";
import type { DataResult } from "@/lib/catalog";
import type { ProductListItemDTO } from "@/lib/serializers";

type PageData = { items: ProductListItemDTO[]; total: number; page: number; pageSize: number; totalPages: number };

export function ProductListing({
  result,
  basePath,
  title,
  description,
  searchTerm,
  sort,
  emptyTitle,
  emptyDescription,
  children,
}: {
  result: DataResult<PageData>;
  basePath: string;
  title: string;
  description?: string;
  searchTerm?: string;
  sort: string;
  emptyTitle: string;
  emptyDescription: string;
  children?: React.ReactNode;
}) {
  const { items, total, page, totalPages } = result.data;

  function pageHref(pageNumber: number) {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <div className="container-page py-10">
      {/* Page header */}
      <header className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-700">
          {searchTerm ? "Search Results" : "Browse"}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-500">{description}</p>}
        {searchTerm && (
          <p className="mt-2 text-sm text-ink-500">
            Showing results for "
            <span className="font-semibold text-ink-800">{searchTerm}</span>"
          </p>
        )}
      </header>

      {children}

      {result.status === "unavailable" && (
        <Alert tone="danger" title="Store temporarily unavailable" className="mt-6">
          We could not reach the catalogue database. Please try again in a moment.
        </Alert>
      )}

      {items.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-800">{total}</span> product{total === 1 ? "" : "s"}
            {totalPages > 1 && (
              <span className="text-ink-400"> · page {page} of {totalPages}</span>
            )}
          </p>
          <SortSelect value={sort} />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🌱"
          title={emptyTitle}
          description={emptyDescription}
          action={
            searchTerm
              ? { href: basePath, label: "Browse everything" }
              : { href: "/", label: "Back to home" }
          }
        />
      ) : (
        <div className="mt-8">
          <ProductGrid products={items} />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && items.length > 0 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full border-2 border-maroon-800 px-5 py-2 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-800 hover:text-white"
            >
              ← Previous
            </Link>
          )}
          <span className="px-4 text-sm text-ink-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full border-2 border-maroon-800 px-5 py-2 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-800 hover:text-white"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
