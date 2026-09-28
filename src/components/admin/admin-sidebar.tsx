"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/products/new", label: "Add product", exact: true },
  { href: "/admin/categories", label: "Categories", exact: false },
];

export function AdminSidebar({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-ink-100 bg-white lg:min-h-[calc(100vh-var(--header-height))] lg:rounded-2xl lg:border lg:border-ink-100">
      <div className="py-4 lg:px-4 lg:py-6">
        <div className="hidden lg:block">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Admin panel</p>
          <p className="mt-1 px-3 text-sm font-medium text-ink-900">{adminName}</p>
          <p className="px-3 text-xs text-ink-500">{adminEmail}</p>
        </div>

        <nav className="mt-0 flex gap-1 overflow-x-auto no-scrollbar lg:mt-6 lg:flex-col">
          {LINKS.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-brand-700 text-white" : "text-ink-700 hover:bg-ink-50",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex gap-2 lg:mt-6 lg:flex-col">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50">
            ← View storefront
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg px-3 py-2 text-left text-sm text-ink-500 hover:bg-ink-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
