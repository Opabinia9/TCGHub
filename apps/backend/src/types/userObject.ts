import type { User } from '@prisma/client';

export type UserCreationInterface = Pick<
  User,
  'username' | 'email' | 'hash' | 'first_name' | 'last_name'
>;
