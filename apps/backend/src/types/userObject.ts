import type { User } from '@prisma/client';

export type UserCreationInterface = Pick<
  User,
  'username' | 'email' | 'password' | 'first_name' | 'last_name'
>;
