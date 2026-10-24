import Fastify from 'fastify';
import { UserIdParamsSchema, type UserIdParamsInterface } from './routeSchemas.js';
import UserController from '@/controllers/userController.js';
export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new UserController();

  fastify.get<{ Params: UserIdParamsInterface }>(
    '/:userId',
    { schema: { params: UserIdParamsSchema } },
    controller.getUserDetails,
  );

  fastify.patch<{ Body: {}; Params: UserIdParamsInterface }>(
    '/:userId',
    { preHandler: [fastify.jwt_verify], schema: { params: UserIdParamsSchema, body: {} } },
    controller.updateUserDetails,
  );

  fastify.delete<{ Body: {}; Params: UserIdParamsInterface }>(
    '/:userId',
    { preHandler: [fastify.jwt_verify], schema: { params: UserIdParamsSchema, body: {} } },
    controller.deleteUser,
  );
}
