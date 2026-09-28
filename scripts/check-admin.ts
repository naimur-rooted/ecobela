import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

/** Same minimal .env loader used by scripts/create-admin.ts. */
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = (match[2] ?? "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv();

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`FAIL: no user found for ${email} -> run: npm run admin:create`);
    process.exitCode = 1;
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  const products = await prisma.product.count();
  const categories = await prisma.category.count();

  console.log(`email       : ${user.email}`);
  console.log(`role        : ${user.role}`);
  console.log(`isActive    : ${user.isActive}`);
  console.log(`password OK : ${passwordMatches}`);
  console.log(`products    : ${products}`);
  console.log(`categories  : ${categories}`);

  if (user.role !== "ADMIN" || !user.isActive || !passwordMatches) {
    console.log("RESULT: admin needs repair -> run: npm run admin:create");
    process.exitCode = 1;
    return;
  }

  console.log("RESULT: admin login credentials are valid");
}

main()
  .catch((error) => {
    console.error("ERROR:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
