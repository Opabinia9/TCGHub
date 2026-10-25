import Fastify from 'fastify';
import deckController from '@/controllers/deckController.js';
import {
  type deckCreationInterface,
  deckIdParamsSchema,
  type DeckIdParams,
  type DeckCardParams,
  deckCardParamsSchema,
} from './routeSchemas.js';

const controller = new deckController();

export default async function deckRoutes(fastify: Fastify.FastifyInstance) {
  fastify.post<{ Body: deckCreationInterface }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.createDeck,
  );

  fastify.get(
    '/',
    {
      preHandler: [fastify.jwt_verify],
    },
    controller.getUserDecks,
  );

  fastify.get<{ Params: DeckIdParams }>(
    '/:id/cards',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.getDeck,
  );
  fastify.post<{ Params: DeckIdParams; Body: DeckCardParams }>(
    '/:id/cards',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema, body: deckCardParamsSchema },
    },
    controller.addDeckCard,
  );
  // fastify.patch<{ Params: DeckCardParams }>(
  //   '/:id/cards/:cardId',
  //   {
  //     preHandler: [fastify.jwt_verify],
  //     schema: { params: deckCardParamsSchema },
  //   },
  //   controller.updateDeckCard,
  // );
  // fastify.delete<{ Params: DeckCardParams }>(
  //   '/:id/cards/:cardId',
  //   {
  //     preHandler: [fastify.jwt_verify],
  //     schema: { params: deckIdParamsSchema },
  //   },
  //   controller.delDeckCard,
  // );
}
