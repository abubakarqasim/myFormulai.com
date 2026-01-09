import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage Page Object Model
 * Represents the homepage of Formulai website
 */
export class HomePage extends BasePage {
  // Locators
  readonly logo: Locator;
  readonly takeQuizButton: Locator;
  readonly shopMenu: Locator;
  readonly loginButton: Locator;
  readonly heroHeading: Locator; // "Overwhelmed by Supplements? Get Clarity in Minutes."

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.logo = page.locator('a[href="/"]').first();
    this.takeQuizButton = page.getByRole('link', { name: /Take the Quiz/i });
    this.shopMenu = page.getByRole('link', { name: /Shop/i });
    this.loginButton = page.getByRole('link', { name: /Log in/i });
    this.heroHeading = page.getByText('Overwhelmed by Supplements? Get Clarity in Minutes.');
  }

  /**
   * Navigate to the homepage
   */
  async navigate(): Promise<void> {
    await this.goto('https://myformulai.com/', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click on the Take Quiz button
   */
  async clickTakeQuiz(): Promise<void> {
    await this.click(this.takeQuizButton);
  }

  /**
   * Click on the Shop menu
   */
  async clickShopMenu(): Promise<void> {
    await this.click(this.shopMenu);
  }

  /**
   * Click on the Login button
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Verify homepage is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.expectTitle(/Formulai/i);
    await this.expectVisible(this.logo);
  }
}
