import { z } from 'zod';

export const UserJwt = z.object({
  userId: z.string(),
});

export type UserJwtType = z.infer<typeof UserJwt>;
