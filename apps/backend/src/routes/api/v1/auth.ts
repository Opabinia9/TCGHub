import Fastify from 'fastify';
import AuthController from '@/controllers/authController.js';
import {
  authLoginSchema,
  authSignupSchema,
  type AuthLoginBody,
  type AuthSignupBody,
} from './routeSchemas.js';
import z from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new AuthController();

  fastify.withTypeProvider<ZodTypeProvider>().post<{ Body: AuthLoginBody }>(
    '/login',
    {
      schema: {
        ...authLoginSchema,
        response: {
          200: z
            .object({
              accessToken: z.jwt(),
            })
            .describe('Successful login response'),
          401: z
            .object({
              error: z.string(),
            })
            .describe('Invalid Credentials'),
          400: z
            .object({
              statusCode: z.number(),
              code: z.string(),
              error: z.string(),
              message: z.string(),
            })
            .meta({
              description: 'Bad Request',
            }),
        },
      },
    },
    controller.loginPost,
  );

  fastify.post<{ Body: AuthSignupBody }>(
    '/signup',
    {
      schema: {
        ...authSignupSchema,
        response: {
          201: z
            .object({ success: z.string() })
            .meta({ description: 'Account Creation Successful' }),
          400: z
            .object({
              statusCode: z.number(),
              code: z.string(),
              error: z.string(),
              message: z.string(),
            })
            .meta({ description: 'Bad Request' }),
          409: z
            .object({
              error: z.string(),
            })
            .meta({ description: 'Conflict' }),
        },
      },
    },
    controller.signupPost,
  );

  fastify.get(
    '/protected',
    {
      preHandler: [fastify.jwt_verify],
      schema: {
        response: {
          200: z
            .object({
              success: z.string(),
            })
            .meta({ description: 'OK' }),
          401: z
            .object({
              statusCode: z.number(),
              code: z.string(),
              error: z.string(),
              message: z.string(),
            })
            .meta({ description: 'Unauthorized' }),
        },
      },
    },
    controller.protectedGet,
  );
}
