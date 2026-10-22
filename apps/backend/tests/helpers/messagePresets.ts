import { Prisma } from '@prisma/client';
import { prisma } from '../../src/utils/prisma';

export async function createMessage(chatId: string, senderId: string, body: string): Promise<void> {
  await prisma.message.create({
    data: {
      body: body,
      chat_id: chatId,
      sender_id: senderId,
    },
  });
}

export async function createMessages(
  chatId: string,
  messages: Array<{ sender_id: string; body: string }>,
): Promise<void> {
  await prisma.message.createMany({
    data: messages.map((x) => {
      return { chat_id: chatId, sender_id: x.sender_id, body: x.body };
    }),
  });
}
