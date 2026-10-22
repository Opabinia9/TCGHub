import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect } from 'vitest';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userOneHash, userOneAccessToken } from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('/api/v1/chats/', () => {
  it('lets a logged in user create a chat', async () => {
    await createUser({ ...userOne, hash: userOneHash });

    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/chats/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        title: 'test Chat',
        type: 'DIRECT',
        members: [],
      },
    });

    const payload = await response.json();
    expect(response.statusCode).toBe(201);
    expect(payload).toHaveProperty('chatID');
    expect(payload).toMatchObject({
      success: 'Chat created',
    });
  });
});
