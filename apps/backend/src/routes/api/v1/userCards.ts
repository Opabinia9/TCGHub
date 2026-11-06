import Fastify from 'fastify';
import userCardsController from '@/controllers/userCardsController.js';
import {
  cardSearchQuerySchema,
  collectionBodyInterface,
  type CollectionBody,
} from './routeSchemas.js';
import type { CardSearchQuery } from '@/types/cardObject.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const controller = new userCardsController();

export default async function collectionRoutes(fastify: Fastify.FastifyInstance) {
  fastify.get<{ Querystring: CardSearchQuery }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: { querystring: cardSearchQuerySchema },
    },
    controller.getUserCards,
  );

  fastify.withTypeProvider<ZodTypeProvider>().post<{ Body: CollectionBody }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: { body: collectionBodyInterface },
    },
    controller.updateUserCards,
  );
}
