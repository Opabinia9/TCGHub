import { prisma } from '../../src/utils/prisma';
import type { UserCreationInterface } from '../../src/types/userObject';

export const defaultUserDetails: UserCreationInterface = {
  username: 'example',
  email: 'example@email.com',
  password: 'password',
  first_name: 'john',
  last_name: 'doe',
};

export async function createDefaultUser() {
  await prisma.user.create({
    data: defaultUserDetails,
  });
}

export const defaultUser2Details: UserCreationInterface = {
  username: 'user2',
  email: 'user2@email.com',
  password: 'password',
  first_name: 'jane',
  last_name: 'doe',
};

// export async function createDefaultUser2() {
//   await prisma.user.create({
//     data: defaultUser2Details,
//   });
// }

export const invalidUserDetails: UserCreationInterface = {
  username: 'invalid',
  email: 'invalid@email.com',
  password: 'invalidpassword',
  first_name: 'invalid',
  last_name: 'user',
};

export const badEmail = 'email.com';
