import { test as baseTest } from '@playwright/test';
import { Helpers } from '../utils/Helpers';
import { ApiCapture } from '../utils/ApiCapture';
import { MCPContextManager } from '../mcp/MCPContextManager';
import { initializeMCPContext, getMCPContext, cleanupMCPContext } from '../mcp/MCPHooks';

/**
 * Extended test context with custom fixtures
 */
export interface TestFixtures {
  testData: TestData;
  apiCapture: ApiCapture;
  mcpContext: MCPContextManager;
}

/**
 * Test data interface for type safety
 */
export interface TestData {
  [key: string]: any;
}

// Global API capture instance storage (for auto-capture when fixture isn't used)
const apiCaptureInstances = new Map<string, { apiCapture: ApiCapture; saved: boolean }>();

/**
 * Base Test with custom fixtures
 */
export const test = baseTest.extend<TestFixtures>({
  /**
   * Test data fixture - provides test data for each test
   */
  testData: async ({}, use) => {
    const testData: TestData = {
      timestamp: new Date().toISOString(),
      randomString: Helpers.generateRandomString(),
      randomEmail: Helpers.generateRandomEmail(),
    };
    await use(testData);
  },

  /**
   * API Capture fixture - automatically captures all API calls during test execution
   */
  apiCapture: async ({ page }, use, testInfo) => {
    const apiCapture = new ApiCapture();
    const testName = `${testInfo.file} - ${testInfo.title}`;
    
    // Mark that fixture is being used (so afterEach won't double-save)
    apiCaptureInstances.set(testInfo.testId, { apiCapture, saved: false });
    
    console.log(`📡 [API CAPTURE] Starting capture for: ${testName}`);
    
    // Start capturing API calls
    apiCapture.startCapture(page, testName);
    
    await use(apiCapture);
    
    // Save API calls after test completes (whether it passes or fails)
    console.log(`📡 [API CAPTURE] Saving API calls for: ${testName}`);
    await apiCapture.saveApiCalls(testName);
    
    // Mark as saved
    const instance = apiCaptureInstances.get(testInfo.testId);
    if (instance) {
      instance.saved = true;
    }
    
    // Clean up
    apiCapture.clearApiCalls(testName);
    apiCaptureInstances.delete(testInfo.testId);
  },

  /**
   * MCP Context fixture - provides Model Context Protocol integration
   */
  mcpContext: async ({}, use, testInfo) => {
    // Initialize MCP context
    const mcpContext = initializeMCPContext(testInfo);
    
    // Log test start
    mcpContext.startStep('test-start', `Starting test: ${testInfo.title}`);
    
    await use(mcpContext);
    
    // Test completion is handled in afterEach hook
  },
});

// Add global setup/teardown to ensure API capture works even if fixture isn't used
test.beforeEach(async ({ page }, testInfo) => {
  // Only auto-start if fixture isn't being used
  if (!apiCaptureInstances.has(testInfo.testId)) {
    const apiCapture = new ApiCapture();
    const testName = `${testInfo.file} - ${testInfo.title}`;
    apiCaptureInstances.set(testInfo.testId, { apiCapture, saved: false });
    apiCapture.startCapture(page, testName);
    console.log(`📡 [API CAPTURE] Auto-started for: ${testName}`);
  }
});

test.afterEach(async ({ page }, testInfo) => {
  // Save API calls if capture was started and not already saved by fixture
  const instance = apiCaptureInstances.get(testInfo.testId);
  if (instance && !instance.saved) {
    const testName = `${testInfo.file} - ${testInfo.title}`;
    console.log(`📡 [API CAPTURE] Auto-saving for: ${testName}`);
    await instance.apiCapture.saveApiCalls(testName);
    instance.apiCapture.clearApiCalls(testName);
    apiCaptureInstances.delete(testInfo.testId);
  }

  // Cleanup MCP context and capture failure details
  const passed = testInfo.status === 'passed' || testInfo.status === 'skipped';
  const mcpContext = getMCPContext(testInfo);
  
  if (mcpContext) {
    // Capture error details if test failed
    if (!passed && testInfo.error) {
      mcpContext.addError(
        testInfo.error.message,
        undefined,
        testInfo.error.stack
      );
      
      // Try to capture screenshot on failure
      try {
        if (!page.isClosed()) {
          const screenshotPath = `mcp/context/test-contexts/failure-${testInfo.testId}-${Date.now()}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => {});
          mcpContext.addScreenshot(screenshotPath);
        }
      } catch (error) {
        // Screenshot capture failed, continue
      }
    }
  }
  
  await cleanupMCPContext(testInfo, passed);
});

// Export test with fixtures
export { test };
