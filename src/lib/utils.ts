/** Small helpers shared by the storefront and the admin panel. */

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Prisma returns Decimal objects — normalise them for React / JSON. */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value) || 0;
  // Prisma.Decimal exposes toNumber()
  const maybeDecimal = value as { toNumber?: () => number };
  if (typeof maybeDecimal.toNumber === "function") return maybeDecimal.toNumber();
  return Number(value) || 0;
}

export function formatPrice(value: unknown, currency = "BDT") {
  const amount = toNumber(value);
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return currency === "BDT" ? `৳${formatted}` : `${currency} ${formatted}`;
}

export function slugify(input: string) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function truncate(text: string | null | undefined, max = 120) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Total sellable stock across all variants of a product. */
export function totalStock(variants: Array<{ stockQuantity: number }>) {
  return variants.reduce((sum, variant) => sum + (variant.stockQuantity ?? 0), 0);
}

export function buildPagination(page: number, pageSize: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    page: current,
    pageSize,
    total,
    totalPages,
    skip: (current - 1) * pageSize,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

/** Sizes are stored as strings; this keeps "S, M, L, XL, XXL" ordered sensibly. */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export function sortSizes(sizes: string[]) {
  return [...new Set(sizes)].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.toUpperCase());
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}
