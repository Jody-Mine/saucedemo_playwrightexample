import { Page, Locator } from '@playwright/test';

class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async fillInformation(first: string, last: string, postal: string) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(postal);
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  // Additional required methods
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async verifyCheckoutInformationPage() {
    await this.page.waitForSelector('[data-test="firstName"]');
    await this.page.waitForSelector('[data-test="lastName"]');
    await this.page.waitForSelector('[data-test="postalCode"]');
  }

  async verifyCheckoutOverviewPage() {
    await this.page.waitForSelector('[data-test="finish"]');
  }

  async getOverviewItems() {
    const items = await this.page.locator('.cart_item').all();
    const itemDetails = [];
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      const price = await item.locator('.inventory_item_price').textContent();
      itemDetails.push({ name, price });
    }
    return itemDetails;
  }

  async getPaymentInfo() {
    return await this.page.locator('[data-test="payment-info-value"]').textContent();
  }

  async getShippingInfo() {
    return await this.page.locator('[data-test="shipping-info-value"]').textContent();
  }

  async getTotalPrice() {
    return await this.page.locator('[data-test="total-label"]').textContent();
  }

  async getSubtotal() {
    return await this.page.locator('[data-test="subtotal-label"]').textContent();
  }

  async getTax() {
    return await this.page.locator('[data-test="tax-label"]').textContent();
  }

  async verifyErrorMessage(expectedMessage: string) {
    const errorElement = this.page.locator('[data-test="error"]');
    await errorElement.waitFor({ state: 'visible' });
    const actualMessage = await errorElement.textContent();
    if (actualMessage !== expectedMessage) {
      throw new Error(`Expected error message "${expectedMessage}" but got "${actualMessage}"`);
    }
  }
}
export { CheckoutPage };
