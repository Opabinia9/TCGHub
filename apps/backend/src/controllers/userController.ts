import type { UserIdParamsInterface } from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class UserController {
  async getUserDetails(
    request: FastifyRequest<{ Params: UserIdParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async updateUserDetails(
    request: FastifyRequest<{ Params: UserIdParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async deleteUser(
    request: FastifyRequest<{ Params: UserIdParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }
}
