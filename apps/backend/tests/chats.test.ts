import { describe, it, expect } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userOneAccessToken, userOneHash } from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats', () => {
  it('returns service unavailable', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/chats/',
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

describe('POST /api/v1/chats', () => {
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

describe('DELETE /api/v1/chats/', () => {
  it('returns service unavailable', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/v1/chats/',
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
