import { APIRequestContext } from '@playwright/test';

export interface TestDataProfilePayload {
  name: string;
  description?: string;
  data?: Record<string, any>;
}

export interface TestDataProfile {
  id: string | number;
  name: string;
  description?: string;
  data?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export class TestDataProfilesClient {
  private baseURL: string;
  private apiKey: string;

  constructor(
    private request: APIRequestContext,
    baseURL = 'https://app.testsigma.com/api/v1'
  ) {
    this.baseURL = baseURL;
    this.apiKey = process.env.TESTSIGMA_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('TESTSIGMA_API_KEY environment variable is not set');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async create(payload: TestDataProfilePayload) {
    const response = await this.request.post(
      `${this.baseURL}/test_data_profiles`,
      {
        headers: this.getHeaders(),
        data: payload,
      }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async get(id: string | number) {
    const response = await this.request.get(
      `${this.baseURL}/test_data_profiles/${id}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async update(id: string | number, payload: Partial<TestDataProfilePayload>) {
    const response = await this.request.put(
      `${this.baseURL}/test_data_profiles/${id}`,
      {
        headers: this.getHeaders(),
        data: payload,
      }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async list() {
    const response = await this.request.get(
      `${this.baseURL}/test_data_profiles`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = response.ok() ? await response.json() : null;
    return {
      status: response.status(),
      data: data?.content || null,
      response,
    };
  }
}
