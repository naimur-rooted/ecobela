import Link from "next/link";
import type { CategoryWithChildrenDTO } from "@/lib/serializers";
import { NewsletterForm } from "@/components/layout/newsletter-form";


export function Footer({ categories }: { categories: CategoryWithChildrenDTO[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-ink-950 text-ink-300">
      {/* Newsletter strip */}
      <div className="border-b border-ink-800 bg-maroon-800">
        <div className="container-page flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">
              Join the EcoBela Community
            </h3>
            <p className="mt-1 text-sm text-maroon-200">
              Get early access to new arrivals, exclusive offers & stories from our artisans.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand col */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-800 text-sm font-bold text-white">
              EB
            </span>
            <span className="font-display text-xl font-semibold text-white">
              Eco <span className="text-brand-400">Bela</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Thoughtfully made clothing, crafts and home goods from Bangladeshi
            artisans — bringing nature-inspired living to every home.
          </p>
          {/* Social icons */}
          <div className="mt-6 flex gap-3">
            {[
              { label: "Facebook", href: "#", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { label: "Instagram", href: "#", icon: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M6.5 6.5A1 1 0 0 0 6 7.5v9A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 16.5 6h-9A1.5 1.5 0 0 0 6 7.5z" },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-700 text-ink-400 transition hover:border-maroon-500 hover:text-maroon-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop col */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Shop</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/products" className="text-ink-400 transition hover:text-brand-400">
                All Products
              </Link>
            </li>
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="text-ink-400 transition hover:text-brand-400">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account col */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Account</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { label: "My Account", href: "/account" },
              { label: "Shopping Cart", href: "/cart" },
              { label: "Sign In", href: "/login" },
              { label: "Create Account", href: "/register" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-ink-400 transition hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer care col */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Customer Care</h3>
          <ul className="mt-5 space-y-3 text-sm text-ink-400">
            <li>
              <a href="mailto:support@ecobela.com" className="text-brand-400 transition hover:text-brand-300 hover:underline">
                support@ecobela.com
              </a>
            </li>
            <li>Nationwide delivery across Bangladesh</li>
            <li>Cash on delivery & mobile banking</li>
            <li>7-day easy exchange on unused items</li>
            <li>Secure SSL-encrypted checkout</li>
          </ul>

          {/* Payment method pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["Visa", "MasterCard", "bKash", "Nagad", "COD"].map((method) => (
              <span
                key={method}
                className="rounded border border-ink-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-600 sm:flex-row">
          <p>© {year} Eco Bela. All rights reserved.</p>
          <p>
            Made with ❤️ in Bangladesh &nbsp;·&nbsp; Built with Next.js &amp; Prisma
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-ink-400 transition">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
