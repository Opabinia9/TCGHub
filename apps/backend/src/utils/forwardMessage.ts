import Facade from '@/services/facade.js';
import type { Chat, Message } from '@prisma/client';
import type { Socket } from 'socket.io';
const facade = new Facade();

export async function forwardMessage(
  userId: string,
  data: { type: 'newMessage'; message: Message } | { type: 'newChat'; chat: Chat },
  sockets: Record<string, Array<Socket>>,
): Promise<void> {
  console.log('forwarding');
  const key = data.type === 'newMessage' ? data.message.chatId : data.chat.id;
  const chatMemberIds = (await facade.getChatMembers(key)).map((chatMember) => chatMember.userId);
  for (const key in sockets) {
    if (chatMemberIds.includes(key) && key !== userId) {
      sockets[key]?.map((socket) => {
        if (data.type === 'newMessage') {
          socket.emit(data.type, { message: data.message });
        } else if (data.type === 'newChat') {
          socket.emit(data.type, { chat: data.chat });
        }
      });
    }
  }
}
