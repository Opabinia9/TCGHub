import type { ChatGetParams } from '@/routes/api/v1/routeSchemas.js';
import Facade from '@/services/facade.js';
import type { ChatWithMessages } from '@/types/chatObject.js';
import { type UserJwtType, UserJwt } from '@/types/JWTObject.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const facade = new Facade();

export default class chatController {
  async getChat(request: FastifyRequest<{ Params: ChatGetParams }>, reply: FastifyReply) {
    const jwt: UserJwtType = UserJwt.parse(request.user);
    const user = await facade.getUserWithChats(jwt.userId);
    const chats = user.chats;
    const chatId = request.params.chatId;

    let chat: ChatWithMessages;
    find: {
      for (const row of chats) {
        if (row.chat_id === chatId) {
          chat = await facade.getChatWithMessages(chatId);
          break find;
        }
      }
      return reply.code(404).send({ error: 'Chat not found' });
    }

    return reply.code(200).send({ messages: chat.messages });
  }
}
