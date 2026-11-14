import { type Prisma, type Chat, ChatType } from '@prisma/client';
import { z } from 'zod';

export type ChatCreationInterface = Pick<
  Chat,
  'name' | 'type' | 'sellerId' | 'cardId' | 'directKey'
>;

const chatWithMembersCreationZod = z.discriminatedUnion('type', [
  z.object({
    type: z.enum([ChatType.TRADE]),
    members: z.array(z.string()).length(2),
    directKey: z.string(),
    sellerId: z.string(),
    cardId: z.string(),
  }),
  z.object({
    type: z.enum([ChatType.DIRECT]),
    members: z.array(z.string()).length(2),
    directKey: z.string(),
  }),
  z.object({
    type: z.enum([ChatType.GROUP]),
    name: z.string(),
    members: z.array(z.string()).min(2),
  }),
]);

export type ChatWithMembersCreationInterface = z.infer<typeof chatWithMembersCreationZod>;

export const chatWithMessages = {
  include: { messages: true, members: { include: { User: true } } },
} satisfies Prisma.ChatDefaultArgs;

export type ChatWithMessages = Prisma.ChatGetPayload<typeof chatWithMessages>;

export const chatWithMembers = {
  include: { members: { include: { User: true } } },
} satisfies Prisma.ChatDefaultArgs;

export type ChatWithMembers = Prisma.ChatGetPayload<typeof chatWithMembers>;
