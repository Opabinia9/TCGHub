import { Prisma } from '@prisma/client';
import { prisma } from '@/utils/prisma.js';
import UserCardsRepository from '@/persistence/userCardsRepository.js';

export const userCardWithCards = {
  include: {
    Card: true,
  },
} satisfies Prisma.UserCardDefaultArgs;

export type UserCollection = Array<
  Prisma.UserCardGetPayload<typeof userCardWithCards>
>;
