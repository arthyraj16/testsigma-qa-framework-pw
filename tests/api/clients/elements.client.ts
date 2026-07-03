import { APIRequestContext } from '@playwright/test';

export interface ElementCreatePayload {
  name: string;
  elementType?: string;
  locator?: string;
  description?: string;
}

export interface Element {
  id: string | number;
  name: string;
  elementType?: string;
  locator?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class ElementsClient {
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
    const response = await this.request.get(`${this.baseURL}/elements`, {
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
    const response = await this.request.get(`${this.baseURL}/elements/${id}`, {
      headers: this.getHeaders(),
    });
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async create(payload: ElementCreatePayload) {
    const response = await this.request.post(`${this.baseURL}/elements`, {
      headers: this.getHeaders(),
      data: payload,
    });
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async update(id: string | number, payload: Partial<ElementCreatePayload>) {
    const response = await this.request.put(`${this.baseURL}/elements/${id}`, {
      headers: this.getHeaders(),
      data: payload,
    });
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async delete(id: string | number) {
    const response = await this.request.delete(
      `${this.baseURL}/elements/${id}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      response,
    };
  }
}
