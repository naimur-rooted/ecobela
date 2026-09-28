/**
 * Reconciles the imported taxonomy into one clean tree while preserving every
 * product, variant and image. This is a maintenance script, not a seed:
 *   - reuses the existing women/home-decor roots instead of creating duplicates
 *   - folds case-variant duplicates (Saree/SAREE) into the uppercase branch
 *   - moves existing products from removed demo categories to the new branch
 *   - detaches the retired child/shirt demo categories instead of deleting them
 *
 *   npx tsx scripts/reconcile-categories.ts
 */
import { PrismaClient } from "@prisma/client";

import { womenTaxonomy } from "./taxonomy/women";
import { menTaxonomy } from "./taxonomy/men";
import { kidsTaxonomy } from "./taxonomy/kids";
import { homeDecorTaxonomy, giftsCraftsTaxonomy } from "./taxonomy/home-gifts";
import type { TaxonomyNode } from "./taxonomy/women";

const prisma = new PrismaClient();

const roots = [
  { name: "WOMEN", nodes: womenTaxonomy },
  { name: "MEN", nodes: menTaxonomy },
  { name: "KIDS'", nodes: kidsTaxonomy },
  { name: "HOME DÉCOR", nodes: homeDecorTaxonomy },
  { name: "GIFTS & CRAFTS", nodes: giftsCraftsTaxonomy },
];

const retiredSlugs = ["child", "shirt"];

function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function leafSlug(name: string) {
  return slugify(name) || `category-${Date.now()}`;
}

function childSlug(parentSlug: string, name: string) {
  return `${parentSlug}-${leafSlug(name)}`;
}

async function uniqueSlug(desired: string) {
  let slug = desired;
  let suffix = 2;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${desired}-${suffix++}`;
  }
  return slug;
}

/** Finds a category among the given candidates that matches `name` ignoring case. */
async function pick(exactSlug: string, name: string, siblingNames: Set<string>) {
  const exact = await prisma.category.findUnique({ where: { slug: exactSlug } });
  if (exact && !siblingNames.has(exact.name)) return exact;
  return prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    orderBy: { createdAt: "asc" },
  });
}

type NewNode = { parentId: string; parentSlug: string; siblingNames: Set<string>; children: TaxonomyNode[]; name: string };

async function ensureNode(node: NewNode) {
  const desired = childSlug(node.parentSlug, node.name);
  const sibling = await pick(desired, node.name, node.siblingNames);
  if (sibling) {
    node.siblingNames.add(sibling.name);
    if (node.siblingNames.has(sibling.name) && sibling.name !== node.name) {
      // Promote an existing differently-cased row to the canonical name.
      await prisma.category.update({ where: { id: sibling.id }, data: { name: node.name } });
    }
    for (const child of node.children) {
      await ensureNode({ parentId: sibling.id, parentSlug: sibling.slug, siblingNames: new Set(), children: [child] });
    }
    return;
  }
  const created = await prisma.category.create({ data: { name: node.name, slug: await uniqueSlug(desired), parentId: node.parentId } });
  node.siblingNames.add(created.name);
  for (const child of node.children) {
    await ensureNode({ parentId: created.id, parentSlug: created.slug, siblingNames: new Set(), children: [child] });
  }
}

async function main() {
  const result = await prisma.$transaction(async (tx) => {
    const canonicalRoots: string[] = [];
    for (const section of roots) {
      let root = await tx.category.findFirst({ where: { parentId: null, name: { equals: section.name, mode: "insensitive" } }, orderBy: { createdAt: "asc" } });
      if (!root) {
        const slug = await uniqueSlug(slugify(section.name));
        root = await tx.category.create({ data: { name: section.name, slug, parentId: null } });
      } else if (root.name !== section.name) {
        root = await tx.category.update({ where: { id: root.id }, data: { name: section.name } });
      }
      canonicalRoots.push(root.id);
      const names = new Set<string>();
      for (const node of section.nodes) {
        await ensureNode({ parentId: root.id, parentSlug: root.slug, siblingNames: names, children: [node] });
      }
    }
    return canonicalRoots;
  }, { maxWait: 10_000, timeout: 120_000 });

  const reparented = await prisma.$transaction(async (tx) => {
    let moved = 0;
    for (const slug of retiredSlugs) {
      const retired = await tx.category.findUnique({ where: { slug } });
      if (!retired) continue;
      const replacement = slug === "shirt" ? await tx.category.findUnique({ where: { slug: "women-saree" } }) ?? result[0] : null;
      const target = replacement ?? (await tx.category.findFirst({ where: { parentId: null, name: "KIDS'", mode: "insensitive" } }))!;
      const products = await tx.product.findMany({ where: { categoryId: retired.id }, select: { id: true } });
      for (const product of products) {
        await tx.product.update({ where: { id: product.id }, data: { categoryId: target.id } });
        moved += 1;
      }
      await tx.category.update({ where: { id: retired.id }, data: { parentId: null, children: { set: [] } } });
    }
    return moved;
  }, { maxWait: 10_000, timeout: 60_000 });

  const [total, rootCount, products] = await Promise.all([
    prisma.category.count(),
    prisma.category.count({ where: { parentId: null } }),
    prisma.product.count(),
  ]);
  console.log(`Canonical roots: ${rootCount}; categories: ${total}; products preserved: ${products}; products reparented: ${reparented}.`);
}

main()
  .catch((error) => {
    console.error("Reconcile failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
