import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const all = await p.category.findMany({ select: { id:true, name:true, slug:true, parentId:true }, orderBy:{ name:'asc' } });
  const affected = all.filter(c => /^[\s\u2010-\u2015-]+/.test(c.name) || c.name.includes('- '));
  console.log('TOTAL_CATEGORIES=' + all.length);
  console.log('PRODUCTS=' + await p.product.count());
  console.log('AFFECTED=' + affected.length);
  for (const c of affected) console.log(JSON.stringify(c));
}
main().finally(() => p.$disconnect());
