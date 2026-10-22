import { prisma } from '../../src/utils/prisma';
import { hashPassword } from '../../src/utils/hashing.js';
import { Prisma, User } from '@prisma/client';

export const badEmail = 'email.com';

// -------------------------------------------------------------------

export type UserFull = Omit<User, 'created_at' | 'updated_at' | 'hash'>;

export const userOneAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MGIzZTgyMi00YTNjLTRiNGQtYTYwMi02YzViNDYzYWZjNTIiLCJpYXQiOjE3OTI1NzIyMTh9.IfLoYOd2i7ERBKNrCldXyOQd48aLtaCXzfdSI1RgORc';
export const userOnePassword = 'password';
export const userOneHash = await hashPassword(userOnePassword);
export const userOne: UserFull = {
  id: '70b3e822-4a3c-4b4d-a602-6c5b463afc52',
  username: 'userone',
  email: 'userone@email.com',
  first_name: 'userone',
  last_name: 'doe',
  last_lat: null,
  last_long: null,
};

export const userTwoPassword = 'password';
export const userTwoAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MTEwZDc4ZC1mYzdmLTQ4MzAtYTMxMC0yYjY4NjE0Zjc5YzIiLCJpYXQiOjE3OTI1NzIyMTh9.Hi_gTsr-tsSviQb5H7nGgNpdBKdqS-9ZbM8KLLtQoqg';
export const userTwoHash = await hashPassword(userTwoPassword);
export const userTwo: UserFull = {
  id: '7110d78d-fc7f-4830-a310-2b68614f79c2',
  username: 'usertwo',
  email: 'usertwo@email.com',
  first_name: 'usertwo',
  last_name: 'doe',
  last_lat: null,
  last_long: null,
};

export const userThreePassword = '';
export const userThreeAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDhkNjllZS1lZWQ5LTQzZDktOTBiZS05OGNkMDNhMDgwNWIiLCJpYXQiOjE3OTI1NzIyMTh9.QViV04YpxtntQRs8DSe2XLB2p4BX6GJJXwQEdMx2Yg8';
export const userThreeHash = await hashPassword(userThreePassword);
export const userThree: UserFull = {
  id: '748d69ee-eed9-43d9-90be-98cd03a0805b',
  username: 'userthree',
  email: 'userthree@email.com',
  first_name: 'userthree',
  last_name: 'doe',
  last_lat: null,
  last_long: null,
};

export const userFourPassword = '';
export const userFourAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NzJiNGVhNC0xYjU1LTQ5MjctOGM1NS0zNGZjN2VlMWM5MTAiLCJpYXQiOjE3OTI1NzIyMTh9.5XZ3fuec_edXm--otbhK2Lfv87k48u2c9tO1Gddej7Q';
export const userFourHash = await hashPassword(userFourPassword);
export const userFour: UserFull = {
  id: '572b4ea4-1b55-4927-8c55-34fc7ee1c910',
  username: 'userfour',
  email: 'userfour@email.com',
  first_name: 'userfour',
  last_name: 'doe',
  last_lat: null,
  last_long: null,
};

export const invalidUserPassword = 'invalidpassword';
export const invalidUserAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NzJiNGVhNC0xYjU1LTQ5MjctOGM1NS0zNGZjN2VlMWM5MTAiLCJpYXQiOjE3OTI2MzQ3Njl9.OBw3JU1Ht8Dtp3TqVA7fC5QKBxyfASTvKh5eNRLq2Vo';
export const invalidUserHash = await hashPassword(invalidUserPassword);
export const invalidUser: UserFull = {
  id: '572b4ea4-1b55-4927-8c55-34fc7ee1c910',
  username: 'invaliduser',
  email: 'invaliduser@email.com',
  first_name: 'invalid',
  last_name: 'user',
  last_lat: null,
  last_long: null,
};

export async function createUser(user: Prisma.UserCreateInput) {
  await prisma.user.create({
    data: user,
  });
}
