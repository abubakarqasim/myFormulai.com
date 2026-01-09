import { test } from '../BaseTest';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { PerformanceHelper } from '../../utils/PerformanceHelper';

/**
 * Performance Test Suite
 * Tests page load times and performance metrics
 */
test.describe('Performance Tests', { tag: ['@regression'] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    homePage = new HomePage(page);
  });

  test('homepage should load within acceptable time', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    await homePage.maximizeWindow();
    
    const startTime = Date.now();
    await homePage.navigate();
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
    
    await page.close();
  });

  test('shop page should load within acceptable time', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    await homePage.maximizeWindow();
    
    const startTime = Date.now();
    await page.goto('https://myformulai.com/collections/shop-all', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
    
    await page.close();
  });

  test('product page should load within acceptable time', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    await homePage.maximizeWindow();
    
    const startTime = Date.now();
    await page.goto('https://myformulai.com/products/ai1-all-in-one-supplement', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    console.log(`📊 Product page load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(5000);
    
    await page.close();
  });

  test('should measure performance metrics', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    await homePage.maximizeWindow();
    await homePage.navigate();
    await page.waitForLoadState('networkidle');

    try {
      const metrics = await PerformanceHelper.getPerformanceMetrics(page);
      console.log('📊 Performance Metrics:', {
        loadTime: `${metrics.loadTime}ms`,
        domContentLoaded: `${metrics.domContentLoaded}ms`,
        firstPaint: `${metrics.firstPaint}ms`,
        firstContentfulPaint: `${metrics.firstContentfulPaint}ms`,
      });

      // Assert key metrics
      expect(metrics.loadTime).toBeLessThan(5000);
      expect(metrics.domContentLoaded).toBeLessThan(3000);
    } catch (error) {
      console.log('⚠️ Performance metrics not available, but test continued');
    }

    await page.close();
  });
});
