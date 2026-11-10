import type { Prisma, User } from '@prisma/client';

export type UserCreationInterface = Pick<User, 'username' | 'email' | 'name'>;

export const userWithChats = {
  include: {
    chats: {
      include: {
        Chat: {
          include: {
            members: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.UserDefaultArgs;

export type UserWithChats = Prisma.UserGetPayload<typeof userWithChats>;
