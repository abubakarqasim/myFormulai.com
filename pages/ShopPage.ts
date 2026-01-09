import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ShopLocators } from '../constants/locators/shoplocator';

/**
 * ShopPage - Page Object Model for Formulai Shop Functionality
 */
export class ShopPage extends BasePage {
  readonly shopLocators: ShopLocators;
  private static readonly SHOP_TIMEOUT = 30000;
  private static readonly VISIBILITY_TIMEOUT = 15000;

  constructor(page: Page) {
    super(page);
    this.shopLocators = new ShopLocators(page);
  }

  /**
   * Navigate to the homepage
   */
  async navigateToHomepage(): Promise<void> {
    await this.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad({ state: 'domcontentloaded', timeout: ShopPage.SHOP_TIMEOUT });
  }

  /**
   * Navigate to Shop All page
   */
  async navigateToShopAll(): Promise<void> {
    await this.goto('https://myformulai.com/collections/shop-all', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad({ state: 'domcontentloaded', timeout: ShopPage.SHOP_TIMEOUT });
  }

  /**
   * Click on Formulai AI1 Daily Foundations product
   * Targets the product title link that is near the "Shop Now" button
   */
  async clickAi1DailyFoundationsProduct(): Promise<void> {
    try {
      // Try primary locator first (x-card-title class which is the clickable product title)
      await this.waitForVisible(this.shopLocators.ai1DailyFoundationsProduct, ShopPage.VISIBILITY_TIMEOUT);
      await this.click(this.shopLocators.ai1DailyFoundationsProduct);
    } catch (error) {
      try {
        // Try alternative locator by class with first()
        await this.waitForVisible(this.shopLocators.ai1DailyFoundationsProductByClass, ShopPage.VISIBILITY_TIMEOUT);
        await this.click(this.shopLocators.ai1DailyFoundationsProductByClass);
      } catch (error2) {
        try {
          // Try alternative locator by href with first()
          await this.waitForVisible(this.shopLocators.ai1DailyFoundationsProductByHref, ShopPage.VISIBILITY_TIMEOUT);
          await this.click(this.shopLocators.ai1DailyFoundationsProductByHref);
        } catch (error3) {
          // Last resort: Use the most specific locator that targets the product title link
          // This targets the x-card-title link which is the clickable product title near Shop Now
          const productLink = this.page
            .locator('a.x-card-title.full-unstyled-link.link-product-variant', {
              hasText: 'Formulai AI1 Daily Foundations',
            })
            .first();
          await this.waitForVisible(productLink, ShopPage.VISIBILITY_TIMEOUT);
          await this.click(productLink);
        }
      }
    }
    await this.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: ShopPage.SHOP_TIMEOUT });
  }

  /**
   * Click Add to Cart button
   */
  async clickAddToCart(): Promise<void> {
    try {
      // Try primary locator first
      await this.waitForVisible(this.shopLocators.addToCartButton, ShopPage.VISIBILITY_TIMEOUT);
      await this.click(this.shopLocators.addToCartButton);
    } catch (error) {
      try {
        // Try alternative locator by text
        await this.waitForVisible(this.shopLocators.addToCartButtonByText, ShopPage.VISIBILITY_TIMEOUT);
        await this.click(this.shopLocators.addToCartButtonByText);
      } catch (error2) {
        // Try alternative locator by class
        await this.waitForVisible(this.shopLocators.addToCartButtonByClass, ShopPage.VISIBILITY_TIMEOUT);
        await this.click(this.shopLocators.addToCartButtonByClass);
      }
    }
    await this.wait(2000); // Wait for cart to update
  }

  /**
   * Click Checkout button
   */
  async clickCheckout(): Promise<void> {
    // Wait for checkout button to be visible before clicking
    let checkoutButton: any;
    
    try {
      // Try primary locator first (button role)
      await this.waitForVisible(this.shopLocators.checkoutButton, ShopPage.VISIBILITY_TIMEOUT);
      checkoutButton = this.shopLocators.checkoutButton;
    } catch (error) {
      try {
        // Try alternative locator by button element with text
        await this.waitForVisible(this.shopLocators.checkoutButtonByText, ShopPage.VISIBILITY_TIMEOUT);
        checkoutButton = this.shopLocators.checkoutButtonByText;
      } catch (error2) {
        // Try alternative locator by class/type
        await this.waitForVisible(this.shopLocators.checkoutButtonByClass, ShopPage.VISIBILITY_TIMEOUT);
        checkoutButton = this.shopLocators.checkoutButtonByClass;
      }
    }

    // Click the checkout button and wait for navigation
    // Use Promise.race to handle both navigation and potential page close
    const clickPromise = checkoutButton.click();
    const navigationPromise = this.page.waitForURL(/checkout|cart/, { timeout: ShopPage.SHOP_TIMEOUT }).catch(() => {
      // If URL doesn't match, wait for load state instead
      return this.page.waitForLoadState('domcontentloaded', { timeout: ShopPage.SHOP_TIMEOUT });
    });

    await Promise.all([clickPromise, navigationPromise]);
    await this.wait(2000); // Wait for checkout page to load
  }

  /**
   * Enter address in the address input field
   * @param address - The street address
   */
  async enterAddress(address: string): Promise<void> {
    await this.waitForVisible(this.shopLocators.addressInput, ShopPage.VISIBILITY_TIMEOUT);
    await this.fill(this.shopLocators.addressInput, address);
  }

  /**
   * Enter apartment/address line 2
   * @param apartment - The apartment number or address line 2
   */
  async enterApartment(apartment: string): Promise<void> {
    await this.waitForVisible(this.shopLocators.apartmentInput, ShopPage.VISIBILITY_TIMEOUT);
    await this.fill(this.shopLocators.apartmentInput, apartment);
  }

  /**
   * Enter city
   * @param city - The city name
   */
  async enterCity(city: string): Promise<void> {
    await this.waitForVisible(this.shopLocators.cityInput, ShopPage.VISIBILITY_TIMEOUT);
    await this.fill(this.shopLocators.cityInput, city);
  }

  /**
   * Select state from dropdown
   * @param state - The state value to select (e.g., "CA", "New York", etc.)
   */
  async selectState(state: string): Promise<void> {
    await this.waitForVisible(this.shopLocators.stateDropdown, ShopPage.VISIBILITY_TIMEOUT);
    await this.selectOption(this.shopLocators.stateDropdown, state);
    await this.wait(1000); // Wait for state selection to process
  }

  /**
   * Select any state from dropdown (selects the first available option)
   */
  async selectAnyState(): Promise<void> {
    await this.waitForVisible(this.shopLocators.stateDropdown, ShopPage.VISIBILITY_TIMEOUT);
    
    // Get all available options
    const options = await this.shopLocators.stateDropdown.locator('option').all();
    
    if (options.length > 1) {
      // Skip the first option (usually "Select state" or empty) and select the second one
      const firstStateOption = options[1];
      const stateValue = await firstStateOption.getAttribute('value');
      if (stateValue) {
        await this.selectOption(this.shopLocators.stateDropdown, stateValue);
      } else {
        // If no value attribute, try selecting by index
        await this.shopLocators.stateDropdown.selectOption({ index: 1 });
      }
    } else if (options.length === 1) {
      // Only one option available, select it
      const stateValue = await options[0].getAttribute('value');
      if (stateValue) {
        await this.selectOption(this.shopLocators.stateDropdown, stateValue);
      }
    }
    await this.wait(1000); // Wait for state selection to process
  }

  /**
   * Enter zip code
   * @param zipCode - The zip/postal code
   */
  async enterZipCode(zipCode: string): Promise<void> {
    await this.waitForVisible(this.shopLocators.zipCodeInput, ShopPage.VISIBILITY_TIMEOUT);
    await this.fill(this.shopLocators.zipCodeInput, zipCode);
  }

  /**
   * Fill complete address form
   * @param address - Street address
   * @param apartment - Apartment/address line 2
   * @param city - City name
   * @param zipCode - Zip/postal code
   * @param state - Optional state value (if not provided, selects first available state)
   */
  async fillAddressForm(
    address: string,
    apartment: string,
    city: string,
    zipCode: string,
    state?: string
  ): Promise<void> {
    await this.enterAddress(address);
    await this.wait(500);
    
    await this.enterApartment(apartment);
    await this.wait(500);
    
    await this.enterCity(city);
    await this.wait(500);
    
    if (state) {
      await this.selectState(state);
    } else {
      await this.selectAnyState();
    }
    await this.wait(500);
    
    await this.enterZipCode(zipCode);
    await this.wait(1000);
  }
}
