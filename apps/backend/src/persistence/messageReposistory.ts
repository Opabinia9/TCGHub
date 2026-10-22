import Repository from '@/persistence/reposistory.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, Message } from '@prisma/client';
import type { MessageCreationInterface } from '@/types/MessageObject.js';

export default class MessageRepository extends Repository<Message> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(message: MessageCreationInterface): Promise<void> {
    await this.db.message.create({
      data: message,
    });
  }

  // nothing currently uses this function, it is kept to match the abstract and for future use
  async get(MessageId: string): Promise<Message | null> {
    return this.db.message.findUnique({
      where: {
        id: MessageId,
      },
    });
  }
}
