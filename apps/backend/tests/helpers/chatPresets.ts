import { Chat, ChatType, Prisma } from '@prisma/client';
import { prisma } from '../../src/utils/prisma';

export interface ChatDetailsInterface {
  title: string;
  type: ChatType;
  memberIDs: Array<string>;
}

export async function createChat(
  title: string,
  type: ChatType,
  memberIDs: Array<string>,
): Promise<Chat> {
  const members: Prisma.ChatMemberCreateNestedManyWithoutChatInput = {
    createMany: {
      data: memberIDs.map((x) => {
        return { user_id: x };
      }),
    },
  };

  return await prisma.chat.create({
    data: {
      title: title,
      type: type,
      members: members,
    },
  });
}

export async function createChats(chats: Array<ChatDetailsInterface>): Promise<Array<Chat>> {
  const chatsArray = [];
  for (const chat of chats) {
    chatsArray.push(await createChat(chat.title, chat.type, chat.memberIDs));
  }
  return chatsArray;
}
