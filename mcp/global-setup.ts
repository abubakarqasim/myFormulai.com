import { FullConfig } from '@playwright/test';

/**
 * Global setup hook for MCP
 * Called once before all tests run
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🔷 [MCP] Global setup initialized');
  console.log(`🔷 [MCP] MCP Context Protocol enabled for test execution`);
}
