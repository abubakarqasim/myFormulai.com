import { defineConfig, devices } from '@playwright/test';
import { envConfig, Env } from './config/env';
import { STANDARD_VIEWPORT } from './constants/viewport';

/**
 * Environment-based Playwright configuration
 * Loads configuration based on ENV environment variable
 * See config/env.ts for environment setup
 */

// Get screenshot, video, and trace settings based on environment
const getScreenshotSetting = (): 'only-on-failure' | 'on' | 'off' => {
  if (typeof envConfig.screenshot === 'boolean') {
    return envConfig.screenshot ? 'on' : 'off';
  }
  return envConfig.screenshot === 'only-on-failure' ? 'only-on-failure' : 'on';
};

const getVideoSetting = (): 'retain-on-failure' | 'on' | 'off' | 'on-first-retry' => {
  if (typeof envConfig.video === 'boolean') {
    return envConfig.video ? 'retain-on-failure' : 'off';
  }
  return envConfig.video;
};

const getTraceSetting = (): 'on-first-retry' | 'on' | 'off' | 'retain-on-failure' => {
  if (typeof envConfig.trace === 'boolean') {
    return envConfig.trace ? 'on-first-retry' : 'off';
  }
  return envConfig.trace;
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry based on environment configuration */
  retries: envConfig.retries,
  /* Workers based on environment configuration */
  workers: process.env.CI ? 1 : envConfig.workers,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['list'],
    ['json', { outputFile: 'reports/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  outputDir: 'reports/test-results',
  /* Timeout for each test */
  timeout: envConfig.timeout,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL from environment configuration */
    baseURL: envConfig.baseUrl,
    /* Collect trace based on environment */
    trace: getTraceSetting(),
    /* Screenshot based on environment */
    screenshot: getScreenshotSetting(),
    /* Video based on environment */
    video: getVideoSetting(),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        // Standardized viewport: 1280x720 (accounts for browser chrome)
        // This prevents content from being cut off at the bottom
        // The viewport represents the actual content area, not full screen
        viewport: STANDARD_VIEWPORT,
        userAgent: devices['Desktop Chrome'].userAgent,
        // Launch browser maximized for better visibility
        // Note: --start-maximized maximizes the window, viewport controls content area
        // The maximizeWindow() method will optimize the viewport based on actual content area
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-infobars',
            '--disable-notifications',
          ],
        },
      },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
      // Ignore all UI test files - only run API tests on Firefox
      testIgnore: /tests\/.*\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
      // Ignore all UI test files - only run API tests on WebKit
      testIgnore: /tests\/.*\.spec\.ts/,
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
      testIgnore: /tests\/(homepage|startQuiz|login|register)\.spec\.ts/, // Skip some tests on mobile for now
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
      testIgnore: /tests\/(homepage|startQuiz|login|register)\.spec\.ts/, // Skip some tests on mobile for now
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: /(tests|api\/tests)\/.*\.spec\.ts/,
      testIgnore: /tests\/(homepage|startQuiz|login|register)\.spec\.ts/, // Skip some tests on tablet for now
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown for MCP */
  globalSetup: './mcp/global-setup.ts',
  globalTeardown: './mcp/global-teardown.ts',
});
