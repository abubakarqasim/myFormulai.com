/**
 * Common helper functions for tests
 * Reusable utilities for test operations
 */

/**
 * Wait for element to be visible with custom timeout
 * @param {import('@playwright/test').Locator} locator - Element locator
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementVisible(locator, timeout = 10000) {
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element to be hidden
 * @param {import('@playwright/test').Locator} locator - Element locator
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElementHidden(locator, timeout = 10000) {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for network to be idle
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForNetworkIdle(page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Take a screenshot with timestamp
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `screenshots/${name}-${timestamp}.png`, fullPage: true });
}

/**
 * Scroll to element
 * @param {import('@playwright/test').Locator} locator - Element locator
 */
async function scrollToElement(locator) {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Wait for page to load completely
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function waitForPageLoad(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Get random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
function getRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  waitForElementVisible,
  waitForElementHidden,
  waitForNetworkIdle,
  takeScreenshot,
  scrollToElement,
  waitForPageLoad,
  getRandomNumber,
  getRandomString,
};
