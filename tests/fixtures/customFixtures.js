const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

/**
 * Custom fixtures extending Playwright's base fixtures
 * Provides pre-configured page objects and common setup
 */

// Extend base test with custom fixtures
const test = base.test.extend({
  /**
   * HomePage fixture - provides a pre-instantiated HomePage object
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Authenticated page fixture (for future use)
   * Can be extended to handle login and authentication
   */
  authenticatedPage: async ({ page }, use) => {
    // TODO: Implement authentication logic
    // await login(page, credentials);
    await use(page);
  },
});

module.exports = { test };
