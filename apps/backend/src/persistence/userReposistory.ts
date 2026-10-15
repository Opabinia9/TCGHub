import Repository from '@/persistence/reposistory.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, User } from '@prisma/client';
import {
  userWithChats,
  type UserCreationInterface,
  type UserWithChats,
} from '@/types/userObject.js';

export default class UserRepository extends Repository<User> {
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

  async get(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        id: id,
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

  async getUserWithChats(id: string): Promise<UserWithChats | null> {
    return this.db.user.findUnique({
      where: {
        id: id,
      },
      ...userWithChats,
    });
  }
}
