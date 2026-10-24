import NotFoundError from '@/errortypes/NotFoundError.js';
import type {
  ChatCreationBodyInterface,
  ChatParamsInterface,
  ChatPostMessageBodyInterface,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { ChatWithMembersCreationInterface, ChatWithMessages } from '@/types/chatObject.js';
import { type UserJwtType, UserJwt } from '@/types/JWTObject.js';
import { find } from '@/utils/find.js';
import type { ChatMember } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class chatController {
  async getChats(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async createChat(
    request: FastifyRequest<{ Body: ChatCreationBodyInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const chatDetails: ChatWithMembersCreationInterface = request.body;
    chatDetails.members.push(jwt.userId);
    const chat = await facade.createChatWithMembers(chatDetails);
    return reply.code(201).send({ success: 'Chat created', chatID: chat.id });
  }

  async deleteChat(request: FastifyRequest<{ Body: {} }>, reply: FastifyReply) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async getChatDetails(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async updateChatDetails(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async getChatMessages(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);

    let user;
    try {
      user = await facade.getUserWithChats(jwt.userId);
    } catch (error) {
      /* c8 ignore else */
      if (error instanceof NotFoundError) {
        return reply.code(403).send({ error: 'User Not Found' });
      } else {
        throw error;
      }
    }

    const chatId = await find<ChatMember>('chat_id', user.chats, request.params.chatId);
    if (chatId === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }
    const chat = await facade.getChatWithMessages(chatId);

    return reply.code(200).send({
      messages: chat.messages.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }),
    });
  }

  async postMessage(
    request: FastifyRequest<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>,
    reply: FastifyReply,
  ) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const message = request.body.body;
    const userId = jwt.userId;
    const user = await facade.getUserWithChats(userId);
    const chatId = await find<ChatMember>('chat_id', user.chats, request.params.chatId);
    if (chatId === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }

    await facade.createMessage({
      chat_id: chatId,
      sender_id: userId,
      body: message,
    });
    return reply.code(200).send({ success: 'message sent' });
  }
}
