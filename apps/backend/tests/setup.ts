import { beforeAll, afterAll, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import { resetDatabase } from './helpers/db.js';
import { validateDatabaseConnection } from '../src/utils/validateDatabaseConnection.js';

beforeAll(async () => {
  // TODO: setup proper testing database and automation with schema migration
  if (!process.env.NODE_ENV?.includes('test')) {
    throw Error('TESTS REQUIRE TEST ENV');
  }
  await validateDatabaseConnection();
  execSync('npx prisma db push');
});

afterAll(async () => {});

beforeEach(async () => {
  await resetDatabase();
});
