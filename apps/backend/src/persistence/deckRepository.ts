import Repository from '@/persistence/reposistory.js';
import type { DeckCardParams } from '@/routes/api/v1/routeSchemas.js';
import type { DeckCreationInterface, DeckRef, UserDecks } from '@/types/deckObject.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, Deck, DeckCard } from '@prisma/client';

export default class DeckRepository extends Repository<Deck> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(deck: DeckCreationInterface): Promise<Deck> {
    return await this.db.deck.create({
      data: {
        owner_id: deck.owner_id,
        deck_name: deck.deck_name,
      },
    });
  }

  async delDeck(deck: DeckRef): Promise<Deck> {
    return await this.db.deck.delete({
      where: {
        id: deck.id,
        owner_id: deck.owner_id,
      },
    });
  }

  async updDeck(deck: Deck): Promise<Deck | null> {
    await this.db.deck.update({
      where: {
        id: deck.id,
        owner_id: deck.owner_id,
      },
      data: deck,
    });
    return await this.db.deck.findUnique({
      where: deck,
    });
  }

  async getUserDecks(user_id: string): Promise<UserDecks> {
    return await this.db.deck.findMany({
      where: {
        owner_id: user_id,
      },
    });
  }

  async get(deckId: string): Promise<Deck | null> {
    return await this.db.deck.findUnique({
      where: {
        id: deckId,
      },
    });
  }

  async getDeck(deck: DeckRef): Promise<Deck | null> {
    return await this.db.deck.findFirst({
      where: {
        id: deck.id,
        owner_id: deck.owner_id,
      },
    });
  }

  async addDeckCard(owner_id: string, card: DeckCard): Promise<DeckCard | null> {
    return await this.db.deckCard.create({
      data: {
        quantity: card.quantity,
        Deck: { connect: { id: card.deck_id, owner_id } },
        Card: { connect: { id: card.card_id } },
      },
    });
  }

  async delDeckCard(owner_id: string, deck_card: DeckCardParams): Promise<void> {
    await this.db.deckCard.deleteMany({
      where: {
        deck_id: deck_card.deck_id,
        card_id: deck_card.card_id,
        Deck: {
          owner_id: owner_id,
        },
      },
    });
  }

  async updDeckCard(owner_id: string, deck_card: DeckCard): Promise<DeckCard> {
    return await this.db.deckCard.update({
      where: {
        deck_id_card_id: {
          deck_id: deck_card.deck_id,
          card_id: deck_card.card_id,
        },
        Deck: {
          owner_id: owner_id,
        },
      },
      data: {
        quantity: {
          increment: deck_card.quantity,
        },
      },
    });
  }
}
