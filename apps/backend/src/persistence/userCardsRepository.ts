import Repository from '@/persistence/reposistory.js';
import { prisma } from '@/utils/prisma.js';
import type { PrismaClient, UserCard } from '@prisma/client';
import { type UserCollection, userCardWithCards } from '@/types/userCardObject.js';

export default class UserCardsRepository extends Repository<UserCard> {
  db: PrismaClient;
  constructor() {
    super();
    this.db = prisma;
  }

  async add(user_card: UserCard): Promise<UserCard> {
    return await this.db.userCard.create({ data: user_card });
  }

  async getUserCard(user_id: string, card_id: string): Promise<UserCard | null> {
    const result = await this.db.userCard.findUnique({
      where: {
        user_id_card_id: {
          user_id: user_id,
          card_id: card_id,
        },
      },
    });
    return result;
  }

  async get(user_id: string): Promise<UserCollection | null> {
    const [items, total] = await this.db.$transaction([
      this.db.userCard.findMany({
        where: {
          user_id: user_id,
        },
        ...userCardWithCards,
      }),
      this.db.userCard.count({ where: { user_id: user_id } }),
    ]);
    return { items, total };
  }

  async update(user_card: UserCard) {
    await this.db.userCard.update({
      where: {
        user_id_card_id: {
          user_id: user_card.user_id,
          card_id: user_card.card_id,
        },
      },
      data: user_card,
    });
  }
}
