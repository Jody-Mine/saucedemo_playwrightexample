// playwright POM for Swag Labs Login Page
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"], input[placeholder="Username"]');
    this.passwordInput = page.locator('[data-test="password"], input[placeholder="Password"]');
    this.loginButton = page.locator('[data-test="login-button"], input[type="submit"], button:has-text("Login")');
    this.errorMessage = page.locator('[data-test="error"], h3[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return '';
  }
}
