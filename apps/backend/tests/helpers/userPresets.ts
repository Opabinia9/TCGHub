import { prisma } from '../../src/utils/prisma';
import { hashPassword } from '../../src/utils/hashing.js';
import { AuthSignupBody } from '../../src/routes/api/v1/routeSchemas.js';
import type { UserCreationInterface } from '../../src/types/userObject';

export const defaultUserDetails: AuthSignupBody = {
  username: 'example',
  email: 'example@email.com',
  password: 'password',
  first_name: 'john',
  last_name: 'doe',
};
export const defaultUserHash = await hashPassword(defaultUserDetails.password);
export const defaultUserStored: UserCreationInterface = {
  username: defaultUserDetails.username,
  email: defaultUserDetails.email,
  hash: defaultUserHash,
  first_name: defaultUserDetails.first_name,
  last_name: defaultUserDetails.last_name,
};

export async function createDefaultUser() {
  await prisma.user.create({
    data: defaultUserStored,
  });
}

export const defaultUser2Details: AuthSignupBody = {
  username: 'user2',
  email: 'user2@email.com',
  password: 'password',
  first_name: 'jane',
  last_name: 'doe',
};
export const defaultUser2Hash = await hashPassword(defaultUser2Details.password);
export const defaultUser2Stored: UserCreationInterface = {
  username: defaultUser2Details.username,
  email: defaultUser2Details.email,
  hash: defaultUser2Hash,
  first_name: defaultUser2Details.first_name,
  last_name: defaultUser2Details.last_name,
};

// export async function createDefaultUser2() {
//   await prisma.user.create({
//     data: defaultUser2Details,
//   });
// }

export const invalidUserDetails: AuthSignupBody = {
  username: 'invalid',
  email: 'invalid@email.com',
  password: 'invalidpassword',
  first_name: 'invalid',
  last_name: 'user',
};
export const invalidUserHash = await hashPassword(invalidUserDetails.password);
export const invalidUserStored: UserCreationInterface = {
  username: 'invalid',
  email: 'invalid@email.com',
  hash: invalidUserHash,
  first_name: 'invalid',
  last_name: 'user',
};

export const badEmail = 'email.com';
