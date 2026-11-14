import UserRepository from '@/persistence/userReposistory.js';
import CardRepository from '@/persistence/cardRepository.js';
import UserCardsRepository from '@/persistence/userCardsRepository.js';
import DeckRepository from '@/persistence/deckRepository.js';
import ChatRepository from '@/persistence/chatReposistory.js';
import MessageRepository from '@/persistence/messageReposistory.js';
import NotFoundError from '@/errortypes/NotFoundError.js';
import type { ChatMember, Deck, DeckCard, Message, User, UserCard } from '@prisma/client';
import type { AuthSignupBody, DeckCardParams } from '@/routes/api/v1/routeSchemas.js';
import type { UserCreationInterface, UserWithChats } from '@/types/userObject.js';
import type { ChatWithMembersCreationInterface, ChatWithMessages } from '@/types/chatObject.js';
import type { MessageCreationInterface } from '@/types/MessageObject.js';
import type { CardSearchQuery, CardSummary } from '@/types/cardObject.js';
import type { DeckCards, DeckCreationInterface, DeckRef, UserDecks } from '@/types/deckObject.js';
import type { UserCollection } from '@/types/userCardObject.js';
import ChatMemberRepository from '@/persistence/chatMemberRepository.js';

export default class Facade {
  userRepo: UserRepository;
  chatRepo: ChatRepository;
  chatMemberRepo: ChatMemberRepository;
  messageRepo: MessageRepository;
  cardRepo: CardRepository;
  userCardsRepo: UserCardsRepository;
  deckRepo: DeckRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.chatRepo = new ChatRepository();
    this.chatMemberRepo = new ChatMemberRepository();
    this.messageRepo = new MessageRepository();
    this.cardRepo = new CardRepository();
    this.userCardsRepo = new UserCardsRepository();
    this.deckRepo = new DeckRepository();
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
    const userData: UserCreationInterface = signupData;
    await this.userRepo.add(userData);
  }

  async getUserWithChats(userId: string): Promise<UserWithChats> {
    const user = await this.userRepo.getUserWithChats(userId);

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError(`User Not Found`);
    }
  }

  /** Chat Functions */

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

  async createMessage(message: MessageCreationInterface): Promise<Message> {
    return await this.messageRepo.add(message);
  }

  async createChatWithMembers(chat: ChatWithMembersCreationInterface) {
    return await this.chatRepo.addChatWithMembers(chat);
  }

  async getChatMembers(chatId: string): Promise<Array<ChatMember>> {
    return await this.chatMemberRepo.getChatMembers(chatId);
  }

  async UpdateLastReadMessage(chatId: string, userId: string, messageId: string) {
    return await this.chatMemberRepo.UpdateLastReadMessage(chatId, userId, messageId);
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
    const cards = this.cardRepo.search(filters);
    if (cards === null) {
      throw new NotFoundError('No Cards Found');
    }
    return cards;
  }

  async listSets() {
    const sets = this.cardRepo.listSets();
    if (sets === null) {
      throw new NotFoundError('No Sets Found');
    }
    return sets;
  }

  /** User Cards Functions (Collections) */
  async addCard(user_card: UserCard): Promise<UserCard> {
    const card = await this.userCardsRepo.add(user_card);
    if (card === null) {
      throw new NotFoundError('Card Not Added');
    }
    return card;
  }

  async getCollection(user_id: string): Promise<UserCollection> {
    return await this.userCardsRepo.getUserCollection(user_id);
  }

  async getTrades(user_id: string): Promise<UserCollection> {
    return await this.userCardsRepo.getTrades(user_id);
  }

  async getTrade(sellerId: string, cardId: string) {
    return await this.userCardsRepo.getTrade(sellerId, cardId);
  }

  async getUserTrades(user_id: string): Promise<UserCollection> {
    return await this.userCardsRepo.getUserTrades(user_id);
  }

  async getWishlist(user_id: string): Promise<UserCollection> {
    return await this.userCardsRepo.getWishlist(user_id);
  }

  async getUserCard(user_id: string, card_id: string): Promise<UserCard> {
    const user_card = await this.userCardsRepo.get(user_id, card_id);
    if (user_card === null) {
      throw new NotFoundError('Card not found');
    }
    return user_card;
  }

  async updateCard(user_card: UserCard): Promise<UserCard> {
    const updated_card = await this.userCardsRepo.update(user_card);
    if (updated_card === null) {
      throw new NotFoundError('Card not found');
    }
    return updated_card;
  }

  /** Decks Functions */
  async createDeck(deck: DeckCreationInterface): Promise<Deck> {
    return await this.deckRepo.add(deck);
  }

  async delDeck(deck: DeckRef): Promise<Deck | void> {
    return await this.deckRepo.delDeck(deck);
  }

  async updDeck(deck: Deck): Promise<Deck> {
    const updated_deck = await this.deckRepo.updDeck(deck);
    if (updated_deck === null) {
      throw new NotFoundError('Deck Not Updated');
    }
    return updated_deck;
  }

  async getUserDecks(user_id: string): Promise<UserDecks> {
    const user_decks = await this.deckRepo.getUserDecks(user_id);
    if (user_decks === null) {
      throw new NotFoundError('No Decks Found');
    }
    return user_decks;
  }

  async getDeck(deck: DeckRef): Promise<Deck> {
    const user_deck = await this.deckRepo.getDeck(deck);
    if (user_deck === null) {
      throw new NotFoundError('Deck Not Found');
    }
    return user_deck;
  }

  async getDeckCards(deck: DeckRef): Promise<DeckCards> {
    const deck_cards = await this.deckRepo.getDeckCards(deck);
    if (deck_cards === null) {
      throw new NotFoundError('Deck Contents Not Found');
    }
    return deck_cards;
  }

  async addDeckCard(owner_id: string, deck_card: DeckCard): Promise<DeckCard> {
    const new_deck_card = await this.deckRepo.addDeckCard(owner_id, deck_card);
    if (new_deck_card === null) {
      throw new NotFoundError('Card Not Added');
    }
    return new_deck_card;
  }

  async delDeckCard(owner_id: string, deck_card: DeckCardParams): Promise<DeckCard | void> {
    await this.deckRepo.delDeckCard(owner_id, deck_card);
  }

  async updDeckCard(owner_id: string, deck_card: DeckCard): Promise<DeckCard> {
    const updated_deck_card = await this.deckRepo.updDeckCard(owner_id, deck_card);
    if (updated_deck_card === null) {
      throw new NotFoundError('Deck Not Updated');
    }
    return updated_deck_card;
  }
}
