import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect } from 'vitest';
import { ENV } from '../src/utils/env.js';
import {
  createDefaultUser,
  defaultUser2Details,
  defaultUserDetails,
} from './helpers/userPresets.js';
import { prisma } from '../src/utils/prisma.js';
import { UserCreationInterface } from '../src/types/userObject.js';

const server = await buildServer({}, ENV);

describe('/api/v1/auth/signup', () => {
  it('creates user with valid details', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: defaultUserDetails,
    });
    const payload = await response.json();
    const databaseUser = await prisma.user.findUnique({
      where: {
        username: defaultUserDetails.username,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(payload).toMatchObject({ response: 'Account creation successful' });
    expect(databaseUser).toMatchObject(defaultUserDetails);
  });

  it('blocks signup with used email', async () => {
    await createDefaultUser();
    const requestPayload: UserCreationInterface = {
      ...defaultUser2Details,
      email: defaultUserDetails.email,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(responsePayload).toMatchObject({ error: 'Email already registered' });
  });

  it('blocks signup with used username', async () => {
    await createDefaultUser();
    const requestPayload: UserCreationInterface = {
      ...defaultUser2Details,
      username: defaultUserDetails.username,
    };
    const response: LightMyRequestResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/signup',
      headers: { 'content-type': 'application/json' },
      payload: requestPayload,
    });
    const responsePayload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(responsePayload).toMatchObject({ error: 'Username already registered' });
  });
});
