import NotFoundError from '@/errortypes/notFoundError.js';
import Facade from '@/services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { authLoginBody, authSignupBody } from '@/routes/api/v1/routeSchemas.js';
import type { User } from '@prisma/client';

const facade = new Facade();

/** Class for the auth api endpoint */
export default class authController {
  /**
   * post request handling for auth/login
   */
  async loginPost(request: FastifyRequest<{ Body: authLoginBody }>, reply: FastifyReply) {
    let user: User;
    try {
      user = await facade.getUserByEmail(request.body['email']);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      } else {
        /* c8 ignore next */
        throw error;
      }
    }

    if (request.body['password'] !== user.password) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const access_token = request.server.jwt.sign({ username: user.id });
    return reply.code(200).send({ access_token: access_token });
  }

  /**
   * post request handling for auth/signup
   */
  async signupPost(request: FastifyRequest<{ Body: authSignupBody }>, reply: FastifyReply) {
    let existingUser = null;
    try {
      existingUser = await facade.getUserByEmail(request.body['email']);
      return reply.code(400).send({ error: 'Email already registered' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        try {
          existingUser = await facade.getUserByUsername(request.body['username']);
        } catch (error) {
          if (error instanceof NotFoundError) {
            existingUser = null;
          } else {
            throw error;
          }
        }
      } else {
        throw error;
      }
    }
    if (existingUser !== null) {
      return reply.code(400).send({ error: 'Username already registered' });
    }

    await facade.createUser(request.body);
    reply.code(201).send('Account creation successful');
  }

  /**
   * get request handling for auth/protected
   */
  async protectedGet(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ response: 'verified and logged in' });
  }
}
