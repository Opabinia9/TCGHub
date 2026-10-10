import { prisma } from '../../src/utils/prisma';

export async function resetDatabase() {
  await prisma.user.deleteMany();
}
