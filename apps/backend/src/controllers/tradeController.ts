import type { TradeParamsInterface } from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { UserCollection } from '@/types/userCardObject.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class tradeController {
  async getTrades(
    request: FastifyRequest<{ Querystring: CardSearchQuery }>,
    reply: FastifyReply,
  ): Promise<UserCollection | null> {
    const { userId } = request.retriveSession(request).session;
    const filters = request.query;
    const trades = await facade.getTrades(userId);

    if (trades !== null) {
      return reply.code(200).send({
        items: trades.items,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: trades.total,
          totalPages: Math.ceil(trades.total / filters.limit),
        },
      });
    }
    return null;
  }

  async getTradeDetails(
    request: FastifyRequest<{ Params: TradeParamsInterface }>,
    reply: FastifyReply,
  ) {
    const { sellerId, cardId } = request.params;
    const trade = await facade.getTrade(sellerId, cardId);
    if (!trade) {
      return reply.code(404).send({ error: 'Trade Not Found' });
    }
    reply.code(200).send({ success: 'success', trade: trade });
  }
}
