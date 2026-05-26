import fs from 'fs';
import path from 'path';

export default async function globalTeardown(): Promise<void> {
  // Clean up test database files after the full suite
  const dbFiles = ['test.db', 'test.db-journal', 'test.db-wal', 'test.db-shm'];
  for (const file of dbFiles) {
    const filePath = path.resolve(__dirname, '../../', file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  console.log('✓ Test database cleaned up');
}
