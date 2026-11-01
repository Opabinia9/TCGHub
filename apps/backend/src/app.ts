import Fastify from 'fastify';
import fastify_jwt from '@fastify/jwt';
import authRoutes from '@/routes/api/v1/auth.js';
import cardRoutes from '@/routes/api/v1/cards.js';
import collectionRoutes from './routes/api/v1/userCards.js';
import deckRoutes from './routes/api/v1/deck.js';
import registerJwtDecorator from '@/decorators/jwtDecorator.js';
import { validateDatabaseConnection } from './utils/validateDatabaseConnection.js';
import type { Env } from '@/utils/env.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyTypeProviderDefault,
  RawServerDefault,
} from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export default async function buildServer(
  opts = {},
  env: Env,
): Promise<
  FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    FastifyTypeProviderDefault
  >
> {
  const server: Fastify.FastifyInstance = Fastify(opts);
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler(
    (
      error: PrismaClientKnownRequestError,
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      if (error.code === 'P2025' || error.code === 'P2003') {
        return reply.code(404).send({ error: 'Not found' });
      }
      if (error.code === 'P2002') {
        return reply.code(409).send({ error: 'Record exists' });
      }
      return reply.send(error);
    },
  );

  registerJwtDecorator(server);

  server.register(fastify_jwt, { secret: env.SERVER_SECRET });
  server.register(authRoutes, { prefix: '/api/v1/auth' });
  server.register(cardRoutes, { prefix: '/api/v1/cards' });
  server.register(collectionRoutes, { prefix: '/api/v1/collection' });
  server.register(deckRoutes, { prefix: '/api/v1/decks' });

  await validateDatabaseConnection();
  return server;
}
