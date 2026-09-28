# Eco Bela — omnichannel e-commerce platform

Production-ready Next.js storefront **plus** a full admin panel, built for the
Bangladeshi market (BDT pricing, mobile-banking-ready, nationwide delivery).

The catalogue starts **completely empty** — no mock products, categories or
variants are ever seeded. Everything is created through the Admin UI.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 3 |
| Backend | Next.js Route Handlers (Node.js runtime) |
| Database | PostgreSQL + Prisma ORM 6 |
| Auth | NextAuth.js (Credentials, JWT sessions, role-based access control) |
| Storage | Cloudinary (signed direct upload) with an automatic local-disk fallback |
| Validation | Zod (shared between client and server) |

---

## Quick start

```bash
npm install          # installs deps and generates the Prisma client

# 1. PostgreSQL
#    Option A — zero-install local Postgres (starts a real PG 17 on port 5433)
npm run db:setup     # boots Postgres, applies migrations, creates the admin user
#    Option B — bring your own Postgres: set DATABASE_URL in .env, then
npm run db:deploy && npm run admin:create

# 2. Run
npm run dev          # http://localhost:3000
```

`npm run db:setup` keeps PostgreSQL running in that terminal. In a second
terminal run `npm run dev`.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run dev:db` | Starts the embedded local PostgreSQL (port 5433, data in `.pgdata`) |
| `npm run db:setup` | Starts Postgres + `prisma migrate` + creates the admin user |
| `npm run db:migrate` | Creates a new migration from schema changes |
| `npm run db:deploy` | Applies migrations (production) |
| `npm run db:studio` | Prisma Studio data browser |
| `npm run admin:create` | Creates/updates the bootstrap ADMIN from `.env` |
| `npm run build` | Prisma generate + production build |

### Environment

Copy `.env.example` → `.env`. Key values:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Auth callback URL + JWT signing secret |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin (used only by `admin:create`) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Leave empty to use the built-in local uploader |
---

## Feature overview (Phase 1)

### Admin panel — `/admin` (ADMIN role only)
- **Dashboard**: product / category / variant / inventory / customer counters, low-stock warnings, recent products.
- **Add product** (`/admin/products/new`) — the complete upload pipeline in one screen:
  - Title, auto-slug, description, base price, category, publish/draft switch.
  - **Image uploader**: drag & drop or file picker, per-file progress, reorder, set-main, remove, paste-a-URL fallback.
    Files go **directly to Cloudinary** using a short-lived server signature, so the API secret never reaches the browser.
  - **Variant generator**: type sizes (S, M, L) and colours (Red, Blue) and every combination becomes a row with its own
    **SKU** and **stock quantity**; includes auto-SKU, bulk stock setting and SKU regeneration.
  - Saves product + variants + images in **one PostgreSQL transaction**.
- **Products list**: search, pagination, stock, publish/unpublish, edit, delete.
- **Edit product**: same form pre-filled; variants and images are diffed (existing variant IDs are preserved).
- **Categories**: unlimited nesting, cycle protection, deletion blocked while products/sub-categories exist.

### Storefront
- **Header**: search, session-aware account menu, cart badge, role-aware admin link, dropdown category nav.
- **Home**: hero, category tiles, new arrivals, trust bar, plus empty states ("New arrivals coming soon").
- **`/products`**: search, sorting, pagination and an elegant "Store updating" empty state.
- **`/category/[slug]`**: category landing incl. sub-category chips (parent listings include descendants).
- **`/products/[slug]`**: gallery, size/colour selectors with out-of-stock blocking, quantity, add-to-cart, related items.
- **`/cart`**: localStorage cart (survives reloads), quantity editing, totals.
- **Auth**: `/login`, `/register` (public sign-ups are always CUSTOMER), `/account`.

---

## Security model

- `middleware.ts` blocks every `/admin/*` page for non-admins.
- Every `/api/admin/*` route calls `requireAdmin()` and returns JSON `401/403` (never an HTML redirect).
- Public registration **cannot** create an ADMIN — the role is forced server-side.
- Passwords are hashed with bcrypt (cost 12); sessions are signed JWTs.
- All write payloads are validated with Zod **on the server**; Prisma unique-constraint errors become
  friendly 409 messages (duplicate slug / duplicate SKU).

---

## Database schema (Prisma — PostgreSQL)

- `User` — id, name, email, password, role (ADMIN | CUSTOMER), isActive, timestamps
- `Category` — id, name, slug, parentId (self-relation → unlimited tree)
- `Product` — id, title, slug, description, basePrice `Decimal(10,2)`, categoryId, isActive, timestamps
- `ProductVariant` — id, productId, sku (unique), size, color, stockQuantity, `@@unique([productId, size, color])`
- `ProductImage` — id, productId, imageUrl, publicId, isMain, position

Full definition: `prisma/schema.prisma`.

---

## Storage providers

`src/lib/cloudinary.ts` selects a driver at runtime:

1. **Cloudinary** (production) — when the `CLOUDINARY_*` vars are set, the browser requests
   `/api/admin/uploads/sign` and uploads the file straight to Cloudinary with that signature.
2. **Local disk** (development) — files are written to `public/uploads/` via `/api/admin/uploads/local`.
   The uploader UI always shows which driver is active.

---

## Roadmap (next phases)

- Checkout, payments (cards, bKash/Nagad, cash on delivery), orders and tracking.
- Reviews & ratings, wishlist, coupons.
- Loyalty campaigns, UGC wall, multi-country storefronts, native apps.
- Redis caching and CDN image optimisation for additional hosts.

