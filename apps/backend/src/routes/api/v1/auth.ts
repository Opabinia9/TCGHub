import Fastify from 'fastify';
import authController from '@/controllers/authController.js';
import {
  authLoginSchema,
  authSignupSchema,
  type authLoginBody,
  type authSignupBody,
} from './routeSchemas.js';

export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new authController();

  fastify.post<{ Body: authLoginBody }>(
    '/login',
    { schema: authLoginSchema },
    controller.loginPost,
  );

  fastify.post<{ Body: authSignupBody }>(
    '/signup',
    { schema: authSignupSchema },
    controller.signupPost,
  );

  fastify.get('/protected', { preHandler: [fastify.jwt_verify] }, controller.protectedGet);
}
