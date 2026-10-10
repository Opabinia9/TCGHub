import Fastify from 'fastify';
import fastify_jwt from '@fastify/jwt';
import authRoutes from '@/routes/api/v1/auth.js';
import registerJwtDecorator from '@/decorators/jwtDecorator.js';
import { ENV } from './utils/env.js';

export default function buildServer(opts = {}) {
  const server: Fastify.FastifyInstance = Fastify(opts);

  registerJwtDecorator(server);

  server.register(fastify_jwt, { secret: ENV.SERVER_SECRET });
  server.register(authRoutes, { prefix: '/api/v1/auth' });

  return server;
}
