import Repository from '@/persistence/reposistory.js';
import {
  chatWithMessages,
  type ChatWithMembersCreationInterface,
  type ChatWithMessages,
} from '@/types/chatObject.js';
import { prisma } from '@/utils/prisma.js';
import { PrismaClient } from '@prisma/client';
import type { Chat } from '@prisma/client';

export default class ChatRepository extends Repository<Chat> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  // nothing currently uses this function, it is kept to match the abstract and for future use
  async add(chat: any): Promise<Chat> {
    return await this.db.chat.create({
      data: chat,
    });
  }

  async addChatWithMembers(chat: ChatWithMembersCreationInterface): Promise<Chat> {
    return this.db.chat.create({
      data: {
        name: chat.type === 'GROUP' ? chat.name : null,
        type: chat.type,
        directKey: chat.type !== 'GROUP' ? chat.directKey : null,
        sellerId: chat.type === 'TRADE' ? chat.sellerId : null,
        cardId: chat.type === 'TRADE' ? chat.cardId : null,
        members: {
          create: chat.members.map((memberId) => {
            return {
              User: {
                connect: {
                  id: memberId,
                },
              },
            };
          }),
        },
      },
    });
  }

  // nothing currently uses this function, it is kept to match the abstract and for future use
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
