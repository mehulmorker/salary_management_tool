import { PrismaClient } from '../generated/prisma/client';

// Singleton pattern — reuse the same Prisma client across the app.
// In tests, a fresh client is created per suite pointing at test.db.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({} as never);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
