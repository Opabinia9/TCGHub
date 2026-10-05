import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, expectTypeOf } from 'vitest';

const server = buildServer();

describe('/api/v1/auth/login', () => {
  it('accepts valid credentials', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'seb.price@gmail.com',
          password: 'password',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('access_token');
    } catch (err) {
      throw err;
    }
  });
  it('rejects invalid credentials', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'name@email.com',
          password: 'wordpass',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(401);
      expect(payload).toMatchObject({
        error: 'Invalid credentials',
      });
    } catch (err) {
      throw err;
    }
  });
  it('provides a valid access token', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'seb.price@gmail.com',
          password: 'password',
        },
      });
      const payload = response.json();
      const access_token = payload['access_token'];
      const protectedResponse: LightMyRequestResponse = await server.inject({
        method: 'get',
        url: '/api/v1/auth/protected',
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const protectedPayload = protectedResponse.json();
      console.log(protectedResponse.json());
      console.log(protectedResponse.statusCode);
      expect(protectedResponse.statusCode).toBe(200);
      expect(protectedPayload).toMatchObject({
        response: 'verified and logged in',
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects payload without email', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          password: 'password',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(400);
      expect(payload).toMatchObject({
        statusCode: 400,
        code: 'FST_ERR_VALIDATION',
        error: 'Bad Request',
        message: "body must have required property 'email'",
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects payload with bad email', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'sebpricegmail.com',
          password: 'password',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(400);
      expect(payload).toMatchObject({
        statusCode: 400,
        code: 'FST_ERR_VALIDATION',
        error: 'Bad Request',
        message: 'body/email must match format "email"',
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects payload with invalid email', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'user1@example.com',
          password: 'password',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(401);
      expect(payload).toMatchObject({
        error: 'Invalid credentials',
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects payload without password', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'user@example.com',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(400);
      expect(payload).toMatchObject({
        statusCode: 400,
        code: 'FST_ERR_VALIDATION',
        error: 'Bad Request',
        message: "body must have required property 'password'",
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects payload with invalid password', async () => {
    try {
      const response: LightMyRequestResponse = await server.inject({
        method: 'post',
        url: '/api/v1/auth/login',
        headers: { 'content-type': 'application/json' },
        payload: {
          email: 'seb.price@gmail.com',
          password: 'pass',
        },
      });
      const payload = response.json();
      expect(response.statusCode).toBe(401);
      expect(payload).toMatchObject({
        error: 'Invalid credentials',
      });
    } catch (err) {
      throw err;
    }
  });
});
