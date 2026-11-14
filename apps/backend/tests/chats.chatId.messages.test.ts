import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userTwo } from './helpers/userPresets.js';
import { createChat } from './helpers/chatPresets.js';
import { createMessages } from './helpers/messagePresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats/:chatId/messages', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('returns all messages in a chat for a logged in user', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const chat = await createChat('chatOne', 'DIRECT', [
      userOneDetails.user.id,
      userTwoDetails.user.id,
    ]);
    const messages = [
      { senderId: userOneDetails.user.id, body: 'this is a message' },
      { senderId: userTwoDetails.user.id, body: 'message two' },
      { senderId: userOneDetails.user.id, body: 'and another' },
    ];
    await createMessages(chat.id, messages);

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${chat.id}/messages`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject({
      success: 'Messages Successfully Retrived',
      chat: {
        messages: messages.map((x) => {
          return { ...x, chatId: chat.id };
        }),
      },
    });
  });

  it("handles request for chats that don\'t exist", async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userOneAccessToken = userOneDetails.token;
    const invalidChatId = 'helloworld';
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${invalidChatId}/messages`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(404);
    expect(payload).toMatchObject({
      error: 'Chat not found',
    });
  });
});

describe('POST /api/v1/chats/:chatId/messages', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('lets logged in member send a message', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const chat = await createChat('chatOne', 'DIRECT', [
      userOneDetails.user.id,
      userTwoDetails.user.id,
    ]);
    const messageText = 'this is a message';
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: `/api/v1/chats/${chat.id}/messages`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        body: messageText,
      },
    });

    const payload = await response.json();
    // TODO: deal with this later
    // const databaseMessage = prisma.message.findUnique({
    //   where: {

    //   }
    // })
    expect(response.statusCode).toBe(201);
    expect(payload).toMatchObject({
      success: 'message sent',
    });
  });

  it("handles sending a message to a chat that doesn't exist", async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userOneAccessToken = userOneDetails.token;
    const messageText = 'this is a message';
    const invalidChatId = 'helloworld';
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: `/api/v1/chats/${invalidChatId}/messages`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        body: messageText,
      },
    });

    const payload = await response.json();
    expect(response.statusCode).toBe(404);
    expect(payload).toMatchObject({
      error: 'Chat not found',
    });
  });
});
