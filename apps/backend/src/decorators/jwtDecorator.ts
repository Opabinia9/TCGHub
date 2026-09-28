import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    jwt_verify(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

export default function registerJwtDecorator(fastify: FastifyInstance) {
  fastify.decorate('jwt_verify', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}
