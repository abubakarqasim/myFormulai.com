import { FullConfig, FullResult, TestInfo } from '@playwright/test';
import { MCPContextManager } from './MCPContextManager';
import { TestMetadata, UserFlow } from './MCPTypes';
import * as path from 'path';

/**
 * Global MCP context storage
 */
export const mcpContexts = new Map<string, MCPContextManager>();

/**
 * MCP Playwright Hooks
 * Provides global hooks for MCP context management
 */

/**
 * Initialize MCP context for a test
 */
export function initializeMCPContext(testInfo: TestInfo): MCPContextManager {
  const testMetadata: TestMetadata = {
    testId: testInfo.testId,
    testName: testInfo.title,
    testFile: path.basename(testInfo.file),
    feature: extractFeature(testInfo),
    tags: testInfo.tags || [],
    environment: process.env.ENV || 'local',
    browser: testInfo.project.name || 'unknown',
    startedAt: new Date().toISOString(),
    status: 'started',
    retryCount: testInfo.retry,
  };

  const mcpContext = new MCPContextManager(testMetadata);
  mcpContexts.set(testInfo.testId, mcpContext);

  console.log(`🔷 [MCP] Context initialized for: ${testInfo.title}`);
  return mcpContext;
}

/**
 * Extract feature name from test file path
 */
function extractFeature(testInfo: TestInfo): string {
  const filePath = testInfo.file;
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Extract feature from folder structure (e.g., tests/shop/ -> shop)
  const parts = filePath.split(path.sep);
  const testsIndex = parts.indexOf('tests');
  if (testsIndex >= 0 && parts.length > testsIndex + 1) {
    return parts[testsIndex + 1] || fileName;
  }
  
  return fileName;
}

/**
 * Get MCP context for a test
 */
export function getMCPContext(testInfo: TestInfo): MCPContextManager | undefined {
  return mcpContexts.get(testInfo.testId);
}

/**
 * Cleanup MCP context after test
 */
export async function cleanupMCPContext(testInfo: TestInfo, passed: boolean): Promise<void> {
  const mcpContext = mcpContexts.get(testInfo.testId);
  if (!mcpContext) return;

  // Update final status
  mcpContext.updateMetadata({
    status: passed ? 'passed' : 'failed',
    completedAt: new Date().toISOString(),
  });

  // Update user flow status if exists
  if (mcpContext.getContext().userFlow) {
    mcpContext.updateUserFlowStatus(passed ? 'completed' : 'failed');
  }

  // Save context
  await mcpContext.saveContext();

  // Cleanup
  mcpContexts.delete(testInfo.testId);
}

/**
 * Global Playwright setup hook
 */
export async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🔷 [MCP] Global setup initialized');
}

/**
 * Global Playwright teardown hook
 */
export async function globalTeardown(config: FullConfig, result: FullResult): Promise<void> {
  console.log(`🔷 [MCP] Global teardown - Tests: ${result.status}`);
  
  // Save any remaining contexts
  for (const [testId, context] of mcpContexts.entries()) {
    await context.saveContext();
  }
  
  mcpContexts.clear();
}
