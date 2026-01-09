import { test } from './BaseTest';
import { RegisterPage } from '../pages/RegisterPage';
import { TestData } from '../constants/testData';
import { UserStorage } from '../utils/UserStorage';

test.describe('Register Tests', { tag: ['@smoke', '@regression'] }, () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }, testInfo) => {
    registerPage = new RegisterPage(page);
  });

  test('should register a new user', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');

    // Generate unique email with test prefix and 3 random digits
    const email = TestData.REGISTER.generateEmail();
    const password = TestData.REGISTER.PASSWORD;
    const registrationTimestamp = Date.now();
    let userSaved = false;

    try {
      // Step 1: Maximize the browser window
      await registerPage.maximizeWindow();
      
      // Step 2: Navigate to registration page
      await registerPage.navigate();
      await registerPage.wait(1000);

      // Step 3: Save user credentials BEFORE registration (to ensure they're saved even if registration fails)
      try {
        UserStorage.saveUser({
          email,
          password,
          timestamp: registrationTimestamp,
        });
        userSaved = true;
      } catch (saveError) {
        // Don't throw here - continue with registration attempt
      }

      // Step 4: Complete registration flow
      await registerPage.register(
        TestData.REGISTER.FIRST_NAME,
        TestData.REGISTER.LAST_NAME,
        email,
        password
      );

      // Step 5: Wait for page to load after registration
      await registerPage.wait(2000);
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    } catch (error) {
      if (!userSaved) {
        try {
          UserStorage.saveUser({
            email,
            password,
            timestamp: registrationTimestamp,
          });
        } catch {
          // Ignore save errors
        }
      }
      throw error;
    } finally {
      try {
        if (page && !page.isClosed()) {
          await page.close();
        }
      } catch {
        // Ignore close errors
      }
      if (!userSaved) {
        try {
          UserStorage.saveUser({
            email,
            password,
            timestamp: registrationTimestamp,
          });
        } catch {
          // Ignore save errors
        }
      }
    }
  });
});
