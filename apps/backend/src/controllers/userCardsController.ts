import Facade from '@/services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserJwt, type UserJwtType } from '@/types/JWTObject.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { UserCollection } from '@/types/userCardObject.js';
import type { UserCard } from '@prisma/client';
import type { CollectionBody } from '@/routes/api/v1/routeSchemas.js';
import NotFoundError from '@/errortypes/NotFoundError.js';

const facade = new Facade();

export default class UserCardsController {
  async updateUserCards(
    request: FastifyRequest<{ Body: CollectionBody }>,
  ): Promise<UserCard> {
    const { userId } = UserJwt.parse(request.user);
    let quantity: number = request.body.quantity;

    let record: UserCard | null = null;
    try {
      record = await facade.getUserCard(userId, request.body.card_id);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }
    if (record !== null) {
      if (quantity < 0 && Math.abs(quantity) > record.quantity) {
        quantity = -1 * record.quantity;
      }
      if (request.body.for_trade && request.body.wishlist) {
        if (record.wishlist) {
          request.body.for_trade = false;
        } else {
          request.body.wishlist = false;
        }
      }
      const user_card = {
        user_id: record.user_id,
        card_id: record.card_id,
        quantity: record.quantity === null ? 1 : record.quantity + quantity,
        condition: request.body.condition ?? record.condition,
        for_trade: request.body.for_trade,
        wishlist: request.body.wishlist,
      };
      return await facade.updateCard(
        user_card,
      ); /* Primary Key Exists! -> Update */
    } else {
      const user_card = {
        user_id: userId,
        card_id: request.body.card_id,
        quantity: 1,
        condition: 'unmarked',
        for_trade: false,
        wishlist: false,
      };
      return await facade.addCard(user_card);
    }
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
}
