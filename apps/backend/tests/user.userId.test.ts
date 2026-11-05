import { describe, it, expect, afterEach } from 'vitest';
import { LightMyRequestResponse } from 'fastify';
import buildServer from '../src/app.js';
import { ENV } from '../src/utils/env.js';
import { createUser, userOne } from './helpers/userPresets.js';

const server = await buildServer({}, ENV);

describe('GET /api/v1/user/:userId', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('returns service unavailable', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const response: LightMyRequestResponse = await server.inject({
      method: 'GET',
      url: `/api/v1/user/${userOneDetails.user.id}`,
      headers: {
        Authorization: `Bearer ${userOneDetails.token}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(503);
    expect(payload).toMatchObject({
      error: 'not implemented yet',
    });
  });
});

describe('PATCH /api/v1/user/:userId', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('returns service unavailable', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const response: LightMyRequestResponse = await server.inject({
      method: 'PATCH',
      url: `/api/v1/user/${userOneDetails.user.id}`,
      headers: {
        Authorization: `Bearer ${userOneDetails.token}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(503);
    expect(payload).toMatchObject({
      error: 'not implemented yet',
    });
  });
});

describe('DELETE /api/v1/user/:userId', () => {
  // afterEach(() => {
  //   const found = [...server.specViolations];
  //   server.specViolations.length = 0;
  //   expect(found).toEqual([]);
  // });

  it('returns service unavailable', async () => {
    const userOneDetails = await createUser({ ...userOne });
    const response: LightMyRequestResponse = await server.inject({
      method: 'DELETE',
      url: `/api/v1/user/${userOneDetails.user.id}`,
      headers: {
        Authorization: `Bearer ${userOneDetails.token}`,
      },
    });
    const payload = await response.json();

    expect(response.statusCode).toBe(503);
    expect(payload).toMatchObject({
      error: 'not implemented yet',
    });
  });
});
