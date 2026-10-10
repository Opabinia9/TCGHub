import repository from '@persistence/reposistory.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, User } from '@prisma/client';
import type { UserCreationInterface } from '@/types/userObject.js';

export default class user_repository extends repository<User> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(user: UserCreationInterface): Promise<void> {
    await this.db.user.create({
      data: user,
    });
  }

  async get(userID: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        id: userID,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        username: username,
      },
    });
  }
}
