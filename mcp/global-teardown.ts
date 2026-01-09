import { FullConfig, FullResult } from '@playwright/test';

/**
 * Global teardown hook for MCP
 * Called once after all tests complete
 * Note: Individual test contexts are saved in afterEach hook
 */
export default async function globalTeardown(config: FullConfig, result: FullResult): Promise<void> {
  console.log(`🔷 [MCP] Global teardown - Test suite status: ${result.status}`);
  console.log('🔷 [MCP] All test contexts have been saved to mcp/context/test-contexts/');
}
