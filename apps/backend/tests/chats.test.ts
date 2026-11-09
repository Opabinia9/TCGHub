import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userTwo } from './helpers/userPresets.js';
import { ChatDetailsInterface, createChats } from './helpers/chatPresets.js';
import { auth } from '../src/utils/auth.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('returns chats user is part of', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = (
      await auth.api.signInEmail({
        body: { email: userOne.email, password: userOne.password },
      })
    ).token;
    const createChatsInput: Array<ChatDetailsInterface> = [
      {
        name: 'chatOne',
        type: 'DIRECT',
        memberIDs: [userOneDetails.user.id, userTwoDetails.user.id],
      },
      {
        name: 'chatTwo',
        type: 'DIRECT',
        memberIDs: [userOneDetails.user.id, userTwoDetails.user.id],
      },
      {
        name: 'chatThree',
        type: 'GROUP',
        memberIDs: [userOneDetails.user.id, userTwoDetails.user.id],
      },
    ];
    const savedChats = await createChats(createChatsInput);

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/chats/',
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });
    const payload: { success: string; chats: Array<{}> } = await response.json();

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('success');
    expect(payload).toHaveProperty('chats');
    expect(payload.chats).toHaveLength(createChatsInput.length);
    payload.chats.reverse().forEach((x, idx) => {
      expect(x).toEqual({
        id: savedChats[idx].id,
        type: createChatsInput[idx].type,
        name: createChatsInput[idx].name,
        createdAt: savedChats[idx].createdAt.toISOString(),
        members: createChatsInput[idx].memberIDs,
        lastReadMessageId: null,
        joinedAt: expect.any(String),
      });
    });
  });

  it('blocks unverified user', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'GET',
      url: '/api/v1/chats/',
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(401);
    expect(payload).toEqual({
      error: 'Unauthorized',
    });
  });
});

describe('POST /api/v1/chats', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });
  it('lets a logged in user create a chat', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/chats/',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      payload: {
        name: 'test Chat',
        type: 'DIRECT',
        members: [userTwoDetails.user.id],
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
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });
  it('returns service unavailable', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userOneAccessToken = userOneDetails.token;
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
