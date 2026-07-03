/**
 * Uploads API Test Suite
 * Endpoints: GET /uploads, GET /uploads/{id}, POST /uploads
 * Base URL: https://app.testsigma.com/api/v1/
 */

import { test, expect } from '@playwright/test';
import { UploadsClient } from '../clients/uploads.client';

test.describe('@api @regression Uploads API', () => {
  let client: UploadsClient;

  test.beforeEach(async ({ request }) => {
    client = new UploadsClient(request);
  });

  test('should retrieve list of uploads with valid status and schema', async () => {
    const result = await client.list();

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    if (result.data.length > 0) {
      const upload = result.data[0];
      expect(upload).toHaveProperty('id');
      expect(upload).toHaveProperty('name');
    }
  });

  test('should return 401 when Authorization header is missing', async ({
    request,
  }) => {
    const response = await request.get(
      'https://app.testsigma.com/api/v1/uploads'
    );
    expect(response.status()).toBe(401);
  });

  test('should return 404 when getting non-existent upload', async () => {
    const result = await client.get('999999999');
    expect(result.status).toBe(404);
  });
});
