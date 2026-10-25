import UserRepository from '@/persistence/userReposistory.js';
import CardRepository from '@/persistence/cardRepository.js';
import UserCardsRepository from '@/persistence/userCardsRepository.js';
import DeckRepository from '@/persistence/deckRepository.js';
import type { CardSummary } from '@/types/cardObject.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface } from '@/types/userObject.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { Deck, User, UserCard } from '@prisma/client';
import type { UserCollection } from '@/types/userCardObject.js';
import { hashPassword } from '@/utils/hashing.js';
import type {
  AuthSignupBody,
  deckCreationInterface,
  userDecks,
} from '@/routes/api/v1/routeSchemas.js';

export default class Facade {
  user_repo: UserRepository;
  card_repo: CardRepository;
  user_cards_repo: UserCardsRepository;
  deck_repo: DeckRepository;

  constructor() {
    this.user_repo = new UserRepository();
    this.card_repo = new CardRepository();
    this.user_cards_repo = new UserCardsRepository();
    this.deck_repo = new DeckRepository();
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

  /** User Cards Functions (Collections) */
  async addCard(user_card: UserCard): Promise<void> {
    await this.user_cards_repo.add(user_card);
  }

  async getCollection(user_id: string): Promise<UserCollection | null> {
    const collection = await this.user_cards_repo.get(user_id);
    if (collection !== null) {
      return collection;
    }
    return null;
  }

  async isCardOwned(
    user_id: string,
    card_id: string,
  ): Promise<UserCard | null> {
    return await this.user_cards_repo.isCardOwned(user_id, card_id);
  }

  async updateCard(user_card: UserCard): Promise<void> {
    await this.user_cards_repo.update(user_card);
  }

  /** Decks Functions */
  async createDeck(deck: deckCreationInterface): Promise<void> {
    await this.deck_repo.add(deck);
  }

  async getUserDecks(user_id: string): Promise<userDecks> {
    return await this.deck_repo.getUserDecks(user_id);
  }

  async getDeck(user_id: string, deck_id: string): Promise<Deck | null> {
    return await this.deck_repo.getDeck(user_id, deck_id);
  }
}
