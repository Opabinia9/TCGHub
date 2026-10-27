import type { Prisma, Chat } from '@prisma/client';

export type ChatCreationInterface = Pick<Chat, 'title' | 'type'>;

export type ChatWithMembersCreationInterface = ChatCreationInterface & { members: Array<string> };

export const chatWithMessages = {
  include: { messages: true },
} satisfies Prisma.ChatDefaultArgs;

export type ChatWithMessages = Prisma.ChatGetPayload<typeof chatWithMessages>;

export const chatWithMembers = {
  include: { members: true },
} satisfies Prisma.ChatDefaultArgs;

export type ChatWithMembers = Prisma.ChatGetPayload<typeof chatWithMembers>;
