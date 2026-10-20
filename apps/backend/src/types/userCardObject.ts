import { Prisma } from '@prisma/client';

export const userCardWithCards = {
  include: {
    Card: true,
  },
} satisfies Prisma.UserCardDefaultArgs;

export type UserCollection = Array<
  Prisma.UserCardGetPayload<typeof userCardWithCards>
>;
