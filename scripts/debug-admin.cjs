const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, isActive: true, name: true, password: true, createdAt: true }
    });
    if (user) {
      console.log('Admin user found:');
      console.log('  id:', user.id);
      console.log('  email:', user.email);
      console.log('  role:', user.role);
      console.log('  isActive:', user.isActive);
      console.log('  name:', user.name);
      console.log('  password hash:', user.password.substring(0, 30) + '...');
      console.log('  createdAt:', user.createdAt);
    } else {
      console.log('NO USERS FOUND IN DATABASE');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});