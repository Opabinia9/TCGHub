import Fastify from 'fastify';
import { UserIdParamsSchema, type UserIdParamsInterface } from './routeSchemas.js';
import UserController from '@/controllers/userController.js';
import z from 'zod';
export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new UserController();

  fastify.get<{ Params: UserIdParamsInterface }>(
    '/:userId',
    {
      schema: {
        params: UserIdParamsSchema,
        response: {
          503: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Service Unavailable' }),
        },
      },
    },
    controller.getUserDetails,
  );

  fastify.patch<{ Params: UserIdParamsInterface }>(
    '/:userId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: UserIdParamsSchema,
        response: {
          503: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Service Unavailable' }),
        },
      },
    },
    controller.updateUserDetails,
  );

  fastify.delete<{ Params: UserIdParamsInterface }>(
    '/:userId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: UserIdParamsSchema,
        response: {
          503: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Service Unavailable' }),
        },
      },
    },
    controller.deleteUser,
  );
}
