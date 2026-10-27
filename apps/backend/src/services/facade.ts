import UserRepository from '@/persistence/userReposistory.js';
import CardRepository from '@/persistence/cardRepository.js';
import UserCardsRepository from '@/persistence/userCardsRepository.js';
import DeckRepository from '@/persistence/deckRepository.js';
import type { CardSummary } from '@/types/cardObject.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { UserCreationInterface } from '@/types/userObject.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { Deck, DeckCard, User, UserCard } from '@prisma/client';
import type { UserCollection } from '@/types/userCardObject.js';
import { hashPassword } from '@/utils/hashing.js';
import type { AuthSignupBody, DeckCardParams } from '@/routes/api/v1/routeSchemas.js';
import type { DeckCreationInterface, DeckRef, userDecks } from '@/types/deckObject.js';

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
    const cards = this.card_repo.search(filters);
    if (cards === null) {
      throw new NotFoundError('No Cards Found');
    }
    return cards;
  }

  async listSets() {
    const sets = this.card_repo.listSets();
    if (sets === null) {
      throw new NotFoundError('No Sets Found');
    }
    return sets;
  }

  /** User Cards Functions (Collections) */
  async addCard(user_card: UserCard): Promise<void> {
    const card = await this.user_cards_repo.add(user_card);
    if (card === null) {
      throw new NotFoundError('Card Not Added');
    }
    return card;
  }

  async getCollection(user_id: string): Promise<UserCollection | null> {
    const collection = await this.user_cards_repo.get(user_id);
    if (collection !== null) {
      return collection;
    }
    return null;
  }

  async getUserCard(user_id: string, card_id: string): Promise<UserCard | null> {
    const card = await this.user_cards_repo.getUserCard(user_id, card_id);
    if (card === null) {
      return null;
    }
    return card;
  }

  async updateCard(user_card: UserCard): Promise<void> {
    const card = await this.user_cards_repo.update(user_card);
    if (card === null) {
      throw new NotFoundError('Card Not Updated');
    }
    return card;
  }

  /** Decks Functions */
  async createDeck(deck: DeckCreationInterface): Promise<void> {
    const new_deck = await this.deck_repo.add(deck);
    if (deck === null) {
      throw new Error('Deck Not Added');
    }
    return new_deck;
  }

  async delDeck(deck: DeckRef): Promise<void> {
    await this.deck_repo.delDeck(deck);
  }

  async updDeck(deck: Deck): Promise<Deck | null> {
    const updated_deck = await this.deck_repo.updDeck(deck);
    if (updated_deck === null) {
      throw new NotFoundError('Deck Not Updated');
    }
    return updated_deck;
  }

  async getUserDecks(user_id: string): Promise<userDecks> {
    const user_decks = await this.deck_repo.getUserDecks(user_id);
    if (user_decks === null) {
      throw new NotFoundError('No Decks Found');
    }
    return user_decks;
  }

  async getDeck(deck: DeckRef): Promise<Deck | null> {
    const user_deck = await this.deck_repo.getDeck(deck);
    if (user_deck === null) {
      throw new NotFoundError('Deck Not Found');
    }
    return user_deck;
  }

  async addDeckCard(deck_card: DeckCard): Promise<DeckCard | null> {
    const new_deck_card = await this.deck_repo.addDeckCard(deck_card);
    if (new_deck_card === null) {
      throw new NotFoundError('Card Not Added');
    }
    return new_deck_card;
  }

  async delDeckCard(deck_card: DeckCardParams): Promise<void> {
    await this.deck_repo.delDeckCard(deck_card);
  }

  async updDeckCard(deck_card: DeckCard): Promise<DeckCard | null> {
    const updated_deck_card = await this.deck_repo.updDeckCard(deck_card);
    if (updated_deck_card === null) {
      throw new NotFoundError('Deck Not Updated');
    }
    return updated_deck_card;
  }
}
