import { test } from './BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { TestData } from '../constants/testData';

test.describe('Login Tests', { tag: ['@sanity', '@smoke', '@regression'] }, () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
  });

  test('should login successfully', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    // Step 1: Maximize the browser window
    await loginPage.maximizeWindow();
    
    // Step 2: Open the login URL
    await loginPage.goto('https://myformulai.com/account/login', { waitUntil: 'domcontentloaded' });
    await loginPage.wait(2000);

    // Step 3: Enter email
    await loginPage.enterEmail(TestData.CREDENTIALS.VALID_EMAIL);
    await loginPage.wait(300);

    // Step 4: Enter password
    await loginPage.enterPassword(TestData.CREDENTIALS.VALID_PASSWORD);
    await loginPage.wait(500);

    // Step 5: Click login button
    await loginPage.clickLogin();

    // Wait for page to load after login
    await loginPage.wait(2000);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    await page.close();
  });
});
