import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegisterLocators } from '../constants/locators/registerlocator';

/**
 * RegisterPage - Page Object Model for Formulai User Registration
 * 
 * This class handles all interactions with the registration page, including:
 * - Navigation to registration page
 * - Entering registration information
 * - Submitting registration form
 * 
 * All registration interactions are centralized here following the Page Object Model pattern.
 */
export class RegisterPage extends BasePage {
  readonly registerLocators: RegisterLocators;
  private static readonly REGISTRATION_URL = 'https://myformulai.com/account/register';
  private static readonly FIELD_TIMEOUT = 20000;
  private static readonly VISIBILITY_TIMEOUT = 15000;

  constructor(page: Page) {
    super(page);
    this.registerLocators = new RegisterLocators(page);
  }

  /**
   * Navigate to the registration page
   */
  async navigate(): Promise<void> {
    await this.goto(RegisterPage.REGISTRATION_URL, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  /**
   * Wait for registration page to be fully loaded and ready for interaction
   */
  async waitForRegisterPageReady(): Promise<void> {
    await this.waitForLoad({ state: 'domcontentloaded', timeout: 30000 });
    
    try {
      await this.page.waitForSelector('form, input[type="email"], input[type="password"]', { 
        state: 'visible', 
        timeout: 15000 
      });
    } catch (error) {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
  }

  /**
   * Fill a form input field with optimized waiting
   * @param locator - The input field locator
   * @param value - The value to fill
   */
  private async fillFormField(locator: any, value: string): Promise<void> {
    await this.waitForAttached(locator, RegisterPage.FIELD_TIMEOUT);
    await this.waitForVisible(locator, RegisterPage.VISIBILITY_TIMEOUT);
    await this.fill(locator, value);
  }

  /**
   * Enter first name in the registration form
   * @param firstName - First name to enter
   */
  async enterFirstName(firstName: string): Promise<void> {
    await this.fillFormField(this.registerLocators.firstNameInput, firstName);
  }

  /**
   * Enter last name in the registration form
   * @param lastName - Last name to enter
   */
  async enterLastName(lastName: string): Promise<void> {
    await this.fillFormField(this.registerLocators.lastNameInput, lastName);
  }

  /**
   * Enter email address in the registration form
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillFormField(this.registerLocators.emailInput, email);
  }

  /**
   * Enter password in the registration form
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillFormField(this.registerLocators.passwordInput, password);
  }

  /**
   * Fill complete registration form
   * @param firstName - First name
   * @param lastName - Last name
   * @param email - Email address
   * @param password - Password
   */
  async fillRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.enterFirstName(firstName);
    await this.wait(200);
    await this.enterLastName(lastName);
    await this.wait(200);
    await this.enterEmail(email);
    await this.wait(200);
    await this.enterPassword(password);
  }

  /**
   * Click the Create button with fallback locators
   */
  async clickCreate(): Promise<void> {
    try {
      await this.waitForVisible(this.registerLocators.createButton, RegisterPage.VISIBILITY_TIMEOUT);
      await this.click(this.registerLocators.createButton);
    } catch (error) {
      await this.waitForVisible(this.registerLocators.createButtonByText, RegisterPage.VISIBILITY_TIMEOUT);
      await this.click(this.registerLocators.createButtonByText);
    }
  }

  /**
   * Verify that the registration form fields are visible
   */
  async verifyRegisterFormVisible(): Promise<void> {
    const fields = [
      this.registerLocators.firstNameInput,
      this.registerLocators.lastNameInput,
      this.registerLocators.emailInput,
      this.registerLocators.passwordInput,
    ];

    for (const field of fields) {
      await this.waitForAttached(field, RegisterPage.FIELD_TIMEOUT);
      await this.waitForVisible(field, RegisterPage.VISIBILITY_TIMEOUT);
      await this.expectVisible(field);
    }
  }

  /**
   * Complete registration flow
   * @param firstName - First name
   * @param lastName - Last name
   * @param email - Email address
   * @param password - Password
   */
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.waitForRegisterPageReady();
    await this.verifyRegisterFormVisible();
    await this.fillRegistrationForm(firstName, lastName, email, password);
    await this.wait(300);
    await this.clickCreate();
  }
}
