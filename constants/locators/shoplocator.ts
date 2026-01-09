import { Locator, Page } from '@playwright/test';

/**
 * Shop Locators
 * Contains all locators related to the Shop functionality
 */
export class ShopLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Formulai AI1 Daily Foundations product link locator
   * Targets the product title link that is near the "Shop Now" button
   * Uses the x-card-title class which is the clickable product title
   */
  get ai1DailyFoundationsProduct(): Locator {
    // Find the product card container that has both the product title and "Shop Now" button
    // Then get the product title link within that container
    return this.page
      .locator('a.x-card-title.full-unstyled-link.link-product-variant', {
        hasText: 'Formulai AI1 Daily Foundations',
      })
      .first();
  }

  /**
   * Formulai AI1 Daily Foundations product link locator (alternative - by href with first)
   */
  get ai1DailyFoundationsProductByHref(): Locator {
    return this.page.locator('a[href*="ai1-all-in-one-supplement"].x-card-title').first();
  }

  /**
   * Formulai AI1 Daily Foundations product link locator (by class with first)
   */
  get ai1DailyFoundationsProductByClass(): Locator {
    return this.page
      .locator('a.x-card-title.full-unstyled-link', { hasText: 'Formulai AI1 Daily Foundations' })
      .first();
  }

  /**
   * Formulai AI1 Daily Foundations product link locator (near Shop Now button)
   * Finds the product card that contains "Shop Now" and gets the product title link
   */
  get ai1DailyFoundationsProductNearShopNow(): Locator {
    // Find container with both product title and Shop Now button
    return this.page
      .locator('a[href*="ai1-all-in-one-supplement"].x-card-title')
      .filter({ has: this.page.getByRole('button', { name: /Shop Now/i }) })
      .or(this.page.locator('a.x-card-title', { hasText: 'Formulai AI1 Daily Foundations' }).first());
  }

  /**
   * Add to Cart button locator
   */
  get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: /Add to Cart/i });
  }

  /**
   * Add to Cart button locator (alternative by text)
   */
  get addToCartButtonByText(): Locator {
    return this.page.getByText('Add to Cart', { exact: false });
  }

  /**
   * Add to Cart button locator (by class/attribute)
   */
  get addToCartButtonByClass(): Locator {
    return this.page.locator('button[type="submit"], button[name*="add"], button[class*="add-to-cart"]').first();
  }

  /**
   * Checkout button locator
   */
  get checkoutButton(): Locator {
    return this.page.getByRole('button', { name: /Checkout|Proceed to Checkout/i });
  }

  /**
   * Checkout button locator (alternative by button element with text)
   */
  get checkoutButtonByText(): Locator {
    return this.page.locator('button', { hasText: /Checkout|Proceed to Checkout/i }).first();
  }

  /**
   * Checkout button locator (by link/button with specific classes)
   */
  get checkoutButtonByClass(): Locator {
    return this.page.locator('button[type="submit"], a[href*="checkout"], button[class*="checkout"], button[class*="btn-checkout"]').first();
  }

  /**
   * Address input field locator
   */
  get addressInput(): Locator {
    return this.page.locator('input[name*="address1"], input[name*="address"], input[id*="address1"], input[id*="address"]').first();
  }

  /**
   * Apartment/Address line 2 input field locator
   */
  get apartmentInput(): Locator {
    return this.page.locator('input[name*="address2"], input[name*="apartment"], input[id*="address2"], input[id*="apartment"]').first();
  }

  /**
   * City input field locator
   */
  get cityInput(): Locator {
    return this.page.locator('input[name*="city"], input[id*="city"]').first();
  }

  /**
   * State dropdown locator
   */
  get stateDropdown(): Locator {
    return this.page.locator('select[name*="province"], select[name*="state"], select[id*="province"], select[id*="state"]').first();
  }

  /**
   * Zip code input field locator
   */
  get zipCodeInput(): Locator {
    return this.page.locator('input[name*="zip"], input[name*="postal"], input[id*="zip"], input[id*="postal"]').first();
  }
}
