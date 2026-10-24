import Fastify from 'fastify';
import chatController from '@/controllers/chatController.js';
import {
  chatCreationBodySchema,
  chatParamsSchema,
  chatPostMessageBodySchema,
} from './routeSchemas.js';
import type {
  ChatCreationBodyInterface,
  ChatParamsInterface,
  ChatPostMessageBodyInterface,
} from './routeSchemas.js';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new chatController();

  fastify.get('/', { preHandler: [fastify.jwt_verify] }, controller.getChats);

  fastify.post<{ Body: ChatCreationBodyInterface }>(
    '/',
    { preHandler: [fastify.jwt_verify], schema: { body: chatCreationBodySchema } },
    controller.createChat,
  );

  fastify.delete<{ Body: {} }>(
    '/',
    { preHandler: [fastify.jwt_verify], schema: { body: {} } },
    controller.deleteChat,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId',
    { preHandler: [fastify.jwt_verify], schema: { params: chatParamsSchema } },
    controller.getChatDetails,
  );

  fastify.patch<{ Params: ChatParamsInterface; Body: {} }>(
    '/:chatId',
    { preHandler: [fastify.jwt_verify], schema: { params: chatParamsSchema, body: {} } },
    controller.updateChatDetails,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId/messages',
    { preHandler: [fastify.jwt_verify], schema: { params: chatParamsSchema } },
    controller.getChatMessages,
  );

  fastify.post<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>(
    '/:chatId/messages',
    {
      preHandler: [fastify.jwt_verify],
      schema: { params: chatParamsSchema, body: chatPostMessageBodySchema },
    },
    controller.postMessage,
  );
}
