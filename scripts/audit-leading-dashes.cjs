import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.category.findMany({
    where: { OR: [{ name: { startsWith: "-" } }, { name: { startsWith: "–" } }, { name: { startsWith: "—" } }] },
    select: { id: true, name: true, slug: true, parent: { select: { name: true } } },
    orderBy: [{ parent: { name: "asc" } }, { name: "asc" }],
  });
  console.log(JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
