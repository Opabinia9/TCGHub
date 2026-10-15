import Repository from '@/persistence/reposistory.js';
import { chatWithMessages, type ChatWithMessages } from '@/types/chatObject.js';
import { prisma } from '@/utils/prisma.js';
import type { Chat, PrismaClient } from '@prisma/client';

export default class ChatRepository extends Repository<Chat> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(chat: any): Promise<void> {
    this.db.chat.create({
      data: chat,
    });
  }

  async get(chatId: string): Promise<Chat | null> {
    return this.db.chat.findUnique({
      where: {
        id: chatId,
      },
    });
  }

  async getChatWithMessages(chatID: string): Promise<ChatWithMessages | null> {
    return this.db.chat.findUnique({
      where: {
        id: chatID,
      },
      ...chatWithMessages,
    });
  }
}
