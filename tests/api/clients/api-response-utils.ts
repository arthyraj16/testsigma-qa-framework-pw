/**
 * API Request & Response Utilities
 * Helper functions for working with Playwright APIRequest and APIResponse
 */

import { APIRequest, APIResponse } from '@playwright/test';

/**
 * Extract all headers from a response as a key-value object
 */
export async function extractHeaders(response: APIResponse): Promise<Record<string, string>> {
  return response.headers();
}

/**
 * Check if response is JSON
 */
export async function isJsonResponse(response: APIResponse): Promise<boolean> {
  const contentType = response.headers()['content-type'] || '';
  return contentType.includes('application/json');
}

/**
 * Safely parse response as JSON
 */
export async function parseJsonResponse(response: APIResponse): Promise<any | null> {
  try {
    if (await isJsonResponse(response)) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
  }
  return null;
}

/**
 * Get response body as text
 */
export async function getResponseText(response: APIResponse): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    console.error('Failed to read response text:', error);
    return '';
  }
}

/**
 * Get response body as buffer (for binary data)
 */
export async function getResponseBuffer(response: APIResponse): Promise<Buffer> {
  try {
    return await response.body();
  } catch (error) {
    console.error('Failed to read response body:', error);
    return Buffer.alloc(0);
  }
}

/**
 * Check if response indicates an error
 */
export function isErrorResponse(response: APIResponse): boolean {
  return !response.ok();
}

/**
 * Check if response indicates client error (4xx)
 */
export function isClientError(response: APIResponse): boolean {
  return response.status() >= 400 && response.status() < 500;
}

/**
 * Check if response indicates server error (5xx)
 */
export function isServerError(response: APIResponse): boolean {
  return response.status() >= 500;
}

/**
 * Check if response indicates success (2xx)
 */
export function isSuccessResponse(response: APIResponse): boolean {
  return response.ok();
}

/**
 * Get response status and text
 */
export function getResponseStatus(response: APIResponse): { status: number; statusText: string } {
  return {
    status: response.status(),
    statusText: response.statusText(),
  };
}

/**
 * Format response for logging/debugging
 */
export async function formatResponse(response: APIResponse): Promise<string> {
  const { status, statusText } = getResponseStatus(response);
  const headers = await extractHeaders(response);
  const body = await getResponseText(response);

  return `
Status: ${status} ${statusText}
Headers: ${JSON.stringify(headers, null, 2)}
Body: ${body.substring(0, 500)}
  `.trim();
}

/**
 * Response timing information
 */
export interface ResponseTiming {
  ttfb: number; // Time to first byte
  responseTime: number;
}

/**
 * Create a response object with metadata
 */
export interface ResponseMetadata {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  isJson: boolean;
  isError: boolean;
  url: string;
}

/**
 * Extract full response metadata
 */
export async function extractResponseMetadata(
  response: APIResponse
): Promise<ResponseMetadata> {
  const isJson = await isJsonResponse(response);
  const data = isJson ? await parseJsonResponse(response) : await getResponseText(response);

  return {
    status: response.status(),
    statusText: response.statusText(),
    headers: await extractHeaders(response),
    data,
    isJson,
    isError: isErrorResponse(response),
    url: response.url(),
  };
}

/**
 * Response chain for fluent API
 */
export class ResponseChain {
  constructor(private response: APIResponse) {}

  /**
   * Check if response matches expected status
   */
  async hasStatus(expectedStatus: number | number[]): Promise<boolean> {
    const statuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    return statuses.includes(this.response.status());
  }

  /**
   * Check if response has a header
   */
  async hasHeader(headerName: string): Promise<boolean> {
    const headers = await extractHeaders(this.response);
    return headerName.toLowerCase() in headers;
  }

  /**
   * Get header value
   */
  async getHeader(headerName: string): Promise<string | undefined> {
    const headers = await extractHeaders(this.response);
    return headers[headerName.toLowerCase()];
  }

  /**
   * Get response as JSON
   */
  async json(): Promise<any> {
    return parseJsonResponse(this.response);
  }

  /**
   * Get response as text
   */
  async text(): Promise<string> {
    return getResponseText(this.response);
  }

  /**
   * Get response metadata
   */
  async metadata(): Promise<ResponseMetadata> {
    return extractResponseMetadata(this.response);
  }

  /**
   * Assert response is success (2xx)
   */
  assertSuccess(): this {
    if (!isSuccessResponse(this.response)) {
      throw new Error(`Expected successful response, got ${this.response.status()}`);
    }
    return this;
  }

  /**
   * Assert response has error
   */
  assertError(): this {
    if (isSuccessResponse(this.response)) {
      throw new Error(`Expected error response, got ${this.response.status()}`);
    }
    return this;
  }

  /**
   * Assert response status
   */
  assertStatus(expectedStatus: number | number[]): this {
    const statuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    if (!statuses.includes(this.response.status())) {
      throw new Error(
        `Expected status ${statuses.join(' or ')}, got ${this.response.status()}`
      );
    }
    return this;
  }

  /**
   * Get the underlying response
   */
  getRawResponse(): APIResponse {
    return this.response;
  }
}

/**
 * Wrap response for chaining operations
 */
export function chain(response: APIResponse): ResponseChain {
  return new ResponseChain(response);
}
