import NotFoundError from '@/errortypes/NotFoundError.js';
import Facade from '@/services/facade.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthLoginBody, AuthSignupBody } from '@/routes/api/v1/routeSchemas.js';
import type { User } from '@prisma/client';
import { verifyPassword } from '@/utils/hashing.js';

const facade = new Facade();

/** Class for the auth api endpoint */
export default class AuthController {
  /**
   * post request handling for auth/login
   */
  async loginPost(request: FastifyRequest<{ Body: AuthLoginBody }>, reply: FastifyReply) {
    let user: User;
    try {
      user = await facade.getUserByEmail(request.body['email']);
    } catch (error) {
      /* c8 ignore else */
      if (error instanceof NotFoundError) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      } else {
        throw error;
      }
    }

    if (!(await verifyPassword(request.body['password'], user.hash))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const access_token = request.server.jwt.sign({ username: user.id });
    return reply.code(200).send({ access_token: access_token });
  }

  /**
   * post request handling for auth/signup
   */
  async signupPost(request: FastifyRequest<{ Body: AuthSignupBody }>, reply: FastifyReply) {
    let existingUser = null;
    try {
      existingUser = await facade.getUserByEmail(request.body['email']);
      return reply.code(400).send({ error: 'Email already registered' });
    } catch (error) {
      /* c8 ignore else */
      if (error instanceof NotFoundError) {
        try {
          existingUser = await facade.getUserByUsername(request.body['username']);
          return reply.code(400).send({ error: 'Username already registered' });
        } catch (error) {
          /* c8 ignore else */
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

    await facade.createUser(request.body);
    reply.code(201).send({ response: 'Account creation successful' });
  }

  /**
   * get request handling for auth/protected
   */
  async protectedGet(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ response: 'verified and logged in' });
  }
}
