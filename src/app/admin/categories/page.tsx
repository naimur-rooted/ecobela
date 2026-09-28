import { CategoryManager } from "@/components/admin/category-manager";
import { Alert } from "@/components/ui/feedback";
import { getFlatCategories } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getFlatCategories(),
    prisma.product
      .groupBy({ by: ["categoryId"], orderBy: { categoryId: "asc" }, _count: { _all: true } })
      .catch(() => [] as Array<{ categoryId: string | null; _count: { _all: number } }>),
  ]);

  const countByCategory = new Map(counts.map((row) => [row.categoryId ?? "", row._count._all]));
  const rows = categories.data.map((category) => ({
    ...category,
    productCount: countByCategory.get(category.id) ?? 0,
    childCount: categories.data.filter((entry) => entry.parentId === category.id).length,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Categories</h1>
        <p className="mt-1 text-sm text-ink-500">
          Build the navigation tree your customers browse — parents, sub-categories and leaf collections.
        </p>
      </header>

      {categories.status === "unavailable" ? (
        <Alert tone="danger" title="Database unreachable">
          Start PostgreSQL with <code>npm run dev:db</code> and reload.
        </Alert>
      ) : null}

      <CategoryManager initialCategories={rows} />
    </div>
  );
}
