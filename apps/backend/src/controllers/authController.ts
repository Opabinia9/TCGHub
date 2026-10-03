import NotFoundError from '@errortypes/notFoundError.js';
import Facade from '@services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { authLoginBody } from '@routes/api/v1/routeschemas.js';
import type User from '../models/user.js';

const facade = new Facade();

/** Class for the auth api endpoint */
export default class authController {
  /**
   * post request handling for auth/login
   */
  async post(request: FastifyRequest<{ Body: authLoginBody }>, reply: FastifyReply) {
    let user: User;
    try {
      user = facade.getUserByEmail(request.body['email']);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      throw error;
    }

    if (request.body['password'] !== user.password) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const access_token = request.server.jwt.sign({ username: user.name });
    return reply.code(200).send({ access_token: access_token });
  }

  /**
   * get request handling for auth/protected
   */
  async get(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ response: 'verified and logged in' });
  }
}
