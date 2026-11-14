import ChatController from '@/controllers/chatController.js';
import { auth } from '@/utils/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { Socket, Server } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    sockets: Record<string, Array<Socket>>;
  }
}

export default function registerSocketDecorator(fastify: FastifyInstance) {
  const io = new Server(fastify.server, { transports: ['websocket'] });
  const controller = new ChatController();
  const sockets: { [userId: string]: Array<Socket> } = {};
  fastify.decorate('sockets', sockets);

  io.use(async (socket, next) => {
    fastify.log.info({ socketId: socket.id }, 'socket atempting to connect');
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.handshake.headers),
    });
    if (!session) {
      fastify.log.info({ socketId: socket.id }, 'socket blocked');
      return next(new Error('unauthorized'));
    }
    socket.data.session = session;
    fastify.log.info({ socketId: socket.id }, 'socket auth ok');
    next();
  });

  io.on('connection', (socket) => {
    const log = fastify.log.child({ socketId: socket.id });
    log.info('socket connected');
    const userId: string = socket.data.session.user.id;
    sockets[userId] ? sockets[userId]?.push(socket) : (sockets[userId] = [socket]);
    socket.on('disconnect', (reason) => log.info({ reason }, 'socket disconnected'));
    socket.on('message', async (message) => {
      log.info(`WEBSOCKET: event 'message' recived: ${message}`);
      await controller.WSSendMessage(fastify, socket, message);
    });
  });

  io.engine.on('connection_error', (err) => {
    fastify.log.warn({ code: err.code, message: err.message }, 'socket connection error');
  });

  fastify.addHook('onClose', async () => {
    io.close();
  });
}
