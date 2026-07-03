/**
 * Projects API Test Suite
 * Endpoints: GET /projects, GET /projects/{id}
 * Base URL: https://app.testsigma.com/api/v1/
 */

import { test, expect } from '@playwright/test';
import { ProjectsClient } from '../clients/projects.client';

test.describe('@api @regression Projects API', () => {
  let client: ProjectsClient;

  test.beforeEach(async ({ request }) => {
    client = new ProjectsClient(request);
  });

  test('should retrieve list of projects with valid status and schema', async () => {
    const result = await client.list();

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    if (result.data.length > 0) {
      const project = result.data[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
    }
  });

  test('should return 401 when Authorization header is missing', async ({
    request,
  }) => {
    const response = await request.get(
      'https://app.testsigma.com/api/v1/projects'
    );
    expect(response.status()).toBe(401);
  });

  test('should return 404 when getting non-existent project', async () => {
    const result = await client.get('999999999');
    expect(result.status).toBe(404);
  });
});
