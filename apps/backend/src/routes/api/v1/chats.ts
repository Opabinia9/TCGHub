import Fastify from 'fastify';
import chatController from '@/controllers/chatController.js';
import { chatCreationBodySchema, chatParamsSchema, chatPostBodySchema } from './routeSchemas.js';
import type { ChatParamsInterface, ChatPostBodyInterface } from './routeSchemas.js';
import type { ChatWithMembersCreationInterface } from '@/types/chatObject.js';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new chatController();

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId',
    { preHandler: [fastify.jwt_verify], schema: { params: chatParamsSchema } },
    controller.getChat,
  );

  fastify.post<{ Params: ChatParamsInterface; Body: ChatPostBodyInterface }>(
    '/:chatId',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: chatParamsSchema, body: chatPostBodySchema },
    },
    controller.postMessage,
  );

  fastify.post<{ Body: ChatWithMembersCreationInterface }>(
    '/',
    { preHandler: [fastify.jwt_verify], schema: { body: chatCreationBodySchema } },
    controller.postChat,
  );
}
