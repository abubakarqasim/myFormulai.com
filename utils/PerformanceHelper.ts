import { Page } from '@playwright/test';

/**
 * Performance Helper Utility
 * Provides utilities for measuring and validating performance metrics
 */
export class PerformanceHelper {
  /**
   * Measure page load time
   * @param page - Playwright page object
   * @param url - URL to load
   * @param maxLoadTime - Maximum acceptable load time in milliseconds (default: 3000)
   * @returns Load time in milliseconds
   */
  static async measurePageLoadTime(page: Page, url: string, maxLoadTime: number = 3000): Promise<number> {
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    if (loadTime > maxLoadTime) {
      console.warn(`⚠️ Page load time (${loadTime}ms) exceeds maximum (${maxLoadTime}ms) for ${url}`);
    } else {
      console.log(`✅ Page load time: ${loadTime}ms for ${url}`);
    }
    
    return loadTime;
  }

  /**
   * Measure API response time
   * @param page - Playwright page object
   * @param urlPattern - URL pattern to match
   * @param timeout - Timeout in milliseconds (default: 10000)
   * @returns Response time in milliseconds or null if not found
   */
  static async measureApiResponseTime(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<number | null> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let resolved = false;

      page.on('response', (response) => {
        const url = response.url();
        const matches = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);

        if (matches && !resolved) {
          resolved = true;
          const responseTime = Date.now() - startTime;
          console.log(`✅ API response time: ${responseTime}ms for ${url}`);
          resolve(responseTime);
        }
      });

      // Timeout after specified time
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn(`⚠️ API response timeout for pattern: ${urlPattern}`);
          resolve(null);
        }
      }, timeout);
    });
  }

  /**
   * Assert page load time is within acceptable range
   * @param page - Playwright page object
   * @param url - URL to load
   * @param maxLoadTime - Maximum acceptable load time in milliseconds (default: 3000)
   */
  static async assertPageLoadTime(page: Page, url: string, maxLoadTime: number = 3000): Promise<void> {
    const loadTime = await this.measurePageLoadTime(page, url, maxLoadTime);
    if (loadTime > maxLoadTime) {
      throw new Error(`Page load time (${loadTime}ms) exceeds maximum (${maxLoadTime}ms) for ${url}`);
    }
  }

  /**
   * Measure time to interactive (TTI)
   * @param page - Playwright page object
   * @returns Time to interactive in milliseconds
   */
  static async measureTimeToInteractive(page: Page): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const tti = Date.now() - startTime;
    console.log(`✅ Time to Interactive: ${tti}ms`);
    return tti;
  }

  /**
   * Get performance metrics from browser
   * @param page - Playwright page object
   * @returns Performance metrics object
   */
  static async getPerformanceMetrics(page: Page): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  }> {
    return await page.evaluate(() => {
      const perfData = performance.timing;
      return {
        loadTime: perfData.loadEventEnd - perfData.navigationStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        firstPaint: (performance.getEntriesByType('paint')[0] as PerformancePaintTiming)?.startTime || 0,
        firstContentfulPaint: (performance.getEntriesByType('paint')[1] as PerformancePaintTiming)?.startTime || 0,
      };
    });
  }
}
