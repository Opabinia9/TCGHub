import Fastify from 'fastify';
import ChatController from '@/controllers/chatController.js';
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
import { ChatType } from '@prisma/client';
import z from 'zod';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new ChatController();

  fastify.get(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        response: {
          200: z
            .array(
              z.object({
                id: z.uuid(),
                type: z.enum(Object.values(ChatType)),
                title: z.string(),
                created_at: z.date(),
                members: z.array(z.uuid()),
                last_read_message_id: z.uuid().nullable(),
                joined_at: z.date(),
              }),
            )
            .meta({ description: 'OK' }),
          401: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
        },
      },
    },
    controller.getChats,
  );

  fastify.post<{ Body: ChatCreationBodyInterface }>(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        body: chatCreationBodySchema,
        response: {
          201: z
            .object({
              success: z.string(),
              chatID: z.uuid(),
            })
            .meta({ description: 'Created' }),
          401: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
        },
      },
    },
    controller.createChat,
  );

  fastify.delete(
    '/',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        response: {
          503: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Service Unavailable' }),
        },
      },
    },
    controller.deleteChat,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        response: {
          200: z
            .object({
              id: z.uuid(),
              type: z.enum(Object.values(ChatType)),
              title: z.string(),
              created_at: z.date(),
              members: z.array(z.uuid()),
              last_read_message_id: z.uuid().nullable(),
              joined_at: z.date(),
            })
            .meta({ description: 'OK' }),
          401: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
          404: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Not Found' }),
        },
      },
    },
    controller.getChatDetails,
  );

  fastify.patch<{ Params: ChatParamsInterface }>(
    '/:chatId',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        response: {
          503: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Service Unavailable' }),
        },
      },
    },
    controller.updateChatDetails,
  );

  fastify.get<{ Params: ChatParamsInterface }>(
    '/:chatId/messages',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        response: {
          200: z
            .object({
              messages: z.array(
                z.object({
                  body: z.string(),
                  chat_id: z.uuid(),
                  sender_id: z.uuid(),
                }),
              ),
            })
            .meta({ description: 'OK' }),
          401: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
          404: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Not Found' }),
        },
      },
    },
    controller.getChatMessages,
  );

  fastify.post<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>(
    '/:chatId/messages',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        params: chatParamsSchema,
        body: chatPostMessageBodySchema,
        response: {
          201: z
            .object({
              success: z.string(),
            })
            .meta({ description: 'Created' }),
          401: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
          404: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Not Found' }),
        },
      },
    },
    controller.postMessage,
  );
}
