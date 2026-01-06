const { SELECTORS } = require('../constants');

/**
 * Page Object Model for Formulai Homepage
 * Encapsulates all homepage interactions and elements
 */
class HomePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the homepage
   */
  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the main heading element
   */
  get mainHeading() {
    return this.page.locator(SELECTORS.MAIN_HEADING);
  }

  /**
   * Get the Shop link element
   */
  get shopLink() {
    return this.page.locator(SELECTORS.SHOP_LINK).first();
  }

  /**
   * Get the Take Quiz button element
   */
  get takeQuizButton() {
    return this.page.locator(SELECTORS.TAKE_QUIZ_BUTTON).first();
  }

  /**
   * Get the Our Brands link element
   */
  get ourBrandsLink() {
    return this.page.locator(SELECTORS.OUR_BRANDS_LINK).first();
  }

  /**
   * Get the About Us link element
   */
  get aboutUsLink() {
    return this.page.locator(SELECTORS.ABOUT_US_LINK).first();
  }

  /**
   * Click on the Shop link
   */
  async clickShopLink() {
    await this.shopLink.click();
  }

  /**
   * Click on the Take Quiz button
   */
  async clickTakeQuizButton() {
    await this.takeQuizButton.click();
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle = /Formulai/i) {
    await this.page.waitForLoadState('networkidle');
    return await this.page.title();
  }

  /**
   * Verify main heading is visible
   */
  async verifyMainHeadingVisible() {
    await this.mainHeading.waitFor({ state: 'visible' });
    return await this.mainHeading.isVisible();
  }

  /**
   * Get page URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = { HomePage };
