import { APIRequestContext } from '@playwright/test';

export interface EnvironmentCreatePayload {
  name: string;
  description?: string;
  variables?: Record<string, string>;
}

export interface Environment {
  id: string | number;
  name: string;
  description?: string;
  variables?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export class EnvironmentsClient {
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

  async list() {
    const response = await this.request.get(`${this.baseURL}/environments`, {
      headers: this.getHeaders(),
    });
    const data = response.ok() ? await response.json() : null;
    return {
      status: response.status(),
      data: data?.content || null,
      response,
    };
  }

  async get(id: string | number) {
    const response = await this.request.get(
      `${this.baseURL}/environments/${id}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async create(payload: EnvironmentCreatePayload) {
    const response = await this.request.post(`${this.baseURL}/environments`, {
      headers: this.getHeaders(),
      data: payload,
    });
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async update(id: string | number, payload: Partial<EnvironmentCreatePayload>) {
    const response = await this.request.put(
      `${this.baseURL}/environments/${id}`,
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

  async delete(id: string | number) {
    const response = await this.request.delete(
      `${this.baseURL}/environments/${id}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      response,
    };
  }
}
