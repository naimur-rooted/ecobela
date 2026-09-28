import Link from "next/link";
import Image from "next/image";

import { HeroSlider } from "@/components/storefront/hero-slider";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGrid } from "@/components/storefront/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryTree, getProducts } from "@/lib/catalog";
import { demoProducts, type DemoProduct } from "@/data/demo-products";
import { truncate } from "@/lib/utils";
import { heroSlides } from "@/data/hero-slides";
import { formatPrice } from "@/lib/utils";
import type { ProductListItemDTO } from "@/lib/serializers";

export default async function HomePage() {
  const [{ data: categories }, newest] = await Promise.all([
    getCategoryTree(),
    getProducts({ pageSize: 8 }),
  ]);
  const products = newest.data.items;
  const showDemo = products.length === 0;

  return (
    <div>
      {/* ── Hero Slider ── */}
      <HeroSlider slides={heroSlides} />

      {/* ── USP Strip ── */}
      <div className="border-b border-ink-100 bg-clay-50">
        <div className="container-page">
          <div className="grid grid-cols-2 divide-x divide-ink-100 sm:grid-cols-4">
            {[
              { icon: "🚚", title: "Free Delivery", body: "On orders over ৳2,000" },
              { icon: "♻️", title: "Ethically Made", body: "Fair wages, safe workshops" },
              { icon: "🔄", title: "Easy Exchange", body: "7-day hassle-free returns" },
              { icon: "🔒", title: "Secure Payment", body: "Cards, bKash & COD" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-1.5 px-4 py-5 text-center sm:flex-row sm:gap-3 sm:text-left"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-800">{item.title}</p>
                  <p className="text-xs text-ink-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop by Category ── */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-700">Collections</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-maroon-800 hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            className="mt-6"
            icon="🎋"
            title="Collections coming soon"
            description="Categories will appear once published from the admin panel."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((category, idx) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length]
                }`}
              >
                <div className="p-6">
                  <div className="mb-3 text-3xl">{CATEGORY_ICONS[idx % CATEGORY_ICONS.length]}</div>
                  <p className="font-display text-lg font-semibold text-ink-900 group-hover:text-maroon-800 transition-colors">
                    {category.name}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {category.productCount ?? 0} product{(category.productCount ?? 0) === 1 ? "" : "s"}
                    {category.children.length ? ` · ${category.children.length} sub-collections` : ""}
                  </p>
                  {category.children.length > 0 && (
                    <p className="mt-2 text-[11px] text-ink-400 line-clamp-1">
                      {truncate(category.children.map((c) => c.name).join(" · "), 55)}
                    </p>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-maroon-800 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Editorial Banner ── */}
      <section className="bg-maroon-800">
        <div className="container-page py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-300">
                Our Story
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
                Handcrafted with Heart,<br />Made in Bangladesh
              </h2>
              <p className="mt-4 text-base leading-relaxed text-maroon-200">
                Every piece in our collection tells a story of skilled artisans, sustainable materials,
                and centuries-old craft traditions. We partner directly with cooperatives across Bangladesh
                to bring you ethically made goods — at fair prices.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-widest text-maroon-800 transition hover:bg-maroon-50"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Our Mission
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { stat: "500+", label: "Artisan Partners" },
                { stat: "20+", label: "Years of Craft" },
                { stat: "15K+", label: "Happy Customers" },
                { stat: "100%", label: "Ethically Sourced" },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="rounded-2xl border border-maroon-700 bg-maroon-900/50 p-6 text-center"
                >
                  <p className="font-display text-3xl font-bold text-white">{item.stat}</p>
                  <p className="mt-1 text-sm text-maroon-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="border-t border-ink-100 bg-clay-50/50">
        <div className="container-page py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-700">
                {showDemo ? "Preview" : "Fresh picks"}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                New Arrivals
              </h2>
            </div>
            {!showDemo && (
              <Link
                href="/products"
                className="hidden items-center gap-1 text-sm font-semibold text-maroon-800 hover:underline sm:flex"
              >
                Shop all <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {showDemo ? (
            <DemoGrid products={demoProducts} />
          ) : (
            <ProductGrid products={products} />
          )}

          {showDemo && (
            <p className="mt-6 text-center text-sm text-ink-400">
              Preview only — add real products via the{" "}
              <Link href="/admin" className="font-semibold text-maroon-700 hover:underline">
                Admin Panel
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="container-page py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🧵",
              title: "Traditional Weaves",
              body: "Muslin, jamdani and kantha — our artisans preserve centuries of textile heritage.",
              href: "/products",
            },
            {
              icon: "🌿",
              title: "Eco-Conscious",
              body: "Natural dyes, organic cotton and sustainable packaging across every order.",
              href: "/products",
            },
            {
              icon: "🤝",
              title: "Fair Trade",
              body: "Every purchase directly supports artisan families with fair wages and benefits.",
              href: "/products",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-ink-100 bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-maroon-200 hover:shadow-card-hover"
            >
              <div className="mb-4 text-4xl">{item.icon}</div>
              <h3 className="font-display text-xl font-semibold text-ink-900 group-hover:text-maroon-800 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.body}</p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-maroon-700 opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-ink-100 bg-clay-50">
        <div className="container-page py-16">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-700">Reviews</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink-900">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="flex gap-0.5 text-brand-500">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600 italic">"{t.review}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-100 text-sm font-bold text-maroon-800">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                    <p className="text-xs text-ink-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── helpers ─── */

const CATEGORY_GRADIENTS = [
  "from-rose-50 to-rose-100",
  "from-amber-50 to-amber-100",
  "from-sky-50 to-sky-100",
  "from-violet-50 to-violet-100",
  "from-emerald-50 to-emerald-100",
  "from-orange-50 to-orange-100",
  "from-pink-50 to-pink-100",
  "from-teal-50 to-teal-100",
];

const CATEGORY_ICONS = ["👘", "👔", "👶", "🏠", "💍", "🎁", "👜", "🌸"];

const TESTIMONIALS = [
  {
    name: "Fatima Akter",
    location: "Dhaka",
    review:
      "The quality is absolutely stunning. My saree arrived perfectly folded and the fabric feels luxurious. Will definitely order again!",
  },
  {
    name: "Rajib Hossain",
    location: "Chittagong",
    review:
      "Fast delivery, great packaging. The panjabi I bought for Eid was a huge hit with my family. Excellent craftsmanship.",
  },
  {
    name: "Priya Sharma",
    location: "Sylhet",
    review:
      "I love that EcoBela supports local artisans. The nakshi kantha throw I bought is a masterpiece. So proud to display it in my home.",
  },
];

function DemoGrid({ products }: { products: DemoProduct[] }) {
  function parseDemoPrice(raw: string): number {
    return Number(raw.replace(/[৳,\s]/g, "")) || 0;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            slug: product.id,
            title: product.title,
            basePrice: parseDemoPrice(product.price),
            categoryName: null,
            mainImage: null,
            variantCount: 0,
            sizeCount: 0,
            colorCount: 0,
            totalStock: 999,
            isActive: true,
            categoryId: null,
            createdAt: new Date().toISOString(),
          }}
          priority={index < 4}
          images={product.images}
        />
      ))}
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
