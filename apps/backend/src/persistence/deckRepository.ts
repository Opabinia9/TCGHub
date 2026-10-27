import Repository from '@/persistence/reposistory.js';
import type { DeckCardParams } from '@/routes/api/v1/routeSchemas.js';
import type { DeckCreationInterface, DeckRef, userDecks } from '@/types/deckObject.js';
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

  async delDeck(deck: DeckRef): Promise<void> {
    await this.db.deck.delete({
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

  async getUserDecks(user_id: string): Promise<userDecks> {
    const user_decks = await this.db.deck.findMany({
      where: {
        owner_id: user_id,
      },
    });
    return user_decks;
  }

  async getDeck(deck: DeckRef): Promise<Deck | null> {
    return await this.db.deck.findFirst({
      where: {
        id: deck.id,
        owner_id: deck.owner_id,
      },
    });
  }

  async addDeckCard(card: DeckCard): Promise<DeckCard | null> {
    return await this.db.deckCard.create({ data: card });
  }

  async delDeckCard(deck_card: DeckCardParams): Promise<void> {
    await this.db.deckCard.delete({
      where: {
        deck_id_card_id: {
          deck_id: deck_card.deck_id,
          card_id: deck_card.card_id,
        },
      },
    });
  }

  async updDeckCard(deck_card: DeckCard): Promise<DeckCard | null> {
    const existing_card = await this.db.deckCard.findUnique({
      where: {
        deck_id_card_id: {
          deck_id: deck_card.deck_id,
          card_id: deck_card.card_id,
        },
      },
    });

    if (existing_card !== null) {
      existing_card.quantity += deck_card.quantity;
      return await this.db.deckCard.update({
        where: {
          deck_id_card_id: {
            deck_id: existing_card.deck_id,
            card_id: existing_card.card_id,
          },
        },
        data: existing_card,
      });
    }
    return null;
  }
}
