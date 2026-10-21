import Fastify from 'fastify';
import userCardsController from '@/controllers/userCardsController.js';
import {
  cardSearchQuerySchema,
  type collectionBodyInterface,
} from './routeSchemas.js';
import type { CardSearchQuery } from '@/types/cardObject.js';

const controller = new userCardsController();

export default async function collectionRoutes(
  fastify: Fastify.FastifyInstance,
) {
  fastify.get<{ Querystring: CardSearchQuery }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: { querystring: cardSearchQuerySchema },
    },
    controller.getUserCards,
  );

  fastify.post<{ Body: collectionBodyInterface }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.updateUserCards,
  );
}
