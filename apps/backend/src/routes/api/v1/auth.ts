import Fastify from 'fastify';
import AuthController from '@/controllers/authController.js';
import {
  authLoginSchema,
  authSignupSchema,
  type AuthLoginBody,
  type AuthSignupBody,
} from './routeSchemas.js';
import z from 'zod';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new AuthController();

  fastify.post<{ Body: AuthLoginBody }>(
    '/login',
    {
      schema: {
        ...authLoginSchema,
        response: {
          200: z.object({
            access_token: z.jwt(),
          }),
          // {
          //   description: 'Successful login',
          //   type: 'object',
          //   properties: {
          //     accessToken: { type: 'string' },
          //   },
          // },
          401: z.object({ error: z.string() }),
          // {
          //   description: 'Invalid Credentials',
          //   type: 'object',
          //   properties: {
          //     error: { type: 'string' },
          //   },
          // },
          400: z.object({
            statusCode: z.number(),
            code: z.string(),
            error: z.string(),
            message: z.string(),
          }),
          // {
          //   description: 'Bad Request',
          //   type: 'object',
          //   properties: {
          //     statusCode: { type: 'number' },
          //     code: { type: 'string' },
          //     error: { type: 'string' },
          //     message: { type: 'string' },
          //   },
          // },
        },
      },
    },
    controller.loginPost,
  );

  fastify.post<{ Body: AuthSignupBody }>(
    '/signup',
    { schema: authSignupSchema },
    controller.signupPost,
  );

  fastify.get('/protected', { preHandler: [fastify.jwt_verify] }, controller.protectedGet);
}
