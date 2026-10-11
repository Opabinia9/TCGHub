import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { ENV } from '../src/utils/env.js';
import {
  badEmail,
  createDefaultUser,
  defaultUserDetails,
  invalidUserDetails,
} from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('/api/v1/auth/login', () => {
  beforeEach(async () => {
    await createDefaultUser();
  });

  it('accepts valid credentials', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: defaultUserDetails.email,
        password: defaultUserDetails.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('access_token');
  });

  it('rejects invalid credentials', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUserDetails.email,
        password: invalidUserDetails.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });

  it('rejects payload without email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        password: defaultUserDetails.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'email'",
    });
  });

  it('rejects payload with bad email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: badEmail,
        password: defaultUserDetails.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/email must match format "email"',
    });
  });

  it('rejects payload with invalid email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUserDetails.email,
        password: defaultUserDetails.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });

  it('rejects payload without password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: defaultUserDetails.email,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      statusCode: 400,
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'password'",
    });
  });

  it('rejects payload with invalid password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: defaultUserDetails.email,
        password: invalidUserDetails.password,
      },
    });
    const payload = await response.json();
    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      error: 'Invalid credentials',
    });
  });
});
