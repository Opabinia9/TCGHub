import type { Prisma, Chat } from '@prisma/client';

export type ChatCreationInterface = Pick<Chat, 'title' | 'type'>;

export const chatWithMessages = {
  include: { messages: true },
} satisfies Prisma.ChatDefaultArgs;

export type ChatWithChats = Prisma.ChatGetPayload<typeof chatWithMessages>;
