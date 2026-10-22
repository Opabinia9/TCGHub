import UserRepository from '@/persistence/userReposistory.js';
import ChatRepository from '@/persistence/chatReposistory.js';
import MessageRepository from '@/persistence/messageReposistory.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface, UserWithChats } from '@/types/userObject.js';
import CardRepository, { type CardSummary } from '@/persistence/cardRepository.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { User } from '@prisma/client';
import { hashPassword } from '@/utils/hashing.js';
import type { AuthSignupBody } from '@/routes/api/v1/routeSchemas.js';
import type { ChatWithMembersCreationInterface, ChatWithMessages } from '@/types/chatObject.js';
import type { MessageCreationInterface } from '@/types/MessageObject.js';

export default class Facade {
  userRepo: UserRepository;
  chatRepo: ChatRepository;
  messageRepo: MessageRepository;
  cardRepo: CardRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.chatRepo = new ChatRepository();
    this.messageRepo = new MessageRepository();
    this.cardRepo = new CardRepository();
  }

  /** User functions  */

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepo.get(userId);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.getUserByEmail(email);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError('User Not Found');
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepo.getUserByUsername(username);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError('User Not Found');
    }
  }

  /**
   *
   */
  async createUser(signupData: AuthSignupBody): Promise<void> {
    const { password, ...include } = signupData;
    const hash = await hashPassword(signupData.password);
    const userData: UserCreationInterface = { ...include, hash: hash };
    this.userRepo.add(userData);
  }

  async getUserWithChats(userId: string): Promise<UserWithChats> {
    const user = await this.userRepo.getUserWithChats(userId);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  async getChatWithMessages(chatId: string): Promise<ChatWithMessages> {
    const chat = await this.chatRepo.getChatWithMessages(chatId);

    // c8 ignore else
    if (chat !== null) {
      return chat;
    } else {
      // will not run as currently it is only called after chatId has been verified
      throw new NotFoundError(`Chat Not Found`);
    }
  }

  async createMessage(message: MessageCreationInterface): Promise<void> {
    await this.messageRepo.add(message);
  }

  async createChatWithMembers(chat: ChatWithMembersCreationInterface) {
    return await this.chatRepo.addChatWithMembers(chat);
  }

  /**  Card Functions */

  async searchId(id: string): Promise<CardSummary> {
    const card = await this.cardRepo.get(id);
    if (card === null) {
      throw new NotFoundError('Card not Found');
    }
    return card;
  }

  async searchCards(filters: CardSearchQuery) {
    return this.cardRepo.search(filters);
  }

  async listSets() {
    return this.cardRepo.listSets();
  }
}
