import { test } from './BaseTest';
import { ShopPage } from '../pages/ShopPage';
import { TestData } from '../constants/testData';

/**
 * Shop E2E Test Suite
 */
test.describe('Shop E2E Tests', { tag: ['@sanity', '@smoke', '@regression'] }, () => {
  let shopPage: ShopPage;

  test.beforeEach(async ({ page }, testInfo) => {
    shopPage = new ShopPage(page);
  });

  test('Navigate to homepage, open shop-all page, and click AI1 Daily Foundations product', async ({ page }, testInfo) => {
    // Skip test if not running on Chrome
    test.skip(testInfo.project.name !== 'chromium', 'Test runs only on Chrome');
    test.setTimeout(120000); // 2 minute timeout

    // ========== Setup Phase ==========
    await shopPage.maximizeWindow();
    
    // ========== Navigate to Homepage ==========
    await shopPage.navigateToHomepage();
    await shopPage.wait(3000);

    // ========== Navigate to Shop All Page ==========
    await shopPage.navigateToShopAll();
    await shopPage.wait(3000);

    // ========== Click on Product ==========
    await shopPage.clickAi1DailyFoundationsProduct();
    await shopPage.wait(2000);

    // Verify we're on the product page
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await shopPage.wait(2000);

    // ========== Add to Cart ==========
    await shopPage.clickAddToCart();
    await shopPage.wait(2000);

    // ========== Checkout ==========
    await shopPage.clickCheckout();
    await shopPage.wait(3000);

    // ========== Fill Address Form ==========
    await shopPage.fillAddressForm(
      TestData.SHIPPING.ADDRESS,
      TestData.SHIPPING.APARTMENT,
      TestData.SHIPPING.CITY,
      TestData.SHIPPING.ZIP_CODE
      // State will be selected automatically (first available option)
    );
    await shopPage.wait(2000);

    await page.close();
  });
});
