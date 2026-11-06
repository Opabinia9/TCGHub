import Fastify from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '@/utils/auth.js'; // Your Better Auth instance

export default async function testRoutes(fastify: Fastify.FastifyInstance, options: object) {
  fastify.get('/api/me', async (request, reply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    return reply.send(session);
  });
}
