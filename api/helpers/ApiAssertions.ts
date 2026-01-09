import { expect } from '@playwright/test';
import { ApiResponse } from '../client/ApiClient';

/**
 * API Assertion Helpers
 * 
 * Provides comprehensive assertion methods for API testing
 */
export class ApiAssertions {
  /**
   * Assert response status code
   */
  static expectStatus(response: ApiResponse, expectedStatus: number): void {
    expect(response.status, `Expected status ${expectedStatus}, got ${response.status}`).toBe(expectedStatus);
  }

  /**
   * Assert response status is success (2xx)
   */
  static expectSuccess(response: ApiResponse): void {
    expect(
      response.status,
      `Expected success status (2xx), got ${response.status}`
    ).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  }

  /**
   * Assert response status is client error (4xx)
   */
  static expectClientError(response: ApiResponse): void {
    expect(
      response.status,
      `Expected client error (4xx), got ${response.status}`
    ).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  }

  /**
   * Assert response status is server error (5xx)
   */
  static expectServerError(response: ApiResponse): void {
    expect(
      response.status,
      `Expected server error (5xx), got ${response.status}`
    ).toBeGreaterThanOrEqual(500);
    expect(response.status).toBeLessThan(600);
  }

  /**
   * Assert response has header
   */
  static expectHeader(response: ApiResponse, headerName: string, value?: string | RegExp): void {
    expect(response.headers, `Header ${headerName} not found`).toHaveProperty(headerName.toLowerCase());
    
    if (value !== undefined) {
      const headerValue = response.headers[headerName.toLowerCase()];
      if (typeof value === 'string') {
        expect(headerValue).toBe(value);
      } else {
        expect(headerValue).toMatch(value);
      }
    }
  }

  /**
   * Assert response body matches expected value
   */
  static expectBody<T>(response: ApiResponse<T>, expected: T | ((body: T) => boolean)): void {
    if (typeof expected === 'function') {
      const predicate = expected as (body: T) => boolean;
      expect(predicate(response.body), 'Response body does not match predicate').toBe(true);
    } else {
      expect(response.body).toEqual(expected);
    }
  }

  /**
   * Assert response body contains field
   */
  static expectField(response: ApiResponse, fieldPath: string, value?: any): void {
    const fieldValue = this.getNestedField(response.body, fieldPath);
    expect(fieldValue, `Field ${fieldPath} not found`).toBeDefined();
    
    if (value !== undefined) {
      expect(fieldValue).toEqual(value);
    }
  }

  /**
   * Assert response body has field type
   */
  static expectFieldType(response: ApiResponse, fieldPath: string, type: 'string' | 'number' | 'boolean' | 'object' | 'array'): void {
    const fieldValue = this.getNestedField(response.body, fieldPath);
    expect(fieldValue, `Field ${fieldPath} not found`).toBeDefined();
    
    const actualType = Array.isArray(fieldValue) ? 'array' : typeof fieldValue;
    expect(actualType, `Field ${fieldPath} expected type ${type}, got ${actualType}`).toBe(type);
  }

  /**
   * Assert response time is within limit
   */
  static expectResponseTime(response: ApiResponse, maxTimeMs: number): void {
    // Note: Playwright doesn't expose response time directly
    // This would need to be measured separately or use a custom wrapper
    // For now, this is a placeholder for the pattern
  }

  /**
   * Assert response body matches schema (basic validation)
   */
  static expectSchema(response: ApiResponse, schema: Record<string, string>): void {
    const body = response.body as Record<string, any>;
    
    for (const [field, expectedType] of Object.entries(schema)) {
      expect(body, `Field ${field} not found`).toHaveProperty(field);
      const actualType = Array.isArray(body[field]) ? 'array' : typeof body[field];
      expect(actualType, `Field ${field} expected type ${expectedType}, got ${actualType}`).toBe(expectedType);
    }
  }

  /**
   * Assert response body is array
   */
  static expectArray(response: ApiResponse, minLength?: number, maxLength?: number): void {
    expect(Array.isArray(response.body), 'Response body is not an array').toBe(true);
    
    const array = response.body as any[];
    
    if (minLength !== undefined) {
      expect(array.length, `Array length ${array.length} is less than ${minLength}`).toBeGreaterThanOrEqual(minLength);
    }
    
    if (maxLength !== undefined) {
      expect(array.length, `Array length ${array.length} is greater than ${maxLength}`).toBeLessThanOrEqual(maxLength);
    }
  }

  /**
   * Assert response body is object
   */
  static expectObject(response: ApiResponse): void {
    expect(response.body, 'Response body is not an object').toBeInstanceOf(Object);
    expect(Array.isArray(response.body), 'Response body is an array, not an object').toBe(false);
  }

  /**
   * Get nested field value from object using dot notation
   */
  private static getNestedField(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
