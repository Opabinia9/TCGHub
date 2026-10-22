import type { Message } from '@prisma/client';

export type MessageCreationInterface = Pick<Message, 'chat_id' | 'sender_id' | 'body'>;
