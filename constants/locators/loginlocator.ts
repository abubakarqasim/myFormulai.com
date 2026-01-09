import { Locator, Page } from '@playwright/test';

/**
 * Login Locators
 * Contains all locators related to the Login functionality
 */
export class LoginLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Email input field locator
   * <input id="CustomerEmail" name="customer[email]" type="email" placeholder="Email">
   */
  get emailInput(): Locator {
    return this.page.locator('#CustomerEmail').or(this.page.locator('input[name="customer[email]"]'));
  }

  /**
   * Password input field locator
   * <input id="CustomerPassword" name="customer[password]" type="password" placeholder="Password">
   */
  get passwordInput(): Locator {
    return this.page.locator('#CustomerPassword').or(this.page.locator('input[name="customer[password]"]'));
  }

  /**
   * Login button locator
   * <button><span class="button-text">Login</span></button>
   */
  get loginButton(): Locator {
    return this.page.locator('span.button-text').filter({ hasText: /Login/i }).locator('..');
  }

  /**
   * Login button locator (fallback by role)
   */
  get loginButtonByRole(): Locator {
    return this.page.getByRole('button', { name: /Login/i });
  }

  /**
   * Login button locator (fallback by text)
   */
  get loginButtonByText(): Locator {
    return this.page.locator('button').filter({ hasText: /Login/i });
  }

  /**
   * Forgot password link locator
   * <a>Forgot your password?</a>
   */
  get forgotPasswordLink(): Locator {
    return this.page.getByText(/Forgot your password/i);
  }

  /**
   * Create account link/button locator
   * <a>Create account</a>
   */
  get createAccountLink(): Locator {
    return this.page.getByText(/Create account/i);
  }

  /**
   * Login form container locator
   * Used to verify the login page has loaded
   */
  get loginForm(): Locator {
    return this.page.locator('form').or(this.page.locator('[class*="login"]'));
  }
}
