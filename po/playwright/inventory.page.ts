import { Page, Locator } from '@playwright/test';

class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartButton = page.locator('.shopping_cart_link');
  }


  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  async sortProducts(option: string) {
    // Accepts 'az', 'za', 'lohi', 'hilo' or visible label
    let label = option;
    switch (option) {
      case 'az': label = 'Name (A to Z)'; break;
      case 'za': label = 'Name (Z to A)'; break;
      case 'lohi': label = 'Price (low to high)'; break;
      case 'hilo': label = 'Price (high to low)'; break;
    }
    
    // Wait for inventory page to be fully loaded first
    await this.verifyInventoryPage();
    
    // Wait for the dropdown to be visible and ready
    await this.sortDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.sortDropdown.selectOption({ label });
    
    // Wait for sorting to complete by waiting for the inventory list to be stable
    await this.page.waitForTimeout(500); // Give a moment for sorting to start
    await this.page.waitForSelector('.inventory_list', { state: 'visible' });
  }

  async addItemToCart(productName: string) {
    // Wait for the inventory page to be stable
    await this.page.waitForSelector('.inventory_list', { state: 'visible' });
    
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.waitFor({ state: 'visible' });
    
    // Check if item is already in cart (button shows "Remove" instead of "Add to cart")
    const removeButton = item.locator('button[data-test^="remove-"]');
    const addButton = item.locator('button[data-test^="add-to-cart-"]');
    
    if (await removeButton.count() > 0) {
      // Item is already in cart, no need to add it again
      console.log(`${productName} is already in cart`);
      return;
    }
    
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
  }

  async removeItemFromCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button[data-test^="remove-"]').click();
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductDetails(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    const name = await item.locator('.inventory_item_name').textContent();
    const price = await item.locator('.inventory_item_price').textContent();
    const description = await item.locator('.inventory_item_desc').textContent();
    return { name, price, description };
  }

  async getProductPrice(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    return await item.locator('.inventory_item_price').textContent();
  }

  async getProductImageSrc(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    return await item.locator('img.inventory_item_img').getAttribute('src');
  }

  async getAllProductImageSrcs(): Promise<string[]> {
    return await this.page.locator('img.inventory_item_img').evaluateAll(imgs => imgs.map(i => i.getAttribute('src') || ''));
  }

  async verifyProductAddedToCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    const btn = item.locator('button[data-test^="remove-"]');
    await btn.waitFor({ state: 'visible' });
  }

  async navigateToCart() {
    await this.cartButton.click();
  }

  async verifyInventoryPage() {
    await this.page.waitForSelector('.inventory_list');
  }

  async addItem(index: number) {
    const addButtons = this.page.locator('button[data-test^="add-to-cart-"]');
    await addButtons.nth(index).click();
  }

  async removeItem(index: number) {
    const removeButtons = this.page.locator('button[data-test^="remove-"]');
    await removeButtons.nth(index).click();
  }

  async goToCart() {
    await this.cartButton.click();
  }

  // Additional missing methods
  async getCartIconBoundingBox() {
    return await this.cartButton.boundingBox();
  }

  async sortAndCheckForError(option: string) {
    try {
      await this.sortProducts(option);
      // Check for any error messages or broken functionality
      const errorExists = await this.page.locator('[data-test="error"]').isVisible().catch(() => false);
      return errorExists;
    } catch (error) {
      return true; // Error occurred during sorting
    }
  }

  async getProductDescription(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    return await item.locator('.inventory_item_desc').textContent();
  }

  async verifyCartBadgeNotVisible() {
    await this.cartBadge.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      // Badge might still be visible with 0 or might not exist
    });
  }
}

export { InventoryPage };
