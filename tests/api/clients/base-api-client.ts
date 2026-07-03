/**
 * Base API Client with Request/Response handling
 * Provides common functionality for all API clients
 */

import { APIRequestContext, APIResponse } from '@playwright/test';

export interface RequestConfig {
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  ok: boolean;
  data: T | null;
  headers: Record<string, string>;
  response: APIResponse;
  error?: string;
}

export interface ApiRequestOptions extends RequestConfig {
  retries?: number;
  retryDelay?: number;
  validateStatus?: (status: number) => boolean;
}

export class BaseApiClient {
  protected baseURL: string;
  protected defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  protected timeout: number = 30000;

  constructor(
    protected request: APIRequestContext,
    baseURL: string
  ) {
    this.baseURL = baseURL;
  }

  /**
   * Get merged headers with defaults
   */
  protected getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  /**
   * Make GET request
   */
  async get<T = any>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request_internal<T>('GET', path, options);
  }

  /**
   * Make POST request
   */
  async post<T = any>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request_internal<T>('POST', path, options);
  }

  /**
   * Make PUT request
   */
  async put<T = any>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request_internal<T>('PUT', path, options);
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request_internal<T>('PATCH', path, options);
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request_internal<T>('DELETE', path, options);
  }

  /**
   * Internal request handler with retry logic
   */
  private async request_internal<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const retries = options?.retries ?? 0;
    const retryDelay = options?.retryDelay ?? 1000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const url = `${this.baseURL}${path}`;
        const config = {
          headers: this.getHeaders(options?.headers),
          timeout: options?.timeout ?? this.timeout,
        };

        let response: APIResponse;

        switch (method) {
          case 'GET':
            response = await this.request.get(url, config);
            break;
          case 'POST':
            response = await this.request.post(url, { ...config, data: options?.data });
            break;
          case 'PUT':
            response = await this.request.put(url, { ...config, data: options?.data });
            break;
          case 'PATCH':
            response = await this.request.patch(url, { ...config, data: options?.data });
            break;
          case 'DELETE':
            response = await this.request.delete(url, config);
            break;
        }

        return this.parseResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      status: 0,
      statusText: 'Failed',
      ok: false,
      data: null,
      headers: {},
      response: null as any,
      error: lastError?.message,
    };
  }

  /**
   * Parse API response
   */
  private async parseResponse<T = any>(response: APIResponse): Promise<ApiResponse<T>> {
    let data: T | null = null;
    let error: string | undefined;

    try {
      const contentType = response.headers()['content-type'] || '';

      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        data = jsonData as T;
      } else if (contentType.includes('text/')) {
        data = (await response.text()) as any;
      }
    } catch (e) {
      error = `Failed to parse response: ${(e as Error).message}`;
    }

    return {
      status: response.status(),
      statusText: response.statusText(),
      ok: response.ok(),
      data,
      headers: response.headers(),
      response,
      error,
    };
  }
}

/**
 * API Request interceptor for logging and debugging
 */
export class ApiRequestInterceptor {
  constructor(private request: APIRequestContext) {}

  /**
   * Log request before sending
   */
  logRequest(method: string, url: string, options?: RequestConfig): void {
    console.log(`\n📤 [${method}] ${url}`);
    if (options?.headers) {
      console.log('   Headers:', Object.keys(options.headers));
    }
    if (options?.data) {
      console.log('   Body:', JSON.stringify(options.data).substring(0, 200));
    }
  }

  /**
   * Log response after receiving
   */
  logResponse(status: number, response: APIResponse): void {
    console.log(
      `📥 Response: ${status} ${response.statusText()} (${response.ok() ? '✅' : '❌'})`
    );
  }

  /**
   * Extract and log error details
   */
  async logError(error: Error, response?: APIResponse): Promise<void> {
    console.error(`❌ Error: ${error.message}`);
    if (response) {
      try {
        const body = await response.text();
        console.error('   Response Body:', body.substring(0, 200));
      } catch (e) {
        // Response already consumed
      }
    }
  }
}

/**
 * API Response validator
 */
export class ApiResponseValidator {
  /**
   * Validate response status
   */
  static validateStatus(response: ApiResponse, expectedStatus: number | number[]): boolean {
    const statuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    return statuses.includes(response.status);
  }

  /**
   * Validate response data structure
   */
  static validateSchema<T>(
    data: T,
    requiredFields: (keyof T)[]
  ): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (!(field in data) || (data[field] === null || data[field] === undefined)) {
        missing.push(String(field));
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Validate response is JSON
   */
  static isValidJson(data: any): boolean {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    return true;
  }

  /**
   * Validate array response
   */
  static isValidArray<T>(data: any): data is T[] {
    return Array.isArray(data);
  }
}
