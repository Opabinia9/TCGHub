import {
  chatCreationBodySchema,
  type ChatCreationBodyInterface,
  type ChatParamsInterface,
  type ChatPostMessageBodyInterface,
  type ChatUpdateLastReadBodyInterface,
} from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { ChatWithMembers, ChatWithMembersCreationInterface } from '@/types/chatObject.js';
import { find } from '@/utils/find.js';
import type { UserWithChats } from '@/types/userObject.js';
import type { ChatMember } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class ChatController {
  async getChats(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.retriveSession(request).session;
    const user = await facade.getUserWithChats(userId);
    const userWithChats = await facade.getUserWithChats(user.id);
    return reply.code(200).send({
      success: 'Chats successfully retrieved',
      chats: userWithChats.chats
        .map((x) => {
          const members = x.Chat.members.map((y) => {
            return y.User;
          });
          return {
            id: x.Chat.id,
            ...(x.Chat.name != null && { name: x.Chat.name }),
            type: x.Chat.type,
            ...(x.Chat.directKey != null && { directKey: x.Chat.directKey }),
            ...(x.Chat.sellerId != null && { sellerId: x.Chat.sellerId }),
            ...(x.Chat.cardId != null && { cardId: x.Chat.cardId }),
            members: members,
            createdAt: x.Chat.createdAt,
            lastReadMessageId: x.lastReadMessageId,
            joinedAt: x.joinedAt,
          };
        })
        .reverse(),
    });
  }

  async createChat(
    request: FastifyRequest<{ Body: ChatCreationBodyInterface }>,
    reply: FastifyReply,
  ) {
    // TODO: handle invalid userId in members
    const { userId } = request.retriveSession(request).session;
    const chatDetails: ChatCreationBodyInterface = request.body;
    let processedChatDetails: ChatWithMembersCreationInterface;

    if (chatDetails.type === 'TRADE') {
      processedChatDetails = {
        ...chatDetails,
        members: [],
        directKey: `${userId}:${chatDetails.sellerId}:${chatDetails.cardId}`,
      };
      processedChatDetails.members.push(chatDetails.sellerId);
      processedChatDetails.members.push(userId);
    } else if (chatDetails.type === 'DIRECT') {
      chatDetails.members.push(userId);
      processedChatDetails = { ...chatDetails, directKey: `${userId}:${chatDetails.members[0]}` };
    } else if (chatDetails.type === 'GROUP') {
      chatDetails.members.push(userId);
      processedChatDetails = chatDetails;
    } else {
      return reply.code(400).send({ error: 'invalid chat type' });
    }

    const chat = await facade.createChatWithMembers(processedChatDetails);
    return reply.code(201).send({ success: 'Chat created', chatId: chat.id });
  }

  async deleteChat(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(503).send({ error: 'not implemented yet' });
  }

  async getChatDetails(
    request: FastifyRequest<{ Params: ChatParamsInterface }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.retriveSession(request).session;
    const user = await facade.getUserWithChats(userId);
    const userWithChats: UserWithChats = await facade.getUserWithChats(user.id);
    const chat = await find<ChatWithMembers & { joinedAt: Date; lastReadMessageId: string | null }>(
      'id',
      userWithChats.chats.map((x) => {
        return { ...x.Chat, joinedAt: x.joinedAt, lastReadMessageId: x.lastReadMessageId };
      }),
      request.params.chatId,
    );
    if (chat === null) {
      return reply.code(404).send({ error: 'Chat Not Found' });
    }

    return reply.code(200).send({
      id: chat.id,
      ...(chat.name != null && { name: chat.name }),
      type: chat.type,
      ...(chat.directKey != null && { directKey: chat.directKey }),
      ...(chat.sellerId != null && { sellerId: chat.sellerId }),
      ...(chat.cardId != null && { cardId: chat.cardId }),
      createdAt: chat.createdAt,
      members: chat.members.map((x) => {
        return x.User;
      }),
      joinedAt: chat.joinedAt,
      lastReadMessageId: chat.lastReadMessageId,
    });
  }

  async updateLastRead(
    request: FastifyRequest<{ Params: ChatParamsInterface; Body: ChatUpdateLastReadBodyInterface }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.retriveSession(request).session;
    const user = await facade.getUserWithChats(userId);
    const userWithChats: UserWithChats = await facade.getUserWithChats(user.id);
    const chat = await find<ChatWithMembers & { joinedAt: Date; lastReadMessageId: string | null }>(
      'id',
      userWithChats.chats.map((x) => {
        return { ...x.Chat, joinedAt: x.joinedAt, lastReadMessageId: x.lastReadMessageId };
      }),
      request.params.chatId,
    );
    if (chat === null) {
      return reply.code(404).send({ error: 'Chat Not Found' });
    }
    facade.UpdateLastReadMessage(chat.id, userId, request.body.messageId);
    return reply.code(200).send({ success: 'Last Read Update Successfull' });
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
    const { userId } = request.retriveSession(request).session;
    const user = await facade.getUserWithChats(userId);
    const chatFromUser = await find<ChatMember>('chatId', user.chats, request.params.chatId);
    if (chatFromUser === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }
    const chat = await facade.getChatWithMessages(chatFromUser.chatId);

    return reply.code(200).send({
      success: 'Messages Successfully Retrived',
      messages: chat.messages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    });
  }

  async postMessage(
    request: FastifyRequest<{ Params: ChatParamsInterface; Body: ChatPostMessageBodyInterface }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.retriveSession(request).session;
    const message = request.body.body;
    const user = await facade.getUserWithChats(userId);
    const chatFromUser = await find<ChatMember>('chatId', user.chats, request.params.chatId);
    if (chatFromUser === null) {
      return reply.code(404).send({ error: 'Chat not found' });
    }

    const newMessage = await facade.createMessage({
      chatId: chatFromUser.chatId,
      senderId: userId,
      body: message,
    });
    return reply.code(201).send({ success: 'message sent', message: newMessage });
  }
}
