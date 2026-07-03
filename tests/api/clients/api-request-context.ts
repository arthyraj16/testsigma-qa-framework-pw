/**
 * API Request Context Fixtures and Helpers
 * Provides fixtures for easy access to APIRequestContext in tests
 */

import { test as baseTest, APIRequestContext } from '@playwright/test';

/**
 * Extended test context with API client
 */
export const test = baseTest.extend<{
  apiContext: APIRequestContext;
  apiBaseUrl: string;
}>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://app.testsigma.com/api/v1',
      extraHTTPHeaders: {
        'User-Agent': 'Playwright-API-Tests/1.0',
        'X-Test-Run-ID': `test-${Date.now()}`,
      },
    });

    await use(context);
    await context.dispose();
  },

  apiBaseUrl: async ({ }, use) => {
    const baseUrl = process.env.API_BASE_URL || 'https://app.testsigma.com/api/v1';
    await use(baseUrl);
  },
});

/**
 * API Request Builder for constructing complex requests
 */
export class ApiRequestBuilder {
  private method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET';
  private url: string = '';
  private headers: Record<string, string> = {};
  private body: any = null;
  private queryParams: Record<string, string | number | boolean> = {};
  private timeout: number = 30000;

  /**
   * Set HTTP method
   */
  setMethod(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'): this {
    this.method = method;
    return this;
  }

  /**
   * Set URL
   */
  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Add header
   */
  addHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  /**
   * Add multiple headers
   */
  addHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Set Authorization header
   */
  setAuthorization(token: string, scheme: string = 'Bearer'): this {
    this.headers['Authorization'] = `${scheme} ${token}`;
    return this;
  }

  /**
   * Set request body (JSON)
   */
  setJsonBody(data: any): this {
    this.body = data;
    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  /**
   * Set request body (Form)
   */
  setFormBody(data: Record<string, string>): this {
    this.body = new URLSearchParams(data).toString();
    this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return this;
  }

  /**
   * Add query parameter
   */
  addQueryParam(name: string, value: string | number | boolean): this {
    this.queryParams[name] = value;
    return this;
  }

  /**
   * Add multiple query parameters
   */
  addQueryParams(params: Record<string, string | number | boolean>): this {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * Set request timeout
   */
  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  /**
   * Build the request options object
   */
  build(): {
    method: string;
    headers: Record<string, string>;
    data?: any;
    timeout: number;
    params: Record<string, string | number | boolean>;
  } {
    return {
      method: this.method,
      headers: this.headers,
      data: this.body,
      timeout: this.timeout,
      params: this.queryParams,
    };
  }

  /**
   * Get full URL with query parameters
   */
  getFullUrl(): string {
    if (Object.keys(this.queryParams).length === 0) {
      return this.url;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(this.queryParams)) {
      params.append(key, String(value));
    }

    return `${this.url}?${params.toString()}`;
  }

  /**
   * Get request summary for logging
   */
  getSummary(): string {
    return `
${this.method} ${this.getFullUrl()}
Headers: ${JSON.stringify(this.headers, null, 2)}
Body: ${this.body ? JSON.stringify(this.body).substring(0, 200) : 'none'}
    `.trim();
  }
}

/**
 * Create a new API request builder
 */
export function buildRequest(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string): ApiRequestBuilder {
  return new ApiRequestBuilder().setMethod(method).setUrl(url);
}

/**
 * Common builder shortcuts
 */
export const ApiRequest = {
  get: (url: string) => buildRequest('GET', url),
  post: (url: string) => buildRequest('POST', url),
  put: (url: string) => buildRequest('PUT', url),
  patch: (url: string) => buildRequest('PATCH', url),
  delete: (url: string) => buildRequest('DELETE', url),
};
