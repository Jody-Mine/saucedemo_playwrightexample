import { Page, Locator } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLogin() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  getValidUsernames(): string[] {
    return ['standard_user', 'locked_out_user', 'problem_user', 'performance_glitch_user', 'error_user', 'visual_user'];
  }

  getStandardPassword(): string {
    return 'secret_sauce';
  }

  async verifyErrorMessage(expectedMessage: string) {
    await this.errorMessage.waitFor({ state: 'visible' });
    const actualMessage = await this.errorMessage.textContent();
    if (actualMessage !== expectedMessage) {
      throw new Error(`Expected error message: "${expectedMessage}", but got: "${actualMessage}"`);
    }
  }
}
export { LoginPage };
