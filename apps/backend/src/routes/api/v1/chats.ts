import Fastify from 'fastify';
import chatController from '@/controllers/chatController.js';
import { chatGetSchema } from './routeSchemas.js';
import type { ChatGetParams } from './routeSchemas.js';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new chatController();

  fastify.get<{ Params: ChatGetParams }>(
    '/:chatId',
    { preHandler: [fastify.jwt_verify], schema: chatGetSchema },
    controller.getChat,
  );
}
