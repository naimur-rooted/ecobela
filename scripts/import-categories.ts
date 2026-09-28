/**
 * Strips Markdown/list bullet prefixes and any leading dash from category
 * display names. Only the leading prefix is removed; internal hyphens such as
 * "T-Shirts" and "Cotton & Blends" are deliberately preserved.
 */
function cleanCategoryName(value: string): string {
  let result = value.trim();
  let previous: string;
  do {
    previous = result;
    result = result.replace(/^\s*(?:[-*•]\s*)+/, "").trim();
  } while (result !== previous);
  return result;
}

/**
 * Imports the full Eco Bela category hierarchy without adding products.
 * Safe to re-run: existing category names are reused, missing children are
 * created, and existing category slugs/product links remain unchanged.
 *
 *   npm run categories:import
 */
import { PrismaClient, type Prisma } from "@prisma/client";

import { womenTaxonomy } from "./taxonomy/women";
import { menTaxonomy } from "./taxonomy/men";
import { kidsTaxonomy } from "./taxonomy/kids";
import { homeDecorTaxonomy, giftsCraftsTaxonomy } from "./taxonomy/home-gifts";

const prisma = new PrismaClient();

/** Matches the site's slug rules while preventing duplicate global slugs. */
function makeSlug(name: string, parentSlug?: string): string {
  const leaf =
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `category-${Date.now()}`;
  return parentSlug ? `${parentSlug}-${leaf}` : leaf;
}

const sections = [
  { name: "WOMEN", nodes: womenTaxonomy },
  { name: "MEN", nodes: menTaxonomy },
  { name: "KIDS'", nodes: kidsTaxonomy },
  { name: "HOME DÉCOR", nodes: homeDecorTaxonomy },
  { name: "GIFTS & CRAFTS", nodes: giftsCraftsTaxonomy },
];

type Node = (typeof sections)[number]["nodes"][number];
type Report = { added: string[]; reused: number };

async function findOrCreate(
  tx: Prisma.TransactionClient,
  name: string,
  parentId: string | null,
  parentSlug?: string,
): Promise<{ id: string; slug: string; created: boolean }> {
  const existing = await tx.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, parentId },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return { id: existing.id, slug: existing.slug, created: false };

  let slug = makeSlug(name, parentSlug);
  let suffix = 2;
  while (await tx.category.findUnique({ where: { slug } })) {
    slug = `${makeSlug(name, parentSlug)}-${suffix++}`;
  }
  const created = await tx.category.create({ data: { name, slug, parentId } });
  return { id: created.id, slug: created.slug, created: true };
}

async function insertLevel(
  tx: Prisma.TransactionClient,
  nodes: Node[],
  parentId: string | null,
  parentSlug: string | undefined,
  report: Report,
): Promise<void> {
  for (const node of nodes) {
    const { id, slug, created } = await findOrCreate(tx, node.name, parentId, parentSlug);
    if (created) report.added.push(parentSlug ? `${parentSlug} > ${node.name}` : node.name);
    else report.reused += 1;
    if (node.children?.length) await insertLevel(tx, node.children, id, slug, report);
  }
}

async function main() {
  await prisma.$transaction(
    async (tx) => {
      const report: Report = { added: [], reused: 0 };
      for (const section of sections) {
        const root = await findOrCreate(tx, section.name, null);
        if (root.created) report.added.push(section.name);
        else report.reused += 1;
        await insertLevel(tx, section.nodes, root.id, root.slug, report);
      }
      console.log(`Categories added: ${report.added.length}`);
      console.log(`Existing categories reused: ${report.reused}`);
      report.added.forEach((name) => console.log(`  + ${name}`));
    },
    { maxWait: 10_000, timeout: 120_000 },
  );

  const [roots, total, products] = await Promise.all([
    prisma.category.count({ where: { parentId: null } }),
    prisma.category.count(),
    prisma.product.count(),
  ]);
  console.log(`\nHierarchy: ${roots} root categories, ${total} categories total.`);
  console.log(`Products preserved: ${products} (no products were created or changed).`);
}

main()
  .catch((error) => {
    console.error("Category import failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
