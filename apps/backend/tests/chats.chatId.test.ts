import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userTwo } from './helpers/userPresets.js';
import { createChat, invalidChatId } from './helpers/chatPresets.js';
import { createMessage } from './helpers/messagePresets.js';
import { prisma } from '../src/utils/prisma.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/chats/:chatId', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

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
    expect(payload).toMatchObject({
      id: chat.id,
      type: chat.type,
      name: chat.name,
      createdAt: chat.createdAt.toISOString(),
      members: [{ id: userOneDetails.user.id }, { id: userTwoDetails.user.id }],
      lastReadMessageId: null,
      joinedAt: expect.any(String),
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
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

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

describe('PUT /api/v1/chats/:chatId', () => {
  afterEach(() => {
    const found = [...server.specViolations];
    server.specViolations.length = 0;
    expect(found).toEqual([]);
  });

  it('updates last read message in chat successfully', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userTwoDetails = await createUser({ ...userTwo });
    const userOneAccessToken = userOneDetails.token;
    const chat = await createChat('chatOne', 'DIRECT', [
      userOneDetails.user.id,
      userTwoDetails.user.id,
    ]);
    const message = await createMessage(chat.id, userOneDetails.user.id, 'here have some text');
    const response = await server.inject({
      method: 'PUT',
      url: `/api/v1/chats/${chat.id}`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      body: { messageId: message.id },
    });
    const payload = await response.json();
    const databaseChatMember = await prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId: chat.id, userId: userOneDetails.user.id } },
    });

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject({
      success: 'Last Read Update Successfull',
    });
    expect(databaseChatMember).not.toBeNull();
    expect(databaseChatMember?.lastReadMessageId).toBe(message.id);
  });

  it('handles chat not found', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const userOneAccessToken = userOneDetails.token;
    const response = await server.inject({
      method: 'PUT',
      url: `/api/v1/chats/${invalidChatId}`,
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
      body: { messageId: invalidChatId },
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(404);
    expect(payload).toMatchObject({
      error: 'Chat Not Found',
    });
  });
});
