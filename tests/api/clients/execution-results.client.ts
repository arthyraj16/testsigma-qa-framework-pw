import { APIRequestContext } from '@playwright/test';

export interface ExecutionResultPayload {
  executionId: string | number;
  environmentId?: string | number;
}

export interface ExecutionResult {
  id: string | number;
  executionId: string | number;
  environmentId?: string | number;
  status?: string;
  result?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export class ExecutionResultsClient {
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

  async trigger(payload: ExecutionResultPayload) {
    const response = await this.request.post(
      `${this.baseURL}/execution_results`,
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

  async getStatus(runId: string | number) {
    const response = await this.request.get(
      `${this.baseURL}/execution_results/${runId}`,
      { headers: this.getHeaders() }
    );
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      response,
    };
  }

  async pollUntilComplete(
    runId: string | number,
    maxWaitMs = 30000,
    pollIntervalMs = 2000
  ) {
    const startTime = Date.now();
    const completeStatuses = ['COMPLETED', 'PASSED', 'FAILED', 'STOPPED'];

    while (Date.now() - startTime < maxWaitMs) {
      const result = await this.getStatus(runId);

      if (
        result.data &&
        completeStatuses.includes(result.data.status?.toUpperCase())
      ) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(
      `Execution ${runId} did not complete within ${maxWaitMs}ms`
    );
  }
}
