import Link from "next/link";
import type { CategoryWithChildrenDTO } from "@/lib/serializers";

export function Navbar({ categories }: { categories: CategoryWithChildrenDTO[] }) {
  return (
    <nav
      aria-label="Main navigation"
      className="relative z-30 hidden border-b border-ink-100 bg-white shadow-sm lg:block"
    >
      <div className="container-page">
        <ul className="flex min-h-12 flex-wrap items-center gap-x-0.5 py-0 lg:flex-nowrap">
          {/* All Products link */}
          <li>
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-700 transition-colors hover:text-maroon-800 focus-visible:text-maroon-800"
            >
              All Products
            </Link>
          </li>

          {categories.map((category) => {
            const hasChildren = category.children.length > 0;

            return (
              <li key={category.id} className="static group">
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex min-h-12 items-center gap-1 px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-700 transition-colors hover:text-maroon-800 group-hover:text-maroon-800 group-focus-within:text-maroon-800"
                >
                  {category.name}
                  {hasChildren && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.19l3.71-3.96a.75.75 0 1 1 1.12 1l-4.27 4.54a.75.75 0 0 1-1.12 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>

                {/* Mega-menu dropdown */}
                {hasChildren && (
                  <div
                    id={`category-menu-${category.id}`}
                    aria-label={`${category.name} subcategories`}
                    className="invisible absolute inset-x-0 top-full z-50 translate-y-2 border-b border-ink-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  >
                    {/* Accent line at top */}
                    <div className="h-0.5 bg-gradient-to-r from-maroon-800 via-brand-500 to-maroon-800" />
                    <div className="container-page grid grid-cols-2 gap-x-8 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {category.children.map((child) => (
                        <div key={child.id} className="min-w-0">
                          <Link
                            href={`/category/${child.slug}`}
                            className="block text-[11px] font-bold uppercase tracking-widest text-maroon-800 transition-colors hover:text-maroon-600"
                          >
                            {child.name}
                          </Link>
                          {child.children.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                              {child.children.map((grandchild) => (
                                <li key={grandchild.id}>
                                  <Link
                                    href={`/category/${grandchild.slug}`}
                                    className="text-sm leading-6 text-ink-500 transition-colors hover:text-maroon-700"
                                  >
                                    {grandchild.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-maroon-800/20 to-transparent" />
    </nav>
  );
}
