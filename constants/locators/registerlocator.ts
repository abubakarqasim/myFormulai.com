import { Locator, Page } from '@playwright/test';

/**
 * Register Locators
 * Contains all locators related to the User Registration functionality
 */
export class RegisterLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * First name input field locator
   * <input name="customer[first_name]" placeholder="First name">
   */
  get firstNameInput(): Locator {
    return this.page.locator('input[name="customer[first_name]"]').or(this.page.locator('#RegisterForm-FirstName'));
  }

  /**
   * Last name input field locator
   * <input name="customer[last_name]" placeholder="Last name">
   */
  get lastNameInput(): Locator {
    return this.page.locator('input[name="customer[last_name]"]').or(this.page.locator('#RegisterForm-LastName'));
  }

  /**
   * Email input field locator
   * <input type="email" name="customer[email]" placeholder="Email">
   */
  get emailInput(): Locator {
    return this.page.locator('input[name="customer[email]"]').or(this.page.locator('input[type="email"]'));
  }

  /**
   * Password input field locator
   * <input type="password" name="customer[password]" placeholder="Password">
   */
  get passwordInput(): Locator {
    return this.page.locator('input[name="customer[password]"]').or(this.page.locator('input[type="password"]'));
  }

  /**
   * Create button locator
   * <button>Create</button>
   */
  get createButton(): Locator {
    return this.page.getByRole('button', { name: /Create/i });
  }

  /**
   * Create button locator (fallback by text)
   */
  get createButtonByText(): Locator {
    return this.page.locator('button').filter({ hasText: /Create/i });
  }

  /**
   * Registration form container locator
   * Used to verify the registration page has loaded
   */
  get registerForm(): Locator {
    return this.page.locator('form').or(this.page.locator('[class*="register"]'));
  }
}
