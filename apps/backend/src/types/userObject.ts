import type { Prisma, User } from '@prisma/client';

export type UserCreationInterface = Pick<
  User,
  'username' | 'email' | 'hash' | 'first_name' | 'last_name'
>;

export const userWithChats = {
  include: { chats: true },
} satisfies Prisma.UserDefaultArgs;

export type UserWithChats = Prisma.UserGetPayload<typeof userWithChats>;
