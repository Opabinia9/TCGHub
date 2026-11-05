import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, afterEach } from 'vitest';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne, userTwo } from './helpers/userPresets.js';
import { prisma } from '../src/utils/prisma.js';

const server = await buildServer({}, ENV);

describe('GET /api/auth/sign-up/email', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('creates user with valid details', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        username: userOne.username,
        email: userOne.email,
        name: userOne.name,
        password: userOne.password,
      },
    });
    const payload = await response.json();
    const databaseUser = await prisma.user.findUnique({
      where: {
        username: userOne.username,
      },
    });
    if (databaseUser === null) {
      throw new Error('user not in database');
    }

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject({
      token: expect.stringMatching(/[a-zA-Z0-9]{32}/),
      user: {
        username: userOne.username,
        email: userOne.email,
        emailVerified: false,
        image: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: userOne.name,
        id: expect.stringMatching(/[a-zA-Z0-9-]{36}/),
      },
    });
    expect(databaseUser).toMatchObject({
      username: userOne.username,
      email: userOne.email,
      name: userOne.name,
    });
    // expect(await verifyPassword(databaseUser.hash, userOnePassword));
  });

  it('blocks signup with used email', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const requestPayload = {
      name: userTwo.name,
      username: userOne.username,
      email: userOne.email,
      password: userTwo.password,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(422);
    expect(responsePayload).toMatchObject({
      message: 'User already exists. Use another email.',
      code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
    });
  });

  it('blocks signup with used username', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const requestPayload = {
      name: userTwo.name,
      username: userOne.username,
      email: userTwo.email,
      password: userTwo.password,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(422);
    expect(responsePayload).toMatchObject({
      message: 'User already exists. Use another email.',
      code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
    });
  });
});
