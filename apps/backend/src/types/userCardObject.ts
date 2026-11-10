import { Prisma } from '@prisma/client';

export const userCardWithCards = {
  include: {
    Card: true,
    User: true,
  },
} satisfies Prisma.UserCardDefaultArgs;

export type UserCollection = {
  items: Array<Prisma.UserCardGetPayload<typeof userCardWithCards>>;
  total: number;
};
