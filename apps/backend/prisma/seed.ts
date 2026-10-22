import { ENV } from '../src/utils/env.ts';
import { prisma } from '../src/utils/prisma.ts';
import { Pool } from 'pg';

const connectionString = `${ENV.DATABASE_URL}`;
const pool = new Pool({ connectionString });

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'jane@example.com',
        username: 'jane',
        first_name: 'jane',
        last_name: 'doe',
        hash: '$argon2id$v=19$m=1311072,p=2,t=3$9zoTp25diz48VKzkba8qWg$kYQctZdUY8HoBA8Qwrh8AshqeLaxCI3kw8HBgLwVE5c',
      },
      {
        email: 'john@example.com',
        username: 'john',
        first_name: 'john',
        last_name: 'doe',
        hash: '$argon2id$v=19$m=19456,p=2,t=3$+LkE+Z/TTtlxv1sSL9mdvA$lkzQh7d75loF5uiqvrHtw7ArFDIRLa9mEOu2k1+ti9M',
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
