import { test as baseTest, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../client/ApiClient';
import { envConfig } from '../../config/env';

/**
 * API Test Fixtures
 */
export interface ApiFixtures {
  apiRequest: APIRequestContext;
  apiClient: ApiClient;
}

/**
 * Extend base test with API fixtures
 */
export const apiTest = baseTest.extend<ApiFixtures>({
  /**
   * API Request Context - Playwright's API request context
   */
  apiRequest: async ({ request }, use) => {
    await use(request);
  },

  /**
   * API Client - Pre-configured API client
   */
  apiClient: async ({ apiRequest }, use) => {
    const client = new ApiClient(apiRequest, envConfig.apiBaseUrl);
    await use(client);
  },
});

// Re-export test and expect
export { expect } from '@playwright/test';
export { apiTest as test };
