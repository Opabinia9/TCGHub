import { describe, it, expect } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import {
  createUser,
  userOne,
  userOneAccessToken,
  userOneHash,
  userTwo,
  userTwoHash,
} from './helpers/userPresets.js';
import { createChat } from './helpers/chatPresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats/:chatId', () => {
  it('returns details of a chat the user is apart of', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const chat = await createChat('chatOne', 'DIRECT', [userOne.id, userTwo.id]);

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
      members: [userOne.id, userTwo.id],
      last_read_message_id: null,
      joined_at: expect.any(String),
    });
  });
});

describe('PATCH /api/v1/chats/:chatId', () => {
  it('returns service unavailable', async () => {
    await createUser({ ...userOne, hash: userOneHash });
    await createUser({ ...userTwo, hash: userTwoHash });
    const chat = await createChat('chatOne', 'DIRECT', [userOne.id, userTwo.id]);
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
