import { Page, Locator } from '@playwright/test';

class CheckoutCompletePage {
  readonly page: Page;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async verifyCheckoutComplete() {
    await this.completeHeader.waitFor({ state: 'visible' });
    await this.completeText.waitFor({ state: 'visible' });
  }

  async getCompletionMessage() {
    return await this.completeText.textContent();
  }

  async getCompleteHeader() {
    return await this.completeHeader.textContent();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }

  async backToHome() {
    await this.backToProductsButton.click();
  }
}

export { CheckoutCompletePage };
