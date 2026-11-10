import Facade from '@/services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { UserCollection } from '@/types/userCardObject.js';
import type { UserCard } from '@prisma/client';
import type { CollectionBody } from '@/routes/api/v1/routeSchemas.js';
import NotFoundError from '@/errortypes/NotFoundError.js';

const facade = new Facade();

export default class UserCardsController {
  async updateUserCards(request: FastifyRequest<{ Body: CollectionBody }>): Promise<UserCard> {
    const { userId } = request.retriveSession(request).session;
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
      return await facade.updateCard(user_card); /* Primary Key Exists! -> Update */
    } else {
      const user_card = {
        user_id: userId,
        card_id: request.body.card_id,
        quantity: request.body.quantity ?? 1,
        condition: request.body.condition ?? 'unmarked',
        for_trade: request.body.for_trade ?? false,
        wishlist: request.body.wishlist ?? false,
      };
      return await facade.addCard(user_card);
    }
  }

  async getUserCards(
    request: FastifyRequest<{ Querystring: CardSearchQuery }>,
    reply: FastifyReply,
  ): Promise<UserCollection | null> {
    const { userId } = request.retriveSession(request).session;
    const filters = request.query;
    const user_collection = await facade.getCollection(userId);

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

  async getUserTrades(
    request: FastifyRequest<{ Querystring: CardSearchQuery }>,
    reply: FastifyReply,
  ): Promise<UserCollection | null> {
    const { userId } = request.retriveSession(request).session;
    const filters = request.query;
    const user_trades = await facade.getUserTrades(userId);

    if (user_trades !== null) {
      return reply.code(200).send({
        items: user_trades.items,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: user_trades.total,
          totalPages: Math.ceil(user_trades.total / filters.limit),
        },
      });
    }
    return null;
  }

  async getWishlist(
    request: FastifyRequest<{ Querystring: CardSearchQuery }>,
    reply: FastifyReply,
  ): Promise<UserCollection | null> {
    const { userId } = request.retriveSession(request).session;
    const filters = request.query;
    const wishlist = await facade.getWishlist(userId);

    if (wishlist !== null) {
      return reply.code(200).send({
        items: wishlist.items,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: wishlist.total,
          totalPages: Math.ceil(wishlist.total / filters.limit),
        },
      });
    }
    return null;
  }
}
