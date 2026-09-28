import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductListing } from "@/components/storefront/product-listing";
import { getCategoryBySlug, getCategoryTree, getProducts } from "@/lib/catalog";
import type { CategoryWithChildrenDTO } from "@/lib/serializers";

type SearchParams = Promise<{ sort?: string; page?: string }>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { sort = "newest", page } = await searchParams;

  const [{ data: tree }, category] = await Promise.all([getCategoryTree(), getCategoryBySlug(slug)]);
  if (!category) notFound();

  const result = await getProducts({
    categorySlug: slug,
    sort: sort as "newest" | "price-asc" | "price-desc" | "title-asc",
    page: Number(page) || 1,
    pageSize: 12,
  });

  const node = findNode(tree, category.id);
  const subCategories = node?.children ?? [];

  return (
    <ProductListing
      result={result}
      basePath={`/category/${slug}`}
      title={category.name}
      description={`Everything in our ${category.name.toLowerCase()} collection.`}
      sort={sort}
      emptyTitle="This collection is being restocked"
      emptyDescription="Products for this category will appear here as soon as they are published."
    >
      <nav className="mt-4 text-xs text-ink-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </nav>

      {subCategories.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {subCategories.map((child) => (
            <Link
              key={child.id}
              href={`/category/${child.slug}`}
              className="rounded-full border-2 border-maroon-200 px-4 py-1.5 text-sm font-medium text-maroon-800 transition hover:border-maroon-800 hover:bg-maroon-800 hover:text-white"
            >
              {child.name}
              <span className="ml-2 text-xs opacity-60">{child.productCount ?? 0}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </ProductListing>
  );
}

type TreeNode = CategoryWithChildrenDTO;

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}
