/**
 * MCP (Model Context Protocol) Type Definitions
 * Defines interfaces for test context, user flows, and metadata
 */

/**
 * Test execution step
 */
export interface TestStep {
  stepNumber: number;
  action: string;
  description: string;
  timestamp: string;
  duration?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  metadata?: Record<string, any>;
  error?: string;
  screenshot?: string;
}

/**
 * User flow definition
 */
export interface UserFlow {
  flowId: string;
  flowName: string;
  description: string;
  steps: string[];
  startedAt: string;
  completedAt?: string;
  status: 'started' | 'in-progress' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

/**
 * Test metadata
 */
export interface TestMetadata {
  testId: string;
  testName: string;
  testFile: string;
  feature: string;
  tags: string[];
  environment: string;
  browser: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  status: 'started' | 'running' | 'passed' | 'failed' | 'skipped';
  retryCount: number;
}

/**
 * API request/response context
 */
export interface APIContext {
  requestId: string;
  method: string;
  url: string;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  timestamp: string;
  duration?: number;
}

/**
 * Complete MCP context for a test
 */
export interface MCPContext {
  metadata: TestMetadata;
  userFlow?: UserFlow;
  steps: TestStep[];
  apiCalls: APIContext[];
  assertions: Array<{
    description: string;
    status: 'passed' | 'failed';
    timestamp: string;
    error?: string;
  }>;
  errors: Array<{
    message: string;
    stack?: string;
    timestamp: string;
    step?: number;
  }>;
  screenshots: string[];
  performance: {
    pageLoadTimes: Record<string, number>;
    apiResponseTimes: Record<string, number>;
    totalDuration: number;
  };
  customData?: Record<string, any>;
}

/**
 * MCP configuration
 */
export interface MCPConfig {
  enabled: boolean;
  storagePath: string;
  captureScreenshots: boolean;
  captureApiCalls: boolean;
  capturePerformance: boolean;
  maxContextSize: number; // Max steps to store
}
