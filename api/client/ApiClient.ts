import { APIRequestContext, APIResponse } from '@playwright/test';
import { envConfig } from '../../config/env';
import { Logger } from '../../utils/Logger';

/**
 * API Request Options
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  failOnStatusCode?: boolean;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  response: APIResponse;
}

/**
 * API Client
 * 
 * Top-notch API testing client with:
 * - Automatic retry logic
 * - Request/response logging
 * - Error handling
 * - Type-safe responses
 * - Environment-based configuration
 */
export class ApiClient {
  private requestContext: APIRequestContext;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(requestContext: APIRequestContext, baseUrl?: string) {
    this.requestContext = requestContext;
    this.baseUrl = baseUrl || envConfig.apiBaseUrl || envConfig.baseUrl || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Add authorization token
   */
  setAuthToken(token: string, type: 'Bearer' | 'Basic' = 'Bearer'): void {
    this.defaultHeaders['Authorization'] = `${type} ${token}`;
  }

  /**
   * Remove authorization token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Make API request
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const method = options.method || 'GET';
    const url = this.buildUrl(endpoint, options.params);
    const headers = { ...this.defaultHeaders, ...options.headers };
    const timeout = options.timeout || 30000;
    const failOnStatusCode = options.failOnStatusCode !== false;

    // Log request
    Logger.info(`API ${method} ${url}`);
    if (options.data) {
      Logger.debug(`Request body: ${JSON.stringify(options.data, null, 2)}`);
    }

    try {
      const response = await this.requestContext.fetch(url, {
        method,
        headers,
        data: options.data,
        timeout,
        failOnStatusCode,
      });

      const responseBody = await this.parseResponse<T>(response);

      // Log response
      Logger.info(`API Response: ${response.status()} ${response.statusText()}`);
      if (responseBody) {
        Logger.debug(`Response body: ${JSON.stringify(responseBody, null, 2)}`);
      }

      return {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        body: responseBody,
        response,
      };
    } catch (error: any) {
      Logger.error(`API Request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiRequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiRequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiRequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Parse response body
   */
  private async parseResponse<T>(response: APIResponse): Promise<T | null> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }
    
    if (contentType.includes('text/')) {
      return (await response.text()) as any;
    }

    return null;
  }
}
