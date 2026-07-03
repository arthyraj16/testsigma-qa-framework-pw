/**
 * Applications API Test Suite
 * Endpoints: GET /applications, GET /applications/{id}
 * Base URL: https://app.testsigma.com/api/v1/
 */

import { test, expect } from '@playwright/test';
import { ApplicationsClient } from '../clients/applications.client';

test.describe('@api @regression Applications API', () => {
  let client: ApplicationsClient;

  test.beforeEach(async ({ request }) => {
    client = new ApplicationsClient(request);
  });

  test('should retrieve list of applications with valid status and schema', async () => {
    const result = await client.list();

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    if (result.data.length > 0) {
      const app = result.data[0];
      expect(app).toHaveProperty('id');
      expect(app).toHaveProperty('name');
    }
  });

  test('should return 401 when Authorization header is missing', async ({
    request,
  }) => {
    const response = await request.get(
      'https://app.testsigma.com/api/v1/applications'
    );
    expect(response.status()).toBe(401);
  });

  test('should return 404 when getting non-existent application', async () => {
    const result = await client.get('999999999');
    expect(result.status).toBe(404);
  });
});
