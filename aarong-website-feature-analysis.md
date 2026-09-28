# Aarong.com Website Feature Analysis

> Source analyzed: https://www.aarong.com/bgd (fetched September 2026)
> Purpose: Reference blueprint for building a similar e-commerce website.
> Note: Aarong's frontend is a JavaScript-rendered SPA (built on Magento, per its public URL patterns), so some deep page content (checkout, PDP widgets) could not be fully scraped. Items marked **[Confirmed]** were directly observed; items marked **[Inferred]** are standard features Aarong uses and can be safely assumed.

---

## 1. Business Overview

| Aspect | Details |
|---|---|
| **Brand** | Aarong — "Ethically made handcrafted products", a BRAC social enterprise |
| **Model** | B2C e-commerce (online) + omnichannel with physical retail outlets |
| **Category mix** | Fashion (women, men, kids), jewellery, home decor, cosmetics/skincare, gifts, wedding |
| **Sub-brands** | Taaga, Taaga Man, HERSTORY by Aarong, Aarong Earth |
| **Target audience** | Domestic (Bangladesh) + international Bangladeshi diaspora and global buyers |
| **Positioning** | Premium traditional/handcrafted products; storytelling around artisans & ethics |

**Key takeaway:** The site is an *omnichannel* commerce platform — online store tightly coupled with physical stores (store locator, in-store exchange, loyalty card linking) and multi-country selling.

---

## 2. Site Architecture & Navigation

### 2.1 Main Category Tree [Confirmed]
Top-level departments visible in the main menu:

- **Women**
- **Men**
- **Kids**
- **Home Decor**
- **Jewellery**
- **Skin & Hair** (cosmetics/skincare)
- **Gifts & Crafts**
- **Wedding**

### 2.2 Example Second-Level Navigation — Women [Confirmed]
- Shop by Category: **NEW ARRIVALS, Saree, Shalwar Kameez, Kurta, Panjabi, Scarves, Nightwear, Shawls, Fabric (Metres), Shoes, Accessories**
- Shop by Brand/Sub-brand: **TAAGA**, **HERSTORY By Aarong**

This implies a **3-level taxonomy**: Department → Category → Sub-category (e.g., Women → Saree → Jamdani), plus **brand as a parallel navigation dimension**.

### 2.3 Navigation Pattern
- **Mega menu / drawer menu** with imagery (category tiles) [Confirmed: "Menu" drawer present]
- Breadcrumbs on category & content pages [Confirmed: "Home / Shipping And Delivery" pattern]

---

## 3. Header Features

**[Confirmed] elements present in the header:**

| Feature | Notes |
|---|---|
| **Logo / brand tagline** | "Ethically made handcrafted products \| A BRAC social enterprise" |
| **SIGN IN** | Account access link in header |
| **Country/Region selector ("bgd")** | Site serves multiple countries: `/bgd` (Bangladesh), `/us`, `/ca` (Canada), `/sg`, `/ae` (UAE) — each country store has its own catalog, pricing, and policies |
| **FIND A STORE** | Store locator feature for physical outlets |
| **CUSTOMER SERVICE** | Dropdown linking to the help-center pages (see §10) |
| **MY AARONG REWARDS** | Loyalty program link in top utility bar |
| **CLUB TAAGA** | Second loyalty program link |
| **MORE** | Overflow menu for additional links |
| **Search** | Site search in header with suggestions [Inferred] |
| **Cart / Bag icon** | Mini-cart with item count [Inferred] |
| **Wishlist icon** | Dedicated wishlist page exists at `/wishlist` ("My Wish List") [Confirmed] |

---

## 4. Homepage Features

**[Confirmed / observed]**
- Hero banner / promotional sliders (campaign-driven)
- Department showcase grid (Women, Men, Kids, Home Decor, Jewellery, Skin & Hair, Gifts & Crafts, Wedding)
- New arrivals / featured product carousels
- Brand storytelling blocks (artisan/ethics messaging)
- Campaign promos (Eid, Puja, summer campaigns, scratch & win)

**[Inferred — standard for this platform]**
- Category tiles with lifestyle imagery
- Editorial/blog teaser ("My Aarong Rewards Blog" exists [Confirmed])
- Customer review / social UGC section (Instagram-style feed with hashtags #MyAarongRewards — [Confirmed] on the rewards page)
- Newsletter signup
- Footer with link groups, payment icons, app download links

---

## 5. Category / Product Listing Page (PLP)

**[Confirmed]**
- Category landing pages per department (e.g., `/bgd/women`) with "shop by category" tiles
- Deep, multi-level category hierarchy

**[Inferred — Magento-standard, safe to replicate]**
- **Filters (layered navigation):** size, color, price, material/fabric, occasion, brand, category, discount
- **Sorting:** Newest, Price low→high, Price high→low, Best selling, Rating
- **Grid/List toggle**, pagination or infinite scroll
- **Product card elements:** image (hover second image), name, price (+ strikethrough for sale), New/Sale badges, color swatches, quick-add/quick-view, wishlist heart
- Promo banner strip at top of category pages

---

## 6. Product Detail Page (PDP)

**[Confirmed — from product specs/T&C]**
- Per-product **specification block**: item code, description, color, fabric/material, care instructions
- Handcrafted-product disclaimer messaging (color/texture variations; screen-color disclaimer)
- Real-time stock awareness (sold-out items removed from site)

**[Inferred — standard for Aarong/Magento]**
- Image gallery (multiple photos, zoom)
- Size selector + **size chart**
- Quantity selector, Add to Cart, Add to Wishlist
- **Reviews & ratings** (review moderation mentioned in T&C [Confirmed])
- "You may also like" / related products, recently viewed
- Delivery estimator / store availability
- Share buttons, fabric-care info link

---

## 7. Cart & Checkout

**[Confirmed structure]**
- Cart (bag) with editable line items
- Multi-step checkout: shipping address → delivery method → payment → review (per "How to Order" flow)
- Guest checkout + registered checkout both supported
- Order confirmation with order number used for tracking

**[Inferred details worth building]**
- Promo/discount code field
- Reward-points redemption at checkout (min 100 pts, in multiples of 50 — [Confirmed])
- Loyalty account auto-linking on first login [Confirmed]
- Address book with multiple addresses; home delivery or outlet pickup
- VAT-inclusive pricing display

---

## 8. Payments [Confirmed: "Billing & Payments" service area]

- **Online payments:** Credit/debit cards (Visa, Mastercard, Amex) and local mobile financial services — **bKash, Nagad** (Bangladesh store) [Inferred from local market context + public partnership posts]
- **Cash on Delivery** available [Inferred — standard for BD market]
- **Bank partnership promos** (e.g., City Bank card offers — dedicated news post exists [Confirmed])
- Multi-currency/multi-country pricing via country store switcher [Confirmed]

---

## 9. Shipping & Delivery [Confirmed: "Shipping & Delivery", "Customs Duty", "Track Your Orders" pages]

- Domestic delivery (inside/outside Dhaka tiers) with zone-based charges [Inferred]
- **International shipping** to served countries (US, Canada, Singapore, UAE stores) with **customs duty** documentation [Confirmed]
- **Order tracking** feature ("Track Your Orders" page) [Confirmed]
- Delivery timeline promises per zone [Inferred]
- iOS & Android **mobile apps** (native) that mirror the store [Confirmed — app store listings]

---

## 10. Customer Service Hub [Confirmed]

Customer Service menu contains:
1. **Contact Us** (phone +8809678444777, email feedback@aarong.com, contact form)
2. **How To Order**
3. **Billing & Payments**
4. **Shipping & Delivery**
5. **Customs Duty**
6. **Track Your Orders**
7. **Cancellation Policy**
8. **Exchange, Return & Refund Policy** (exchange at outlets + returns online)
9. **Aarong Jewellery Policy** (category-specific policy)
10. **Fabric Care** (care guide content)
11. **Privacy Policy**
12. **Terms And Conditions**
13. **Digital Business Identity** (official digital verification docs)
14. **VAT Registration**
15. **BSTI Licence** (product standards certification display)
16. **FAQs**

**Takeaway:** A rich trust/compliance content layer — legal, tax, and certification documents surfaced prominently.

---

## 11. Accounts

- **Sign in / Register** (email + password; phone-number based identity for loyalty) [Confirmed]
- **My Wish List** — saved products page [Confirmed]
- Order history, order tracking, reorder [Inferred]
- Address book management [Inferred]
- Profile & preference management [Inferred]
- Loyalty dashboard: points balance, tier status, redemption history [Inferred]

---

## 12. Loyalty Programs [Confirmed]

### 12.1 My Aarong Rewards (main program)

| Tier | Entry requirement | Points earning |
|---|---|---|
| **INSIDER** | Automatic on any purchase (share phone number) | — |
| **LIFESTYLE** | Purchase of BDT 10,000+ (excl. VAT) | 1 pt / BDT 100 |
| **GOLD** | 3,000 points within 2 years | 2 pts / BDT 100 |
| **PLATINUM** | 8,000 points within 2 years as GOLD | 3 pts / BDT 100 |

- **Redemption:** minimum 100 points; redeem in multiples of 50
- **Downgrade rules** based on 2-year rolling activity
- **Benefits:** periodic offers, partner benefits, priority checkout during festivals, bonus-point offers, outfit pre-booking, preview event access, prize campaigns
- **Omni-channel:** earn/redeem in outlets (card) and online (auto-linked account)
- **Program blog + campaigns + UGC reviews** section (social photos with hashtags)

### 12.2 Club Taaga (sub-brand loyalty for TAAGA / TAAGA MAN)
- Tiers: **PLANET → GALAXY** (Galaxy at BDT 4,999+ purchase)
- Points on purchases + partner benefits + campaigns
- Campaign hub with articles ("Back to Campus", seasonal giveaways, scratch & win)

**Takeaway:** A **tiered points-based loyalty engine with omni-channel earn/redeem, upgrade/downgrade rules, and a campaign content hub** is a core feature to replicate.

---

## 13. Marketing & Engagement Features [Confirmed]

- Seasonal campaign pages (Eid, Puja, summer, Valentine's, Loyalty Week)
- **Scratch & win / shop & win** gamified promos
- Partner offers (travel/hospitality/dining rewards)
- **Social UGC wall** — customer photos/reviews from Facebook/Instagram with hashtags
- Loyalty **blog/articles** ("READ MORE" content pages)
- Newsletter / news & events updates
- Social media contests with rules & regulations pages

---

## 14. Internationalization [Confirmed]

- Country-specific storefronts: **Bangladesh (bgd), US, Canada, Singapore, UAE** — separate URL paths (`/bgd`, `/us`, `/ca`, `/sg`, `/ae`)
- Per-country policy pages (same features, localized terms)
- Customs duty handling for cross-border orders
- Currency & payment methods localized per store

---

## 15. Technology Notes (for rebuild planning)

| Layer | Observation |
|---|---|
| **Platform** | Magento / Adobe Commerce (evident from URL patterns: `/wishlist`, `/faq`, `mcprod.aarong.com` staging host) |
| **Frontend** | JS-heavy SPA rendering on top of Magento (slow initial paint of static content — a lesson: invest in SSR/SEO) |
| **Mobile apps** | Native iOS/Android apps sharing the commerce backend |
| **Infrastructure** | CDN + cloud hosting; staging subdomain in use |

**Alternative stack suggestion (if building fresh):** headless commerce (Medusa / Bagisto / Saleor / custom) + Next.js SSR for SEO, or Shopify Plus for speed-to-market.

---

## 16. Feature Checklist for a Similar Build (Prioritized)

### MVP (Phase 1)
- [ ] Catalog: 3-level categories + brands, multi-image products, specs (code, fabric, care, color)
- [ ] PLP with filters (price, size, color, category, brand) + sorting + grid
- [ ] PDP with gallery, size selector, qty, stock status, related products
- [ ] Cart + guest/registered checkout + address book
- [ ] Payments: cards + mobile wallets (bKash/Nagad) + cash on delivery
- [ ] Order confirmation + order tracking
- [ ] Search (with suggestions)
- [ ] Wishlist
- [ ] Auth (email/phone + password, OTP optional)
- [ ] Content/trust pages: policies, FAQ, contact, about
- [ ] Responsive design (mobile-first — majority traffic is mobile)

### Phase 2
- [ ] Loyalty program (tiers, points, redemption, omni-channel card linking)
- [ ] Promo codes, campaign/banner engine
- [ ] Reviews & ratings with moderation
- [ ] Store locator + outlet exchange/pickup integration
- [ ] Size charts, fabric-care guides, category editorial content
- [ ] Newsletter, blog/lookbook

### Phase 3
- [ ] Multi-country storefronts (pricing, currency, shipping zones, customs duty)
- [ ] Gamified campaigns (scratch & win), partner offers
- [ ] UGC/social wall, hashtag campaigns
- [ ] Native mobile apps (or PWA first)
- [ ] ERP/inventory sync with physical stores (omnichannel stock)
- [ ] Bank-card promotion engine (co-branded discounts)

---

## 17. Open Questions Before Building

1. **Scope:** Bangladesh-only store or multi-country like Aarong?
2. **Omnichannel:** Do you have physical outlets (store locator, in-store exchange, loyalty card) or online-only?
3. **Payments:** Which gateways — bKash/Nagad/cards/COD? Local PSP choice (e.g., SSLCommerz, ShurjoPay)?
4. **Platform:** Custom build (Laravel/Node + React) vs. Magento vs. Shopify vs. Bagisto?
5. **Loyalty:** Do you need the full tiered points engine in v1?
6. **Content:** Will you need a blog/campaign CMS and UGC wall?
7. **Apps:** Native apps required, or is responsive web/PWA enough for launch?

