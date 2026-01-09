import { test } from './BaseTest';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Homepage Tests', () => {
  // Configure tests to run serially (one after another) in a single iteration
  test.describe.configure({ mode: 'serial' });

  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    homePage = new HomePage(page);
  });

  test('should open browser, maximize it, and open URL', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    // Step 1: Maximize the browser window
    await homePage.maximizeWindow();
    
    // Step 2: Open the URL and measure performance
    const startTime = Date.now();
    await homePage.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Performance check: Page should load within 5 seconds
    console.log(`📊 Homepage load time: ${loadTime}ms`);
    if (loadTime > 5000) {
      console.warn(`⚠️ Page load time (${loadTime}ms) exceeds 5 seconds`);
    }

    // Wait for 5 seconds after URL is opened
    await homePage.wait(5000);

    // Verify URL is opened correctly
    await expect(homePage.page).toHaveURL('https://myformulai.com/');
  });

  test('should verify hero heading text on dashboard', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    // Prerequisite: This test is a prerequisite of the first test case
    // The first test already opened the URL, so we just verify without navigating again
    // Note: In Playwright, each test gets a new page, so we check if navigation is needed
    
    const currentUrl = page.url();
    if (currentUrl === 'about:blank' || !currentUrl.includes('myformulai.com')) {
      // Only navigate if page is blank or not on the target URL
      await homePage.maximizeWindow();
      await homePage.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
      await homePage.wait(3000);
    } else {
      // Page is already open from first test - just wait for elements
      await homePage.wait(2000);
    }

    // Verify the hero heading text is visible on the dashboard
    await homePage.expectVisible(homePage.heroHeading);
    await homePage.expectText(homePage.heroHeading, 'Overwhelmed by Supplements? Get Clarity in Minutes.');
  });

  test('should scroll to bottom and then scroll back to top', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    // Prerequisite: Navigate to the page first
    const currentUrl = page.url();
    if (currentUrl === 'about:blank' || !currentUrl.includes('myformulai.com')) {
      await homePage.maximizeWindow();
      await homePage.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
      await homePage.wait(3000);
    } else {
      await homePage.wait(2000);
    }

    // Step 1: Scroll all the way down to the bottom (slow smooth scroll)
    await homePage.scrollToBottom();

    // Step 2: Scroll all the way back up to the top (slow smooth scroll)
    await homePage.scrollToTop();

    // Verify we're back at the top by checking if hero heading is visible
    await homePage.expectVisible(homePage.heroHeading);
  });
});
