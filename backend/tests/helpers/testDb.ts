import { PrismaClient } from '../../src/generated/prisma/client';

// Create a Prisma client that always points at the test database
export const testPrisma = new PrismaClient({} as never);

/**
 * Delete all rows from all tables (in dependency order).
 * Call this in beforeEach to ensure test isolation.
 */
export async function cleanDatabase(): Promise<void> {
  await testPrisma.employee.deleteMany();
}
