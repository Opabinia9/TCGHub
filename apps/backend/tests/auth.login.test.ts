import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ENV } from '../src/utils/env.js';
import { badEmail, createUser, invalidUser, userOne } from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('POST /api/auth/sign-in/email', () => {
  beforeEach(async () => {
    const userOneDetails = await createUser({ ...userOne });
  });

  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('accepts valid credentials', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
        password: userOne.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('token');
  });

  it('rejects invalid credentials', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUser.email,
        password: invalidUser.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      code: 'INVALID_EMAIL_OR_PASSWORD',
      message: 'Invalid email or password',
    });
  });

  it('rejects payload without email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        password: userOne.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: '[body.email] Invalid input: expected string, received undefined',
    });
  });

  it('rejects payload with bad email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: badEmail,
        password: userOne.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      code: 'INVALID_EMAIL',
      message: 'Invalid email',
    });
  });

  it('rejects payload with invalid email', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: invalidUser.email,
        password: userOne.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      code: 'INVALID_EMAIL_OR_PASSWORD',
      message: 'Invalid email or password',
    });
  });

  it('rejects payload without password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(400);
    expect(payload).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: '[body.password] Invalid input: expected string, received undefined',
    });
  });

  it('rejects payload with invalid password', async () => {
    const response: LightMyRequestResponse = await server.inject({
      method: 'post',
      url: '/api/auth/sign-in/email',
      headers: { 'content-type': 'application/json' },
      payload: {
        email: userOne.email,
        password: invalidUser.password,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(401);
    expect(payload).toMatchObject({
      code: 'INVALID_EMAIL_OR_PASSWORD',
      message: 'Invalid email or password',
    });
  });
});
