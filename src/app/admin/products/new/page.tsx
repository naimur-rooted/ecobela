import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { Alert } from "@/components/ui/feedback";
import { getFlatCategories } from "@/lib/catalog";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  const categories = await getFlatCategories();

  return (
    <div className="space-y-6">
      <header>
        <nav className="text-xs text-ink-500">
          <Link href="/admin/products" className="hover:underline">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>New</span>
        </nav>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">Add new product</h1>
        <p className="mt-1 text-sm text-ink-500">
          Upload images, generate size/colour variants with SKUs, then publish in one save.
        </p>
      </header>

      {categories.status === "unavailable" ? (
        <Alert tone="danger" title="Database unreachable">
          Start PostgreSQL with <code>npm run dev:db</code> and reload this page.
        </Alert>
      ) : null}

      <ProductForm categories={categories.data} />
    </div>
  );
}
