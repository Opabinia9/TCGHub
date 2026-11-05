import Fastify from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '@/utils/auth.js';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  fastify.route({
    method: ['GET', 'POST'],
    url: '/*',
    schema: { hide: true },
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const headers = fromNodeHeaders(request.headers);
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        fastify.log.error(`Authentication Error: ${error}`);
        return reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  });
}
