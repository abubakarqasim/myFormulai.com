import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLocators } from '../constants/locators/loginlocator';

/**
 * LoginPage - Page Object Model for Formulai Login
 * 
 * This class handles all interactions with the login page, including:
 * - Navigation to login page
 * - Entering credentials
 * - Clicking login button
 * - Handling forgot password flow
 * - Navigating to create account
 * 
 * All login interactions are centralized here following the Page Object Model pattern.
 */
export class LoginPage extends BasePage {
  readonly loginLocators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.loginLocators = new LoginLocators(page);
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await this.goto('https://myformulai.com/account/login', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  /**
   * Wait for login page to be fully loaded and ready for interaction
   */
  async waitForLoginPageReady(): Promise<void> {
    await this.waitForLoad({ state: 'domcontentloaded', timeout: 30000 });
    
    try {
      await this.page.waitForSelector('input[type="email"], input[type="password"], form', { 
        state: 'visible', 
        timeout: 15000 
      });
    } catch (error) {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
    
    await this.wait(1000);
  }

  /**
   * Enter email address in the login form
   * @param email - Email address to enter (e.g., 'test@formulai.com')
   */
  async enterEmail(email: string): Promise<void> {
    await this.waitForAttached(this.loginLocators.emailInput, 15000);
    await this.waitForVisible(this.loginLocators.emailInput, 10000);
    await this.fill(this.loginLocators.emailInput, email);
  }

  /**
   * Enter password in the login form
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitForAttached(this.loginLocators.passwordInput, 15000);
    await this.waitForVisible(this.loginLocators.passwordInput, 10000);
    await this.fill(this.loginLocators.passwordInput, password);
  }

  /**
   * Click the Login button with fallback locators
   */
  async clickLogin(): Promise<void> {
    try {
      await this.waitForVisible(this.loginLocators.loginButton, 15000);
      await this.click(this.loginLocators.loginButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.loginLocators.loginButtonByRole, 15000);
        await this.click(this.loginLocators.loginButtonByRole);
        return;
      } catch (error2) {
        await this.waitForVisible(this.loginLocators.loginButtonByText, 15000);
        await this.click(this.loginLocators.loginButtonByText);
      }
    }
  }

  /**
   * Verify that the Login button is visible
   */
  async verifyLoginButtonVisible(): Promise<void> {
    try {
      await this.waitForVisible(this.loginLocators.loginButton, 10000);
      await this.expectVisible(this.loginLocators.loginButton);
      return;
    } catch (error) {
      try {
        await this.waitForVisible(this.loginLocators.loginButtonByRole, 10000);
        await this.expectVisible(this.loginLocators.loginButtonByRole);
        return;
      } catch (error2) {
        await this.waitForVisible(this.loginLocators.loginButtonByText, 10000);
        await this.expectVisible(this.loginLocators.loginButtonByText);
      }
    }
  }

  /**
   * Verify that the login form fields are visible
   */
  async verifyLoginFormVisible(): Promise<void> {
    await this.waitForAttached(this.loginLocators.emailInput, 15000);
    await this.waitForVisible(this.loginLocators.emailInput, 10000);
    await this.expectVisible(this.loginLocators.emailInput);

    await this.waitForAttached(this.loginLocators.passwordInput, 15000);
    await this.waitForVisible(this.loginLocators.passwordInput, 10000);
    await this.expectVisible(this.loginLocators.passwordInput);
  }

  /**
   * Perform complete login flow
   * @param email - Email address
   * @param password - Password
   */
  async login(email: string, password: string): Promise<void> {
    await this.waitForLoginPageReady();
    await this.verifyLoginFormVisible();
    await this.enterEmail(email);
    await this.wait(300);
    await this.enterPassword(password);
    await this.wait(500);
    await this.verifyLoginButtonVisible();
    await this.clickLogin();
  }

  /**
   * Click the "Forgot your password?" link
   */
  async clickForgotPassword(): Promise<void> {
    await this.waitForVisible(this.loginLocators.forgotPasswordLink, 10000);
    await this.click(this.loginLocators.forgotPasswordLink);
  }

  /**
   * Click the "Create account" link
   */
  async clickCreateAccount(): Promise<void> {
    await this.waitForVisible(this.loginLocators.createAccountLink, 10000);
    await this.click(this.loginLocators.createAccountLink);
  }
}
