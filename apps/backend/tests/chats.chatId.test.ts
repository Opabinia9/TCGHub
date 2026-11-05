import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userTwo } from './helpers/userPresets.js';
import { createChat, invalidChatId } from './helpers/chatPresets.js';
import { auth } from '../src/utils/auth.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats/:chatId', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('returns details of a chat the user is apart of', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const chat = await createChat('chatOne', 'DIRECT', [
      userOneDetails.user.id,
      userTwoDetails.user.id,
    ]);

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${chat.id}`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(200);
    expect(payload).toEqual({
      id: chat.id,
      type: chat.type,
      title: chat.title,
      created_at: chat.created_at.toISOString(),
      members: [userOneDetails.user.id, userTwoDetails.user.id],
      last_read_message_id: null,
      joined_at: expect.any(String),
    });
  });

  it("handles request for chat that doesn't exist", async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userOneAccessToken = userOneDetails.token;
    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/chats/${invalidChatId}`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(404);
    expect(payload).toEqual({ error: 'Chat Not Found' });
  });
});

describe('PATCH /api/v1/chats/:chatId', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('returns service unavailable', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const chat = await createChat('chatOne', 'DIRECT', [
      userOneDetails.user.id,
      userTwoDetails.user.id,
    ]);
    const response = await server.inject({
      method: 'PATCH',
      url: `/api/v1/chats/${chat.id}`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(503);
    expect(payload).toMatchObject({
      error: 'not implemented yet',
    });
  });
});
