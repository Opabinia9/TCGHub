import Fastify from 'fastify';
import ChatController from '@/controllers/chatController.js';
import {
  chatCreationBodySchema,
  chatParamsSchema,
  chatPostMessageBodySchema,
  chatUpdateLastReadBodySchema,
} from './routeSchemas.js';
import type {
  ChatCreationBodyInterface,
  ChatParamsInterface,
  ChatPostMessageBodyInterface,
  ChatUpdateLastReadBodyInterface,
} from './routeSchemas.js';
import { ChatType } from '@prisma/client';
import z from 'zod';

export default async function chatRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new ChatController();

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: z
            .object({
              success: z.string(),
              chats: z.array(
                z.object({
                  id: z.uuid(),
                  type: z.enum(Object.values(ChatType)),
                  name: z.string().optional(),
                  directKey: z.string().optional(),
                  sellerId: z.uuid().optional(),
                  cardId: z.uuid().optional(),
                  createdAt: z.date(),
                  // TODO: CHANGE THIS BULLSHIT
                  members: z.array(z.any()),
                  lastReadMessageId: z.uuid().nullable(),
                  joinedAt: z.date(),
                }),
              ),
            })
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
      preHandler: [fastify.authenticate],
      schema: {
        body: chatCreationBodySchema,
        response: {
          201: z
            .object({
              success: z.string(),
              chatId: z.uuid(),
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
      preHandler: [fastify.authenticate],
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
      preHandler: [fastify.authenticate],
      schema: {
        params: chatParamsSchema,
        response: {
          200: z
            .object({
              id: z.uuid(),
              type: z.enum(Object.values(ChatType)),
              name: z.string().optional(),
              directKey: z.string().optional(),
              sellerId: z.uuid().optional(),
              cardId: z.uuid().optional(),
              createdAt: z.date(),
              // TODO: CAHNGE THIS BULLSHIT
              members: z.array(z.any()),
              lastReadMessageId: z.uuid().nullable(),
              joinedAt: z.date(),
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
      preHandler: [fastify.authenticate],
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
      preHandler: [fastify.authenticate],
      schema: {
        params: chatParamsSchema,
        response: {
          200: z
            .object({
              success: z.string(),
              messages: z.array(
                z.object({
                  id: z.uuid(),
                  createdAt: z.date(),
                  body: z.string(),
                  chatId: z.uuid(),
                  senderId: z.uuid(),
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
      preHandler: [fastify.authenticate],
      schema: {
        params: chatParamsSchema,
        body: chatPostMessageBodySchema,
        response: {
          201: z
            .object({
              success: z.string(),
              message: z.object({
                id: z.uuid(),
                createdAt: z.date(),
                body: z.string(),
                chatId: z.uuid(),
                senderId: z.uuid().nullable(),
              }),
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

  fastify.put<{ Params: ChatParamsInterface; Body: ChatUpdateLastReadBodyInterface }>(
    '/:chatId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: chatParamsSchema,
        body: chatUpdateLastReadBodySchema,
        response: {
          200: z
            .object({
              success: z.string(),
            })
            .meta({ description: 'Ok' }),
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
    controller.updateLastRead,
  );
}
