import userRepository from '@/persistence/userReposistory.js';
import CardRepository, { type CardSummary } from '@/persistence/cardRepository.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface } from '@/types/userObject.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { User } from '@prisma/client';
import { hashPassword } from '@/utils/hashing.js';
import type { AuthSignupBody } from '@/routes/api/v1/routeSchemas.js';

export default class Facade {
  user_repo: userRepository;
  card_repo: CardRepository;

  constructor() {
    this.user_repo = new userRepository();
    this.card_repo = new CardRepository();
  }

  /** User functions  */

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.user_repo.getUserByEmail(email);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError('User Not Found');
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.user_repo.getUserByUsername(username);

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
    this.user_repo.add(userData);
  }

  /**  Card Functions */

  async searchId(id: string): Promise<CardSummary> {
    const card = await this.card_repo.get(id);
    if (card === null) {
      throw new NotFoundError('Card not Found');
    }
    return card;
  }

  async searchCards(filters: CardSearchQuery) {
    return this.card_repo.search(filters);
  }

  async listSets() {
    return this.card_repo.listSets();
  }
}
