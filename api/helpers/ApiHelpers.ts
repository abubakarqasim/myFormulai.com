import { ApiClient } from '../client/ApiClient';
import { RetryHelper } from '../../utils/RetryHelper';

/**
 * API Helper Utilities
 * 
 * Provides common utilities for API testing
 */
export class ApiHelpers {
  /**
   * Wait for API endpoint to be available
   */
  static async waitForEndpoint(
    client: ApiClient,
    endpoint: string,
    options: {
      timeout?: number;
      interval?: number;
      expectedStatus?: number;
    } = {}
  ): Promise<void> {
    const timeout = options.timeout || 30000;
    const interval = options.interval || 1000;
    const expectedStatus = options.expectedStatus || 200;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const response = await client.get(endpoint);
        if (response.status === expectedStatus) {
          return;
        }
      } catch {
        // Continue waiting
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Endpoint ${endpoint} did not become available within ${timeout}ms`);
  }

  /**
   * Retry API request with exponential backoff
   */
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    options: {
      maxRetries?: number;
      initialDelay?: number;
      retryOnStatus?: number[];
    } = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3;
    const initialDelay = options.initialDelay || 1000;
    const retryOnStatus = options.retryOnStatus || [500, 502, 503, 504];

    return RetryHelper.retryWithExponentialBackoff(
      async () => {
        const result = await requestFn();
        
        // If result is an ApiResponse, check status
        if (result && typeof result === 'object' && 'status' in result) {
          const response = result as any;
          if (retryOnStatus.includes(response.status)) {
            throw new Error(`Received retryable status ${response.status}`);
          }
        }
        
        return result;
      },
      maxRetries,
      initialDelay
    );
  }

  /**
   * Extract value from response using JSONPath-like syntax
   */
  static extractValue(response: any, path: string): any {
    const parts = path.split('.');
    let value = response.body || response;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      
      // Handle array indices like "items[0]"
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        value = value[key]?.[parseInt(index)];
      } else {
        value = value[part];
      }
    }
    
    return value;
  }

  /**
   * Build query string from object
   */
  static buildQueryString(params: Record<string, string | number | boolean>): string {
    return new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
  }

  /**
   * Validate response structure
   */
  static validateResponseStructure(
    response: any,
    requiredFields: string[]
  ): { valid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      const value = this.extractValue(response, field);
      if (value === undefined || value === null) {
        missingFields.push(field);
      }
    }
    
    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Compare two API responses
   */
  static compareResponses(
    response1: any,
    response2: any,
    fieldsToCompare?: string[]
  ): { equal: boolean; differences: string[] } {
    const differences: string[] = [];
    
    if (!fieldsToCompare) {
      // Compare entire responses
      if (JSON.stringify(response1) !== JSON.stringify(response2)) {
        differences.push('Response bodies differ');
      }
    } else {
      // Compare specific fields
      for (const field of fieldsToCompare) {
        const value1 = this.extractValue(response1, field);
        const value2 = this.extractValue(response2, field);
        
        if (JSON.stringify(value1) !== JSON.stringify(value2)) {
          differences.push(`Field ${field}: ${JSON.stringify(value1)} !== ${JSON.stringify(value2)}`);
        }
      }
    }
    
    return {
      equal: differences.length === 0,
      differences,
    };
  }
}
