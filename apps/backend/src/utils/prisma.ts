import { ENV } from './env.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '.prisma/client/client.js';

const connectionString = `${ENV.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
