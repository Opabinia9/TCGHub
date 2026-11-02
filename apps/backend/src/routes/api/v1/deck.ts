import Fastify from 'fastify';
import deckController from '@/controllers/deckController.js';
import {
  deckIdParamsSchema,
  type DeckIdParams,
  type DeckCardParams,
  deckCardParamsSchema,
  DeckBodySchema,
  type DeckBody,
  DeckCardBody,
} from './routeSchemas.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const controller = new deckController();

export default async function deckRoutes(fastify: Fastify.FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post<{ Body: DeckBody }>(
    '/',
    {
      onRequest: [fastify.jwt_verify],
      schema: { body: DeckBodySchema },
    },
    controller.createDeck,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete<{ Params: DeckIdParams }>(
    '/:deck_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.delDeck,
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch<{ Params: DeckIdParams; Body: DeckBody }>(
    '/:deck_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema, body: DeckBodySchema },
    },
    controller.updDeck,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.getUserDecks,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get<{ Params: DeckIdParams }>(
    '/:deck_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.getDeck,
  );

  fastify.withTypeProvider<ZodTypeProvider>().post<{ Params: DeckCardParams; Body: DeckCardBody }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema, body: DeckCardBody },
    },
    controller.addDeckCard,
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch<{ Params: DeckCardParams; Body: DeckCardBody }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema, body: DeckCardBody },
    },
    controller.updDeckCard,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete<{ Params: DeckCardParams }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema },
    },
    controller.delDeckCard,
  );
}
