import { APIRequestContext } from '@playwright/test';

export interface Upload {
  id: string | number;
  name: string;
  path?: string;
  fileSize?: number;
  uploadedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class UploadsClient {
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
    const response = await this.request.get(`${this.baseURL}/uploads`, {
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
      `${this.baseURL}/uploads/${id}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }
}
