import { auth } from '@/utils/auth.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
  interface FastifyRequest {
    session: Awaited<ReturnType<typeof auth.api.getSession>>;
    retriveSession: (
      request: FastifyRequest,
    ) => NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
  }
}

export default function registerAuthDecorator(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    request.session = session;
  });

  /* c8 ignore next */
  fastify.decorateRequest('retriveSession', (request: FastifyRequest) => {
    if (!request.session) {
      throw new Error('retriveSession used on an unprotected route');
    }
    return request.session;
  });
}
