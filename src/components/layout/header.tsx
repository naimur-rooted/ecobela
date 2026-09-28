"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { CategoryWithChildrenDTO } from "@/lib/serializers";

export function Header({ categories }: { categories: CategoryWithChildrenDTO[] }) {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = searchTerm.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      {/* ── Announcement / marquee bar ── */}
      <div className="relative overflow-hidden bg-maroon-800 py-2 text-center text-xs text-white">
        <div className="flex">
          <div className="marquee-track gap-16 px-8">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 text-[11px] font-medium uppercase tracking-widest">
                <span>🚚 Free delivery on orders over ৳2,000</span>
                <span className="text-white/50">•</span>
                <span>🎁 New festive collection now available</span>
                <span className="text-white/50">•</span>
                <span>♻️ Ethically made in Bangladesh</span>
                <span className="text-white/50">•</span>
                <span>💳 Cash on delivery available nationwide</span>
                <span className="text-white/50">•</span>
                <span>🔄 7-day easy exchange on unused items</span>
                <span className="text-white/50">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container-page flex h-[var(--header-height)] items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 transition hover:border-maroon-300 hover:text-maroon-700 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {isMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-800 text-sm font-bold text-white shadow-sm">
              EB
            </span>
            <span className="hidden font-display text-xl font-semibold tracking-tight text-ink-900 sm:block">
              Eco <span className="text-maroon-800">Bela</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} role="search" className="ml-auto hidden max-w-lg flex-1 lg:block">
            <div className="relative">
              <input
                type="search"
                name="q"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sarees, panjabis, crafts…"
                aria-label="Search products"
                className="w-full rounded-full border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-4 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
          </form>

          {/* Actions */}
          <nav className="ml-auto flex items-center gap-1 lg:ml-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-maroon-700 hover:bg-maroon-50 sm:block"
              >
                Admin
              </Link>
            )}

            {session?.user ? (
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden md:inline">{session.user.name?.split(" ")[0] ?? "Account"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-ink-50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 sm:flex"
              >
                <UserIcon className="h-4 w-4" />
                <span>Sign in</span>
              </Link>
            )}

            {/* Cart button */}
            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center gap-2 rounded-full border-2 border-maroon-800 px-4 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-800 hover:text-white"
            >
              <CartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon-800 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* ── Mobile drawer ── */}
        {isMenuOpen && (
          <div className="border-t border-ink-100 bg-white lg:hidden">
            <div className="container-page space-y-4 py-4">
              {/* Mobile search */}
              <form onSubmit={handleSearch} role="search">
                <div className="relative">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    className="w-full rounded-full border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-400 focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-100"
                  />
                  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </div>
              </form>

              {/* Mobile categories */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-400">Shop</p>
                <div className="grid gap-0.5">
                  <Link href="/products" className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50">
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50"
                      >
                        {cat.name}
                      </Link>
                      {cat.children.length > 0 && (
                        <div className="ml-4 grid gap-0.5">
                          {cat.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/category/${child.slug}`}
                              className="rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-ink-50"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile account */}
              <div className="grid gap-0.5 border-t border-ink-100 pt-3">
                {session?.user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-maroon-700">
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/account" className="rounded-lg px-3 py-2.5 text-sm text-ink-800">
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-lg px-3 py-2.5 text-left text-sm text-ink-500"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800">
                      Sign in
                    </Link>
                    <Link href="/register" className="rounded-lg px-3 py-2.5 text-sm text-ink-500">
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
