import Fastify from "fastify";
import authController from "@controllers/authController.js";
import { authLoginSchema, type authLoginBody } from './routeschemas.js'


export default async function authRoutes(fastify: Fastify.FastifyInstance, options: object) {
  const controller = new authController();

  fastify.post<{ Body: authLoginBody }>('/login', { schema: authLoginSchema }, controller.post);


}
