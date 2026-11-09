import { Message } from '@prisma/client';
import { prisma } from '../../src/utils/prisma';

export async function createMessage(
  chatId: string,
  senderId: string,
  body: string,
): Promise<Message> {
  return await prisma.message.create({
    data: {
      body: body,
      chatId: chatId,
      senderId: senderId,
    },
  });
}

export async function createMessages(
  chatId: string,
  messages: Array<{ senderId: string; body: string }>,
): Promise<void> {
  await prisma.message.createMany({
    data: messages.map((x) => {
      return { chatId: chatId, senderId: x.senderId, body: x.body };
    }),
  });
}
