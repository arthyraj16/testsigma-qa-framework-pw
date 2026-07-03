/**
 * Environments API Test Suite
 * Endpoints: GET/POST/PUT/DELETE /environments, /environments/{id}
 * Base URL: https://app.testsigma.com/api/v1/
 */

import { test, expect } from '@playwright/test';
import { EnvironmentsClient, EnvironmentCreatePayload } from '../clients/environments.client';

test.describe('@api @regression Environments CRUD API', () => {
  let client: EnvironmentsClient;

  test.beforeEach(async ({ request }) => {
    client = new EnvironmentsClient(request);
  });

  test('should retrieve list of environments with valid status and schema', async () => {
    const result = await client.list();

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    if (result.data.length > 0) {
      const env = result.data[0];
      expect(env).toHaveProperty('id');
      expect(env).toHaveProperty('name');
    }
  });

  test('should create a new environment and verify with GET', async () => {
    const envName = `env-test-${Date.now()}`;
    const payload: EnvironmentCreatePayload = {
      name: envName,
      description: 'Test environment for API validation',
    };

    const createResult = await client.create(payload);
    expect([200, 201]).toContain(createResult.status);
    expect(createResult.data).toBeDefined();
    expect(createResult.data.id).toBeDefined();

    const environmentId = createResult.data.id;

    const getResult = await client.get(environmentId);
    expect(getResult.status).toBe(200);
    expect(getResult.data).toBeDefined();
    expect(getResult.data.name).toBe(envName);

    await client.delete(environmentId);
  });

  test('should update an environment and verify changes persist', async () => {
    const envName = `env-update-${Date.now()}`;
    const createPayload: EnvironmentCreatePayload = {
      name: envName,
      description: 'Initial description',
    };

    const createResult = await client.create(createPayload);
    expect([200, 201]).toContain(createResult.status);
    const environmentId = createResult.data.id;

    const updatePayload = {
      description: 'Updated description',
    };
    const updateResult = await client.update(environmentId, updatePayload);
    expect([200, 201]).toContain(updateResult.status);

    const getResult = await client.get(environmentId);
    expect(getResult.status).toBe(200);
    expect(getResult.data.description).toBe(updatePayload.description);

    await client.delete(environmentId);
  });

  test('should delete an environment and verify it returns 404 on subsequent GET', async () => {
    const envName = `env-delete-${Date.now()}`;
    const payload: EnvironmentCreatePayload = {
      name: envName,
      description: 'Environment to be deleted',
    };

    const createResult = await client.create(payload);
    expect([200, 201]).toContain(createResult.status);
    const environmentId = createResult.data.id;

    const getBeforeDelete = await client.get(environmentId);
    expect(getBeforeDelete.status).toBe(200);

    const deleteResult = await client.delete(environmentId);
    expect([200, 204]).toContain(deleteResult.status);

    const getAfterDelete = await client.get(environmentId);
    expect(getAfterDelete.status).toBe(404);
  });

  test('should return 401 when Authorization header is missing', async ({ request }) => {
    const response = await request.get('https://app.testsigma.com/api/v1/environments');
    expect(response.status()).toBe(401);
  });

  test('should return 401 when Authorization token is invalid', async ({ request }) => {
    const response = await request.get(
      'https://app.testsigma.com/api/v1/environments',
      {
        headers: {
          'Authorization': 'Bearer invalid_token_12345',
        },
      }
    );
    expect(response.status()).toBe(401);
  });

  test('should return 404 when getting non-existent environment', async () => {
    const nonExistentId = '999999999';
    const result = await client.get(nonExistentId);
    expect(result.status).toBe(404);
  });

  test('should allow multiple independent environment creations in parallel', async ({
    request,
  }) => {
    const client1 = new EnvironmentsClient(request);
    const client2 = new EnvironmentsClient(request);

    const payload1: EnvironmentCreatePayload = {
      name: `env-parallel-1-${Date.now()}`,
      description: 'First parallel env',
    };

    const payload2: EnvironmentCreatePayload = {
      name: `env-parallel-2-${Date.now()}`,
      description: 'Second parallel env',
    };

    const [result1, result2] = await Promise.all([
      client1.create(payload1),
      client2.create(payload2),
    ]);

    expect([200, 201]).toContain(result1.status);
    expect([200, 201]).toContain(result2.status);

    const id1 = result1.data.id;
    const id2 = result2.data.id;

    expect((await client1.get(id1)).status).toBe(200);
    expect((await client2.get(id2)).status).toBe(200);

    await Promise.all([client1.delete(id1), client2.delete(id2)]);
  });
});
