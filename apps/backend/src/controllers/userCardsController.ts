import Facade from '@/services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserJwt, type UserJwtType } from '@/types/JWTObject.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { UserCollection } from '@/types/userCardObject.js';
import type { collectionBodyInterface } from '@/routes/api/v1/routeSchemas.js';

const facade = new Facade();

export default class UserCardsController {
  async addUserCards(
    request: FastifyRequest<{ Body: collectionBodyInterface }>,
    reply: FastifyReply,
  ): Promise<void> {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user_id = jwt.userId;
    const quantity: number | null = await facade.isCardOwned({
      user_id: user_id,
      card_id: request.body.card_id,
      quantity: 0,
      condition: null,
      for_trade: null,
    });

    const user_card = {
      user_id: user_id,
      card_id: request.body.card_id,
      quantity: quantity,
      condition: 'unmarked',
      for_trade: false,
    };

    await facade.addCard(user_card);
  }

  async getUserCards(
    request: FastifyRequest<{ Querystring: CardSearchQuery }>,
    reply: FastifyReply,
  ): Promise<UserCollection | null> {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const filters = request.query;
    const user_collection = await facade.getCollection(jwt.userId);

    if (user_collection !== null) {
      return reply.code(200).send({
        items: user_collection.items,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: user_collection.total,
          totalPages: Math.ceil(user_collection.total / filters.limit),
        },
      });
    }
    return null;
  }

  async updateUserCards(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {}
}
