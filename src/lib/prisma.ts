import { PrismaClient } from "@prisma/client";

/**
 * Next.js dev mode re-evaluates modules on every hot reload, which would
 * exhaust database connections. We cache a single client on the global object.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
