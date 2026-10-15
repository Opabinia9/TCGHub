import UserRepository from '@/persistence/userReposistory.js';
import ChatRepository from '@/persistence/chatReposistory.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface, UserWithChats } from '@/types/userObject.js';
import type { User } from '@prisma/client';
import { hashPassword } from '@/utils/hashing.js';
import type { AuthSignupBody } from '@/routes/api/v1/routeSchemas.js';
import type { ChatWithMessages } from '@/types/chatObject.js';

export default class Facade {
  user_repo: UserRepository;
  chatRepo: ChatRepository;

  constructor() {
    this.user_repo = new UserRepository();
    this.chatRepo = new ChatRepository();
  }

  /** User functions  */

  async getUser(userId: string): Promise<User> {
    const user = await this.user_repo.get(userId);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.user_repo.getUserByEmail(email);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.user_repo.getUserByUsername(username);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  /**
   *
   */
  async createUser(signupData: AuthSignupBody): Promise<void> {
    const { password, ...include } = signupData;
    const hash = await hashPassword(signupData.password);
    const userData: UserCreationInterface = { ...include, hash: hash };
    this.user_repo.add(userData);
  }

  async getUserWithChats(userId: string): Promise<UserWithChats> {
    const user = await this.user_repo.getUserWithChats(userId);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  async getChatWithMessages(chatId: string): Promise<ChatWithMessages> {
    const chat = await this.chatRepo.getChatWithMessages(chatId);

    if (chat !== null) {
      return chat;
    } else {
      throw new NotFoundError(`Chat Not Found`);
    }
  }
}
