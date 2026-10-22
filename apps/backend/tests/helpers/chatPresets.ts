import { Chat, ChatType, Prisma } from '@prisma/client';
import { prisma } from '../../src/utils/prisma';
import { userOne, userThree, userTwo } from './userPresets';

// export type UserFull = Omit<User, 'created_at' | 'updated_at' | 'hash'>;

// export const userOneAcessToken =
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZmNmYmJjNS00Y2M0LTQwYzItYjA3Yi1kNzRhMzU4NTFlOWYiLCJpYXQiOjE3OTI0NzM1ODB9.jVd0C22W6Wcr_aXPdFbfo5YdRxZofv8KDxBuIznUUMk';
// export const userOnePassword = 'password';
// export const userOneHash = await hashPassword(userOnePassword);
// export const chatOne: Prisma.ChatCreateInput = {
// id: '1ea2fc75-c50b-4d1d-94b2-06c8d8394f15',
// title: 'chatOne',
// type: 'DIRECT',
// ChatMembers: { createMany: { data: [{ user_id: userOne.id }, { user_id: userTwo.id }] } },
// };

// export const chatTwo: Prisma.ChatCreateInput = {
// id: '3cf9a530-632d-48f7-960e-16ee4f62ebce',
// title: 'chatTwo',
// type: 'GROUP',
// ChatMembers: {
// createMany: {
// data: [{ user_id: userOne.id }, { user_id: userTwo.id }, { user_id: userThree.id }],
// },
// },
// };

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
      ChatMembers: members,
    },
  });
}
