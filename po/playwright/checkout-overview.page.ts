import { Page, Locator } from '@playwright/test';

class CheckoutOverviewPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly cartItems: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartItems = page.locator('.cart_item');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
  }

  async verifyCheckoutOverviewPage() {
    await this.finishButton.waitFor({ state: 'visible' });
    await this.page.waitForSelector('.summary_info');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async getCheckoutItems() {
    const items = await this.cartItems.all();
    const itemNames = [];
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      if (name) {
        itemNames.push(name);
      }
    }
    return itemNames;
  }

  async getOrderSummary() {
    const subtotal = await this.itemTotal.textContent() || '';
    const tax = await this.tax.textContent() || '';
    const total = await this.total.textContent() || '';
    
    return {
      subtotal,
      tax,
      total
    };
  }

  async verifyPaymentInformation() {
    await this.paymentInfo.waitFor({ state: 'visible' });
    const paymentInfo = await this.paymentInfo.textContent();
    return paymentInfo;
  }

  async verifyShippingInformation() {
    await this.shippingInfo.waitFor({ state: 'visible' });
    const shippingInfo = await this.shippingInfo.textContent();
    return shippingInfo;
  }

  async getPaymentInfo() {
    return await this.paymentInfo.textContent();
  }

  async getShippingInfo() {
    return await this.shippingInfo.textContent();
  }

  async getTotalPrice() {
    return await this.total.textContent();
  }

  async getSubtotal() {
    return await this.itemTotal.textContent();
  }

  async getTax() {
    return await this.tax.textContent();
  }
}

export { CheckoutOverviewPage };
