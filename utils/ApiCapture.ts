import * as fs from 'fs';
import * as path from 'path';
import { Page, Request, Response } from '@playwright/test';

/**
 * API Request/Response structure
 */
export interface ApiCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  postData?: string | object;
  status?: number;
  statusText?: string;
  responseHeaders?: Record<string, string>;
  responseBody?: string | object;
  timestamp: number;
  duration?: number;
}

/**
 * API Capture Utility
 * Captures all API calls during test execution and saves them to JSON files
 */
export class ApiCapture {
  private static readonly API_FOLDER = path.resolve(process.cwd(), 'apis-testcases');
  private apiCalls: Map<string, ApiCall[]> = new Map();
  private requestStartTimes: Map<string, number> = new Map();

  /**
   * Ensure API testcases directory exists
   */
  private static ensureApiDirectory(): void {
    if (!fs.existsSync(this.API_FOLDER)) {
      fs.mkdirSync(this.API_FOLDER, { recursive: true });
    }
  }

  /**
   * Get filename for test case
   * @param testName - Name of the test case
   * @returns Sanitized filename
   */
  private static getTestFileName(testName: string): string {
    // Sanitize test name for filename
    let sanitized = testName
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();
    
    // Extract test file name and test title
    const parts = sanitized.split('---');
    if (parts.length >= 2) {
      const filePart = parts[0].replace(/[^a-zA-Z0-9-]/g, '');
      const titlePart = parts.slice(1).join('-').substring(0, 80);
      sanitized = `${filePart}---${titlePart}`;
    }
    
    return `${sanitized.substring(0, 150)}.json`;
  }

  /**
   * Start capturing API calls for a test
   * @param page - Playwright page object
   * @param testName - Name of the test case
   */
  startCapture(page: Page, testName: string): void {
    const apiCalls: ApiCall[] = [];
    this.apiCalls.set(testName, apiCalls);

    // Listen to all requests
    page.on('request', (request: Request) => {
      const method = request.method().toUpperCase();
      const url = request.url();
      
      // Only capture specific HTTP methods: GET, POST, PUT, PATCH, DELETE
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      const isAllowedMethod = allowedMethods.includes(method);
      
      if (!isAllowedMethod) {
        return; // Skip if not an allowed method
      }

      const isApiCall = this.isApiRequest(url);

      if (isApiCall) {
        const timestamp = Date.now();
        // Use a unique request ID (URL + timestamp + method)
        const requestId = `${method}-${url}-${timestamp}-${Math.random()}`;
        this.requestStartTimes.set(requestId, timestamp);

        const apiCall: ApiCall = {
          url: url,
          method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          headers: request.headers(),
          postData: request.postData() || undefined,
          timestamp: timestamp,
        };

        // Try to parse postData if it's JSON
        if (apiCall.postData && typeof apiCall.postData === 'string') {
          try {
            apiCall.postData = JSON.parse(apiCall.postData);
          } catch {
            // Keep as string if not valid JSON
          }
        }

        apiCalls.push(apiCall);
        console.log(`📡 [API CAPTURE] Captured ${method} request: ${url.substring(0, 100)}`);
      }
    });

    // Listen to all responses
    page.on('response', async (response: Response) => {
      const method = response.request().method().toUpperCase();
      const url = response.url();
      
      // Only capture responses for allowed HTTP methods
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      const isAllowedMethod = allowedMethods.includes(method);
      
      if (!isAllowedMethod) {
        return; // Skip if not an allowed method
      }

      const isApiCall = this.isApiRequest(url);

      if (isApiCall) {
        // Find the most recent request with this URL and method that doesn't have a status yet
        const apiCall = apiCalls
          .filter(call => call.url === url && call.method === method && !call.status)
          .sort((a, b) => b.timestamp - a.timestamp)[0]; // Get the most recent one

        if (apiCall) {
          const requestId = `${method}-${url}`;
          const startTime = this.requestStartTimes.get(requestId);
          const duration = startTime ? Date.now() - startTime : undefined;

          apiCall.status = response.status();
          apiCall.statusText = response.statusText();
          apiCall.responseHeaders = response.headers();
          apiCall.duration = duration;

          // Try to get response body
          try {
            const contentType = response.headers()['content-type'] || '';
            if (contentType.includes('application/json')) {
              apiCall.responseBody = await response.json();
            } else if (contentType.includes('text/')) {
              apiCall.responseBody = await response.text();
            } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
              apiCall.responseBody = await response.text();
            }
          } catch (error) {
            // Response body might not be available or already consumed
            apiCall.responseBody = 'Unable to capture response body';
          }
          
          console.log(`📡 [API CAPTURE] Captured ${method} response: ${response.status()} - ${url.substring(0, 100)}`);
        }
      }
    });
  }

  /**
   * Check if a URL is an API request (not a static asset)
   * @param url - Request URL
   * @returns true if it's an API call
   */
  private isApiRequest(url: string): boolean {
    // Exclude static assets
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map'];
    const urlLower = url.toLowerCase();
    const hasStaticExtension = staticExtensions.some(ext => urlLower.includes(ext));

    // Exclude browser internal requests
    const isBrowserInternal = url.startsWith('chrome-extension://') || 
                              url.startsWith('moz-extension://') ||
                              url.startsWith('data:') ||
                              url.startsWith('blob:') ||
                              url.startsWith('chrome://') ||
                              url.startsWith('about:');

    // Exclude common static asset paths
    const isStaticPath = urlLower.includes('/assets/') ||
                        urlLower.includes('/static/') ||
                        urlLower.includes('/images/') ||
                        urlLower.includes('/fonts/') ||
                        urlLower.includes('/css/') ||
                        urlLower.includes('/js/');

    // Include API-like patterns
    const isApiPattern = url.includes('/api/') ||
                         url.includes('/graphql') ||
                         url.includes('/rest/') ||
                         url.includes('/ajax/') ||
                         url.includes('/endpoint/') ||
                         (url.includes('?') && !hasStaticExtension && !isStaticPath) ||
                         url.match(/\/v\d+\//) !== null; // Versioned APIs

    // Also capture any JSON responses or POST/PUT/DELETE requests to the main domain
    const isHttpMethod = url.match(/https?:\/\//) !== null && 
                       !hasStaticExtension && 
                       !isBrowserInternal && 
                       !isStaticPath;

    return !hasStaticExtension && !isBrowserInternal && !isStaticPath && (isApiPattern || this.looksLikeApi(url) || isHttpMethod);
  }

  /**
   * Check if URL looks like an API endpoint
   * @param url - Request URL
   * @returns true if it looks like an API
   */
  private looksLikeApi(url: string): boolean {
    // Check for common API patterns
    const apiPatterns = [
      /\/api\//i,
      /\/graphql/i,
      /\/rest\//i,
      /\/v\d+\//i, // Versioned APIs
      /\.json$/i,
      /\/ajax\//i,
      /\/endpoint\//i,
    ];

    return apiPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Save captured API calls to file
   * @param testName - Name of the test case
   */
  async saveApiCalls(testName: string): Promise<void> {
    ApiCapture.ensureApiDirectory();

    const apiCalls = this.apiCalls.get(testName) || [];
    const fileName = ApiCapture.getTestFileName(testName);
    const filePath = path.join(ApiCapture.API_FOLDER, fileName);

    // Group API calls by method for summary
    const methodCounts: Record<string, number> = {};
    apiCalls.forEach(call => {
      methodCounts[call.method] = (methodCounts[call.method] || 0) + 1;
    });

    const apiData = {
      testName: testName,
      timestamp: new Date().toISOString(),
      totalCalls: apiCalls.length,
      methodSummary: methodCounts,
      apiCalls: apiCalls,
    };

    try {
      fs.writeFileSync(
        filePath,
        JSON.stringify(apiData, null, 2),
        'utf-8'
      );
      console.log(`✅ API calls saved: ${apiCalls.length} calls → ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to save API calls for ${testName}:`, error);
    }
  }

  /**
   * Get captured API calls for a test
   * @param testName - Name of the test case
   * @returns Array of API calls
   */
  getApiCalls(testName: string): ApiCall[] {
    return this.apiCalls.get(testName) || [];
  }

  /**
   * Clear captured API calls for a test
   * @param testName - Name of the test case
   */
  clearApiCalls(testName: string): void {
    this.apiCalls.delete(testName);
  }
}
