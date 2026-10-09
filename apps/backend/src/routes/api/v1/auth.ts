import Fastify from 'fastify';
import AuthController from '@/controllers/authController.js';
import {
  authLoginSchema,
  authSignupSchema,
  type AuthLoginBody,
  type AuthSignupBody,
} from './routeSchemas.js';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new AuthController();

  fastify.post<{ Body: AuthLoginBody }>(
    '/login',
    { schema: authLoginSchema },
    controller.loginPost,
  );

  fastify.post<{ Body: AuthSignupBody }>(
    '/signup',
    { schema: authSignupSchema },
    controller.signupPost,
  );

  fastify.get('/protected', { preHandler: [fastify.jwt_verify] }, controller.protectedGet);
}
