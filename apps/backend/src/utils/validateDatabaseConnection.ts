import { prisma } from '@/utils/prisma.js';

// TODO: document and unittest
/* c8 ignore  start */
export async function validateDatabaseConnection(): Promise<void> {
  try {
    const connectionPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 5000),
    );

    await Promise.race([connectionPromise, timeoutPromise]);
  } catch (err) {
    await prisma.$disconnect();
    throw new Error('Database connection failed');
  }
}
/* c8 ignore stop */
