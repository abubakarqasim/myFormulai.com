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
      console.error(`❌ [REGISTER TEST] Test failed with error:`, error);
      // If save didn't happen, try one more time
      if (!userSaved) {
        console.log(`📝 [REGISTER TEST] Retrying save after test failure...`);
        try {
          UserStorage.saveUser({
            email,
            password,
            timestamp: registrationTimestamp,
          });
          console.log(`✅ [REGISTER TEST] User saved successfully after retry: ${email}`);
        } catch (retryError) {
          console.error(`❌ [REGISTER TEST] Failed to save user on retry:`, retryError);
        }
      }
      throw error; // Re-throw to fail the test
    } finally {
      // Ensure page is closed
      try {
        if (page && !page.isClosed()) {
          await page.close();
        }
      } catch (closeError) {
        // Ignore close errors
      }
      
      // Final verification - check if user was actually saved
      if (!userSaved) {
        console.warn(`⚠️ [REGISTER TEST] User may not have been saved. Email: ${email}`);
        // Try one final save attempt
        try {
          UserStorage.saveUser({
            email,
            password,
            timestamp: registrationTimestamp,
          });
          console.log(`✅ [REGISTER TEST] User saved in finally block: ${email}`);
        } catch (finalError) {
          console.error(`❌ [REGISTER TEST] Final save attempt failed:`, finalError);
        }
      }
    }
  });
});
