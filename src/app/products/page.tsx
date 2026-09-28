import { ProductListing } from "@/components/storefront/product-listing";
import { Input } from "@/components/ui/field";
import { getProducts } from "@/lib/catalog";

export const metadata = { title: "All products" };

type SearchParams = Promise<{ q?: string; sort?: string; page?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, sort = "newest", page } = await searchParams;

  const result = await getProducts({
    q,
    sort: sort as "newest" | "price-asc" | "price-desc" | "title-asc",
    page: Number(page) || 1,
    pageSize: 12,
  });

  return (
    <ProductListing
      result={result}
      basePath="/products"
      title="All products"
      description="Everything available from our workshops and artisan partners."
      searchTerm={q}
      sort={sort}
      emptyTitle={q ? "No products matched your search" : "Store updating"}
      emptyDescription={
        q
          ? "We could not find anything for that search. Try a different keyword or browse the full catalogue."
          : "Our catalogue is being prepared. New pieces will appear here as soon as they are published."
      }
    >
      <form action="/products" className="mt-6 flex flex-wrap gap-2">
        <Input name="q" defaultValue={q ?? ""} placeholder="Search products…" className="max-w-sm" aria-label="Search products" />
        {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
      </form>
    </ProductListing>
  );
}
