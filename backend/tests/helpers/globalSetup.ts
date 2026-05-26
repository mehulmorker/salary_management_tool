import { execSync } from 'child_process';
import path from 'path';

export default async function globalSetup(): Promise<void> {
  // Point Prisma at the test database
  process.env.DATABASE_URL = 'file:./test.db';

  // Apply migrations to the test database
  execSync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '../../'),
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'inherit'
  });

  console.log('✓ Test database migrated');
}
