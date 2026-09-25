import NotFoundError from "@errortypes/notFoundError.js";
import Facade from '@services/facade.js'
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { authLoginBody } from "@routes/api/v1/routeschemas.js";
import type { userObject } from "@persistence/types.js";

const facade = new Facade();

export default class authController{
  post(request: FastifyRequest<{ Body: authLoginBody }>, reply: FastifyReply) {

    let user: userObject;
    try {
      user = facade.getUserByEmail(request.body["email"]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(401).send({ "error": "Invalid credentials" })
      }

      throw error;
    }

    console.log(user)
  
    if (request.body["password"] !== user.password) {
        return reply.code(401).send({ "error": "Invalid credentials" })
    }

    return reply.code(200).send({ "access_token": "token goes here" })
    

  }}
