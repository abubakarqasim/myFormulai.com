const { expect } = require('@playwright/test');
const { test } = require('./fixtures/customFixtures');

test.describe('Formulai Homepage', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to homepage using Page Object Model
    await homePage.navigate();
  });

  test('should open the Formulai homepage successfully', async ({ page, homePage }) => {
    // Verify the page title
    await expect(page).toHaveTitle(/Formulai/i);
    
    // Verify the page URL (using base URL)
    await expect(page).toHaveURL(/myformulai\.com/);
    
    // Verify that the main content is visible using Page Object Model
    await expect(homePage.mainHeading).toBeVisible();
  });

  test('should display the main navigation menu', async ({ homePage }) => {
    // Verify navigation elements are present using Page Object Model
    await expect(homePage.shopLink).toBeVisible();
  });

  test('should have the "Take the Quiz" button visible', async ({ homePage }) => {
    // Verify the quiz button is visible using Page Object Model
    await expect(homePage.takeQuizButton).toBeVisible();
  });

  test('should navigate to shop page when clicking shop link', async ({ page, homePage }) => {
    // Click shop link using Page Object Model method
    await homePage.clickShopLink();
    
    // Verify navigation occurred
    await expect(page).not.toHaveURL(/\/$/); // Not on homepage anymore
  });
});
