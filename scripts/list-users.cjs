const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true, name: true, createdAt: true }
    });
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log('  -', u.email, '| role:', u.role, '| active:', u.isActive, '| name:', u.name, '| created:', u.createdAt);
    });
  } finally {
    await prisma.disconnect();
  }
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1) });