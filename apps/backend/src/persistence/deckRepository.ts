import Repository from '@/persistence/reposistory.js';
import type {
  deckCreationInterface,
  userDecks,
} from '@/routes/api/v1/routeSchemas.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, Deck } from '@prisma/client';

export default class DeckRepository extends Repository<Deck> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(deck: deckCreationInterface): Promise<void> {
    await this.db.deck.create({ data: deck });
  }

  async getUserDecks(user_id: string): Promise<userDecks> {
    const user_decks = await this.db.deck.findMany({
      where: {
        owner_id: user_id,
      },
    });
    return user_decks;
  }

  async getDeck(user_id: string, deck_id: string): Promise<Deck | null> {
    return await this.db.deck.findFirst({
      where: {
        owner_id: user_id,
        id: deck_id,
      },
    });
  }
}
