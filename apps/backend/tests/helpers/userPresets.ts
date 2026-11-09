import { User } from '@prisma/client';
import { auth } from '../../src/utils/auth';
export const badEmail = 'email.com';

// -------------------------------------------------------------------

export type UserFull = Omit<
  User,
  'id' | 'email_verified' | 'image' | 'created_at' | 'updated_at'
> & { password: string };

export const userOne: UserFull = {
  username: 'userone',
  email: 'userone@email.com',
  password: 'password',
  name: 'userone',
};

export const userTwo: UserFull = {
  username: 'usertwo',
  email: 'usertwo@email.com',
  password: 'password',
  name: 'usertwo',
};

export const userThree: UserFull = {
  username: 'userthree',
  email: 'userthree@email.com',
  password: 'password',
  name: 'userthree',
};

export const userFour: UserFull = {
  username: 'userfour',
  email: 'userfour@email.com',
  password: 'password',
  name: 'userfour',
};

export const invalidUserAccessToken = 'SX7EPr5i8RH8B7OzFKlS92OgpCVSwq0w';
export const invalidUser: UserFull = {
  username: 'invaliduser',
  email: 'invaliduser@email.com',
  password: 'FUCKKKKK',
  name: 'invalid',
};

export async function createUser(user: UserFull) {
  return await auth.api.signUpEmail({
    body: user,
  });
}
