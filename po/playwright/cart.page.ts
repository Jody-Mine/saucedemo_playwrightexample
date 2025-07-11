import { Page, Locator } from '@playwright/test';

class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('button[data-test^="remove-"]');
  }

  async removeItem(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async removeItemFromCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await item.locator('button[data-test^="remove-"]').click();
  }

  async getItemQuantityInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    const qtyLocator = item.locator('.cart_quantity');
    if (await qtyLocator.count() > 0) {
      return await qtyLocator.textContent();
    }
    return '1';
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async verifyCartPage() {
    await this.page.waitForSelector('.cart_list');
  }

  async verifyItemInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await item.waitFor({ state: 'visible' });
  }

  async verifyCartIsEmpty() {
    const count = await this.cartItems.count();
    if (count !== 0) throw new Error('Cart is not empty');
  }

  async getItemPriceInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    return await item.locator('.inventory_item_price').textContent();
  }

  async getCartItems() {
    const items = await this.cartItems.all();
    const cartItems = [];
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      const price = await item.locator('.inventory_item_price').textContent();
      cartItems.push({ name, price });
    }
    return cartItems;
  }
}
export { CartPage };
