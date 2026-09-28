import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true, parent: { select: { name: true, slug: true } } },
  });
  console.log(`CATEGORIES (${rows.length}):`);
  for (const r of rows) {
    console.log(`  ${r.slug}  |  ${r.name}${r.parent ? `  (parent: ${r.parent.slug})` : ""}`);
  }
}

main()
  .catch((e) => console.error("ERR", e))
  .finally(() => prisma.$disconnect());
