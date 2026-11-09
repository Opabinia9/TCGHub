import type { ChatMember, PrismaClient } from '@prisma/client';
import Repository from './reposistory.js';
import { prisma } from '@/utils/prisma.js';
export default class ChatMemberRepository extends Repository<ChatMember> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(chatMember: Omit<ChatMember, 'joinedAt'>): Promise<ChatMember> {
    return await this.db.chatMember.create({
      data: chatMember,
    });
  }

  async get(chatId: string, userId: string): Promise<ChatMember | null> {
    return await this.db.chatMember.findUnique({
      where: {
        chatId_userId: { chatId, userId },
      },
    });
  }

  async UpdateLastReadMessage(
    chatId: string,
    userId: string,
    messageId: string,
  ): Promise<ChatMember> {
    return await this.db.chatMember.update({
      where: {
        chatId_userId: { chatId, userId },
      },
      data: {
        lastReadMessageId: messageId,
      },
    });
  }
}
