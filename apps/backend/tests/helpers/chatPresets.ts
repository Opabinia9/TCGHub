import { Chat, ChatType, Prisma } from '@prisma/client';
import { prisma } from '../../src/utils/prisma';

export interface ChatDetailsInterface {
  name: string;
  type: ChatType;
  memberIDs: Array<string>;
}

export const invalidChatId = '572b4ea4-1b55-4927-8c55-34fc7ee1c910';

export async function createChat(
  name: string,
  type: ChatType,
  memberIDs: Array<string>,
): Promise<Chat> {
  const members: Prisma.ChatMemberCreateNestedManyWithoutChatInput = {
    createMany: {
      data: memberIDs.map((x) => {
        return { userId: x };
      }),
    },
  };

  return await prisma.chat.create({
    data: {
      name: name,
      type: type,
      members: members,
    },
  });
}

export async function createChats(chats: Array<ChatDetailsInterface>): Promise<Array<Chat>> {
  const chatsArray = [];
  for (const chat of chats) {
    chatsArray.push(await createChat(chat.name, chat.type, chat.memberIDs));
  }
  return chatsArray;
}
