import { PrismaClient } from '../../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// DATABASE_URL is set to 'file:./test.db' via Jest setupFiles before this runs
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./test.db'
});

export const testPrisma = new PrismaClient({ adapter });

export async function cleanDatabase(): Promise<void> {
  await testPrisma.employee.deleteMany();
}
