import Fastify from 'fastify';
import fastify_jwt from '@fastify/jwt';
import authRoutes from '@/routes/api/v1/auth.js';
import registerJwtDecorator from '@/decorators/jwtDecorator.js';
import { validateDatabaseConnection } from './utils/validateDatabaseConnection.js';
import type { Env } from '@/utils/env.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
  RawServerDefault,
} from 'fastify';

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

  registerJwtDecorator(server);

  server.register(fastify_jwt, { secret: env.SERVER_SECRET });
  server.register(authRoutes, { prefix: '/api/v1/auth' });

  await validateDatabaseConnection();
  return server;
}
