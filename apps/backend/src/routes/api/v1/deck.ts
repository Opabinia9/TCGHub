import Fastify from 'fastify';
import deckController from '@/controllers/deckController.js';
import {
  type deckCreationInterface,
  deckIdParamsSchema,
  type DeckIdParams,
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
    '/:id',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: deckIdParamsSchema },
    },
    controller.getDeck,
  );
}
