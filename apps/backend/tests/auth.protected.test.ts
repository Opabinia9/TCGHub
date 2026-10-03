import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { describe, it, expect, expectTypeOf } from 'vitest';

const server = buildServer();

describe('/api/v1/auth/protected', () => {
  it('accepts a valid access token', async () => {
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
      expect(protectedResponse.statusCode).toBe(200);
      expect(protectedPayload).toMatchObject({
        response: 'verified and logged in',
      });
    } catch (err) {
      throw err;
    }
  });
  it('rejects an invalid access token', async () => {
    try {
      const access_token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAxYTEwMDBmLTlmOTMtNzM0NC1hMzE5LWRkNjIyMGRjOGExNiIsImlhdCI6MTc5MTAwMjM4Nn0.V8vyggGJ4fgFl24zezk5FA0aAYfg1tlJKzGKko-O_xg';
      const protectedResponse: LightMyRequestResponse = await server.inject({
        method: 'get',
        url: '/api/v1/auth/protected',
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const protectedPayload = protectedResponse.json();
      console.log(protectedResponse.json());
      expect(protectedResponse.statusCode).toBe(401);
      expect(protectedPayload).toMatchObject({
        statusCode: 401,
        code: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
        error: 'Unauthorized',
        message: 'Authorization token is invalid: The token signature is invalid.',
      });
    } catch (err) {
      throw err;
    }
  });
});
