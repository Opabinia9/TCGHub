import Facade from '@/services/facade.js';
import type { Message } from '@prisma/client';
import type { Socket } from 'socket.io';
const facade = new Facade();

export async function forwardMessage(
  userId: string,
  message: Message,
  sockets: Record<string, Array<Socket>>,
): Promise<void> {
  const chatMemberIds = (await facade.getChatMembers(message.chatId)).map(
    (chatMember) => chatMember.userId,
  );
  for (const key in sockets) {
    if (chatMemberIds.includes(key) && key !== userId) {
      sockets[key]?.map((socket) => {
        socket.emit('newMessage', { message });
      });
    }
  }
}
