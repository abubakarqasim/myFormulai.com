import { Page, Locator, expect, FrameLocator } from '@playwright/test';
import { envConfig } from '../config/env';
import { STANDARD_VIEWPORT } from '../constants/viewport';
import { RetryHelper } from '../utils/RetryHelper';

/**
 * Base Page Object Model (POM) class
 * 
 * This class provides common functionality that all page objects should inherit.
 * It follows the Page Object Model pattern and includes:
 * - Common navigation methods
 * - Element interaction methods
 * - Wait and synchronization methods
 * - Assertion helpers
 * - Screenshot and logging capabilities
 */
export class BasePage {
  readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = envConfig.baseUrl || '';
  }

  // ==================== Browser Window Methods ====================

  /**
   * Maximize the browser window and set optimal viewport size
   * Top-notch approach: Calculate actual available content area to prevent UI cutoff
   * 
   * This method ensures:
   * - Browser window is maximized (via --start-maximized flag)
   * - Viewport is set to actual available content area (accounts for browser chrome)
   * - Content is never cut off at the bottom
   * - UI displays correctly with all elements visible
   */
  async maximizeWindow(): Promise<void> {
    try {
      // First, get the actual available content area from the browser
      // This accounts for browser chrome (address bar, tabs, bookmarks, etc.)
      const contentArea = await this.page.evaluate(() => {
        return {
          // @ts-ignore - window is available in browser context
          innerWidth: window.innerWidth || 1280,
          // @ts-ignore
          innerHeight: window.innerHeight || 720,
          // @ts-ignore
          availWidth: window.screen.availWidth || 1920,
          // @ts-ignore
          availHeight: window.screen.availHeight || 1080,
        };
      });

      // Calculate optimal viewport size
      // Use the smaller of: actual content area or standard viewport
      // This ensures content is never cut off
      let optimalWidth = Math.min(contentArea.innerWidth, STANDARD_VIEWPORT.width);
      let optimalHeight = Math.min(contentArea.innerHeight, STANDARD_VIEWPORT.height);

      // If content area is very small, use standard viewport as minimum
      // This ensures we have enough space for the UI
      if (contentArea.innerWidth < 1000 || contentArea.innerHeight < 600) {
        optimalWidth = STANDARD_VIEWPORT.width;
        optimalHeight = STANDARD_VIEWPORT.height;
      }

      // Set viewport to optimal size that prevents content cutoff
      await this.page.setViewportSize({
        width: optimalWidth,
        height: optimalHeight,
      });

      // Wait for viewport change to take effect and page to re-render
      await this.page.waitForTimeout(500);
      
      // Force a reflow to ensure proper rendering after viewport change
      await this.page.evaluate(() => {
        // @ts-ignore - document is available in browser context
        // Reset zoom to ensure proper scaling
        document.body.style.zoom = '1';
        // Scroll to top to ensure we're viewing from the beginning
        // @ts-ignore
        window.scrollTo(0, 0);
        // Trigger a reflow to ensure layout is updated
        // @ts-ignore
        void document.body.offsetHeight;
      });

      // Verify viewport was set correctly
      const viewport = this.page.viewportSize();
      if (viewport) {
        console.log(`✅ Viewport optimized: ${viewport.width}x${viewport.height} (prevents content cutoff)`);
        
        // Double-check that content area matches viewport
        const verifyContentArea = await this.page.evaluate(() => {
          return {
            // @ts-ignore
            innerWidth: window.innerWidth,
            // @ts-ignore
            innerHeight: window.innerHeight,
          };
        });
        
        // Log if there's a mismatch (shouldn't happen, but good for debugging)
        if (Math.abs(verifyContentArea.innerWidth - viewport.width) > 50 || 
            Math.abs(verifyContentArea.innerHeight - viewport.height) > 50) {
          console.warn(`⚠️ Content area (${verifyContentArea.innerWidth}x${verifyContentArea.innerHeight}) differs from viewport (${viewport.width}x${viewport.height})`);
        }
      }
    } catch (error) {
      // Fallback: Use standard viewport if calculation fails
      console.warn('⚠️ Viewport calculation failed, using standard size:', error);
      try {
        await this.page.setViewportSize(STANDARD_VIEWPORT);
        console.log(`✅ Viewport set to standard size (fallback): ${STANDARD_VIEWPORT.width}x${STANDARD_VIEWPORT.height}`);
      } catch (fallbackError) {
        console.error('❌ Failed to set viewport:', fallbackError);
        // Don't throw - let the test continue with default viewport
      }
    }
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to (can be relative or absolute)
   * @param options - Navigation options (waitUntil, timeout, etc.)
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    // Navigate to the URL
    await this.page.goto(fullUrl, {
      waitUntil: options?.waitUntil || 'domcontentloaded',
      timeout: options?.timeout || 120000,
    });
    
    // Maximize window after navigation to ensure proper UI display
    // This ensures the page renders correctly with full screen dimensions
    await this.maximizeWindow();
    
    // Wait a moment for the viewport change to take effect
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
  }

  /**
   * Reload the current page
   */
  async reload(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.reload({ waitUntil: options?.waitUntil || 'networkidle' });
  }

  /**
   * Navigate back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navigate forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Get the current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  // ==================== Element Interaction Methods ====================

  /**
   * Click on an element with optional retry logic
   * @param locator - The locator of the element to click
   * @param options - Click options (force, timeout, retry, etc.)
   */
  async click(locator: Locator, options?: { force?: boolean; timeout?: number; retry?: boolean; maxRetries?: number }): Promise<void> {
    const clickAction = async () => {
      await locator.click({
        force: options?.force || false,
        timeout: options?.timeout || 30000,
      });
    };

    if (options?.retry !== false) {
      // Use retry logic by default for more reliable clicks
      await RetryHelper.retry(clickAction, {
        maxRetries: options?.maxRetries || 2,
        delay: 1000,
      });
    } else {
      await clickAction();
    }
  }

  /**
   * Double click on an element
   */
  async doubleClick(locator: Locator): Promise<void> {
    await locator.dblclick();
  }

  /**
   * Right click on an element
   */
  async rightClick(locator: Locator): Promise<void> {
    await locator.click({ button: 'right' });
  }

  /**
   * Fill an input field with optional retry logic
   * @param locator - The locator of the input field
   * @param text - The text to fill
   * @param options - Fill options (timeout, retry, clear, etc.)
   */
  async fill(locator: Locator, text: string, options?: { timeout?: number; retry?: boolean; maxRetries?: number; clear?: boolean }): Promise<void> {
    const fillAction = async () => {
      if (options?.clear !== false) {
        await locator.clear({ timeout: options?.timeout || 30000 });
      }
      await locator.fill(text, { timeout: options?.timeout || 30000 });
    };

    if (options?.retry !== false) {
      // Use retry logic by default for more reliable fills
      await RetryHelper.retry(fillAction, {
        maxRetries: options?.maxRetries || 2,
        delay: 1000,
      });
    } else {
      await fillAction();
    }
  }

  /**
   * Type text into an input field (simulates typing)
   */
  async type(locator: Locator, text: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    await locator.type(text, { delay: options?.delay || 0, timeout: options?.timeout || 30000 });
  }

  /**
   * Clear an input field
   */
  async clear(locator: Locator): Promise<void> {
    await locator.clear();
  }

  /**
   * Select an option from a dropdown/select element
   */
  async selectOption(locator: Locator, value: string | string[]): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Check a checkbox or radio button
   */
  async check(locator: Locator): Promise<void> {
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(locator: Locator): Promise<void> {
    await locator.uncheck();
  }

  /**
   * Upload a file
   */
  async uploadFile(locator: Locator, filePath: string | string[]): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Hover over an element
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Focus on an element
   */
  async focus(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Press a keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  // ==================== Wait Methods ====================

  /**
   * Wait for page to load completely
   */
  async waitForLoad(options?: { state?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }): Promise<void> {
    await this.page.waitForLoadState(options?.state || 'networkidle', { timeout: options?.timeout || 30000 });
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeout || 30000 });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout: timeout || 30000 });
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForAttached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: timeout || 30000 });
  }

  /**
   * Wait for element to be detached from DOM
   */
  async waitForDetached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout: timeout || 30000 });
  }

  /**
   * Wait for a specific amount of time
   */
  async wait(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(options?: { url?: string | RegExp; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }): Promise<void> {
    const timeout = options?.timeout || 30000;
    const waitUntil = options?.waitUntil || 'domcontentloaded';
    
    if (options?.url) {
      // Wait for specific URL pattern
      try {
        await this.page.waitForURL(options.url, {
          waitUntil: waitUntil,
          timeout: timeout,
        });
      } catch (error) {
        // If URL pattern doesn't match, wait for navigation to complete anyway
        await this.page.waitForLoadState(waitUntil, { timeout: timeout });
      }
    } else {
      // Wait for any navigation to complete
      await this.page.waitForLoadState(waitUntil, { timeout: timeout });
    }
  }

  // ==================== Element State Methods ====================

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: timeout || 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check if element is checked
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Check if element exists in DOM
   */
  async exists(locator: Locator, timeout?: number): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'attached', timeout: timeout || 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  /**
   * Get inner text of an element
   */
  async getInnerText(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  /**
   * Get attribute value of an element
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * Get all text contents of multiple elements
   */
  async getAllTexts(locator: Locator): Promise<string[]> {
    return await locator.allTextContents();
  }

  /**
   * Get count of elements matching the locator
   */
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // ==================== Assertion Helpers ====================

  /**
   * Assert element is visible
   */
  async expectVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Assert element is hidden
   */
  async expectHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  /**
   * Assert element contains text
   */
  async expectText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * Assert element has exact text
   */
  async expectExactText(locator: Locator, text: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(text);
  }

  /**
   * Assert element has attribute
   */
  async expectAttribute(locator: Locator, attributeName: string, value: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toHaveAttribute(attributeName, value);
  }

  /**
   * Assert element is enabled
   */
  async expectEnabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEnabled();
  }

  /**
   * Assert element is disabled
   */
  async expectDisabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeDisabled();
  }

  /**
   * Assert element is checked
   */
  async expectChecked(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeChecked();
  }

  /**
   * Assert page URL contains text
   */
  async expectUrl(url: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(url);
  }

  /**
   * Assert page title contains text
   */
  async expectTitle(title: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveTitle(title);
  }

  // ==================== Screenshot and Media Methods ====================

  /**
   * Take a screenshot
   * @param name - Name of the screenshot file (without extension)
   * @param options - Screenshot options (fullPage, path, etc.)
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean; path?: string }): Promise<void> {
    const screenshotPath = options?.path || `reports/screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: options?.fullPage !== false,
    });
  }

  /**
   * Take a screenshot of a specific element
   */
  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    const screenshotPath = `reports/screenshots/${name}-${Date.now()}.png`;
    await locator.screenshot({ path: screenshotPath });
  }

  // ==================== Frame Methods ====================

  /**
   * Get a frame locator
   */
  frameLocator(selector: string): FrameLocator {
    return this.page.frameLocator(selector);
  }

  // ==================== JavaScript Execution ====================

  /**
   * Execute JavaScript in the page context
   */
  async executeScript<T>(script: string | Function, ...args: any[]): Promise<T> {
    return await this.page.evaluate(script as any, ...args);
  }

  /**
   * Evaluate JavaScript expression
   */
  async evaluate<T>(pageFunction: Function | string, ...args: any[]): Promise<T> {
    return await this.page.evaluate(pageFunction as any, ...args);
  }

  // ==================== Utility Methods ====================

  /**
   * Scroll element into view with timeout and error handling
   */
  async scrollIntoView(locator: Locator, timeout: number = 10000): Promise<void> {
    try {
      // First, wait for the element to be attached to DOM (with shorter timeout to avoid blocking)
      await locator.waitFor({ state: 'attached', timeout: Math.min(timeout, 5000) });
      
      // Check if element is visible, if not try to get its position
      const isVisible = await locator.isVisible().catch(() => false);
      
      if (isVisible) {
        // Element is visible, use standard scroll
        await locator.scrollIntoViewIfNeeded({ timeout: Math.min(timeout, 5000) });
      } else {
        // Element exists but not visible, try to get position and scroll manually
        const box = await locator.boundingBox({ timeout: Math.min(timeout, 5000) });
        if (box) {
          await this.page.evaluate(({ y }) => {
            // @ts-ignore - window is available in browser context
            window.scrollTo({ top: y - 200, left: 0, behavior: 'smooth' });
          }, box);
          await this.wait(1000);
        } else {
          // If we can't get position, just scroll down a bit
          await this.page.evaluate(() => {
            // @ts-ignore - window is available in browser context
            window.scrollBy(0, 400);
          });
          await this.wait(500);
        }
      }
    } catch (error) {
      // If all else fails, just scroll down a reasonable amount
      await this.page.evaluate(() => {
        // @ts-ignore - window is available in browser context
        window.scrollBy(0, 400);
      });
      await this.wait(500);
    }
  }

  /**
   * Scroll to top of page (slow smooth scroll)
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => {
      // @ts-ignore - window is available in browser context
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
    // Wait for smooth scroll to complete
    await this.wait(2000);
  }

  /**
   * Scroll to bottom of page (slow smooth scroll)
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      // @ts-ignore - window and document are available in browser context
      const scrollHeight = document.body.scrollHeight;
      // @ts-ignore - window is available in browser context
      window.scrollTo({
        top: scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    });
    // Wait for smooth scroll to complete
    await this.wait(2000);
  }

  /**
   * Get page locator (useful for chaining)
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get page locator by text
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Get page locator by role
   */
  getByRole(role: 'button' | 'link' | 'textbox' | 'checkbox' | 'radio' | 'heading' | 'img' | 'list' | 'listitem' | 'option', options?: { name?: string | RegExp; exact?: boolean }): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get page locator by label
   */
  getByLabel(text: string | RegExp): Locator {
    return this.page.getByLabel(text);
  }

  /**
   * Get page locator by placeholder
   */
  getByPlaceholder(text: string | RegExp): Locator {
    return this.page.getByPlaceholder(text);
  }

  /**
   * Get page locator by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
