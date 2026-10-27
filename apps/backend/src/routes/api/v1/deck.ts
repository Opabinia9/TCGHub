import Fastify from 'fastify';
import deckController from '@/controllers/deckController.js';
import {
  deckIdParamsSchema,
  type DeckIdParams,
  type DeckCardParams,
  deckCardParamsSchema,
  type deckBodyInterface,
  DeckCardSchema,
  DeckBodySchema,
} from './routeSchemas.js';
import type { DeckCardInterface } from '@/types/deckObject.js';

const controller = new deckController();

export default async function deckRoutes(fastify: Fastify.FastifyInstance) {
  fastify.post<{ Body: deckBodyInterface }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.createDeck,
  );

  fastify.delete<{ Params: DeckIdParams }>(
    '/:deck_id/cards/',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.delDeck,
  );

  fastify.patch<{ Params: DeckIdParams; Body: deckBodyInterface }>(
    '/:deck_id/cards/',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema, body: DeckBodySchema },
    },
    controller.updDeck,
  );

  fastify.get(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.getUserDecks,
  );

  fastify.get<{ Params: DeckIdParams }>(
    '/:deck_id/cards',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.getDeck,
  );

  fastify.post<{ Params: DeckCardParams; Body: DeckCardInterface }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema, body: DeckCardSchema },
    },
    controller.addDeckCard,
  );

  fastify.patch<{ Params: DeckCardParams; Body: DeckCardInterface }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema },
    },
    controller.updDeckCard,
  );

  fastify.delete<{ Params: DeckCardParams }>(
    '/:deck_id/cards/:card_id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckCardParamsSchema },
    },
    controller.delDeckCard,
  );
}
