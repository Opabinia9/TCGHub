import { APIError, betterAuth } from 'better-auth';
import { bearer, openAPI } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/utils/prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [bearer(), openAPI()],
  user: {
    modelName: 'user',
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        input: true,
        unique: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const taken = await prisma.user.findUnique({
            where: { username: String(user.username) },
          });
          if (taken) {
            throw new APIError('UNPROCESSABLE_ENTITY', {
              message: 'User already exists. Use another email.',
              code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
            });
          }

          return { data: user };
        },
      },
    },
  },
  emailAndPassword: { enabled: true },
  trustedOrigins: ['http://localhost:8080'],
  advanced: {
    disableOriginCheck: true,
    database: {
      generateId: 'uuid',
    },
  },
});
