import type { Message } from '@prisma/client';

export type MessageCreationInterface = Pick<Message, 'chatId' | 'senderId' | 'body'>;
