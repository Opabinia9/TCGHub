import Fastify from 'fastify';
import type { CardSearchQuery } from '@/types/cardObject.js';
import { cardSearchQuerySchema, tradeParams, type TradeParamsInterface } from './routeSchemas.js';
import tradeController from '@/controllers/tradeController.js';

const controller = new tradeController();

export default async function tradeRoutes(fastify: Fastify.FastifyInstance) {
  fastify.get<{ Querystring: CardSearchQuery }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: { querystring: cardSearchQuerySchema },
    },
    controller.getTrades,
  );

  fastify.get<{ Params: TradeParamsInterface }>(
    '/:sellerId/:cardId',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: tradeParams,
      },
    },
    controller.getTradeDetails,
  );
}
