import { Page } from '@playwright/test';
import { MCPContextManager } from './MCPContextManager';
import { APIContext } from './MCPTypes';

/**
 * MCP Integration Utilities
 * Provides integration between MCP and other framework components (API Capture, etc.)
 */
export class MCPIntegration {
  /**
   * Integrate API capture with MCP context
   * This allows MCP to track API calls captured by ApiCapture
   */
  static integrateWithApiCapture(
    mcpContext: MCPContextManager,
    apiCalls: Array<{
      url: string;
      method: string;
      headers?: Record<string, string>;
      postData?: any;
      status?: number;
      responseHeaders?: Record<string, string>;
      responseBody?: any;
      timestamp: number;
      duration?: number;
    }>
  ): void {
    apiCalls.forEach((apiCall) => {
      const apiContext: APIContext = {
        requestId: `${apiCall.method}-${apiCall.url}-${apiCall.timestamp}`,
        method: apiCall.method,
        url: apiCall.url,
        requestHeaders: apiCall.headers,
        requestBody: apiCall.postData,
        responseStatus: apiCall.status,
        responseHeaders: apiCall.responseHeaders,
        responseBody: apiCall.responseBody,
        timestamp: new Date(apiCall.timestamp).toISOString(),
        duration: apiCall.duration,
      };

      mcpContext.addAPICall(apiContext);
    });
  }

  /**
   * Capture page performance metrics for MCP
   */
  static async capturePagePerformance(
    page: Page,
    mcpContext: MCPContextManager,
    url: string
  ): Promise<void> {
    try {
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      mcpContext.recordPageLoadTime(url, loadTime);
    } catch (error) {
      console.warn(`⚠️ [MCP] Failed to capture performance for ${url}:`, error);
    }
  }

  /**
   * Capture screenshot and add to MCP context
   */
  static async captureScreenshot(
    page: Page,
    mcpContext: MCPContextManager,
    name: string
  ): Promise<string | null> {
    try {
      const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });
      mcpContext.addScreenshot(screenshotPath);
      return screenshotPath;
    } catch (error) {
      console.warn(`⚠️ [MCP] Failed to capture screenshot:`, error);
      return null;
    }
  }
}
