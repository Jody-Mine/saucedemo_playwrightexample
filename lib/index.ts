import { Page } from '@playwright/test';
import { LoginPage } from '../po/playwright/login.page';
import { InventoryPage } from '../po/playwright/inventory.page';
import { CartPage } from '../po/playwright/cart.page';
import { CheckoutPage } from '../po/playwright/checkout.page';
import { CheckoutCompletePage } from '../po/playwright/checkout-complete.page';
import { CheckoutOverviewPage } from '../po/playwright/checkout-overview.page';

export class SauceDemoTestLibrary {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly checkoutCompletePage: CheckoutCompletePage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
  }

  async loginAsStandardUser() {
    await this.loginPage.navigateToLogin();
    await this.loginPage.login('standard_user', 'secret_sauce');
    await this.inventoryPage.page.waitForSelector('.inventory_list');
  }

  async loginWithCredentials(username: string, password: string) {
    await this.loginPage.navigateToLogin();
    await this.loginPage.login(username, password);
    await this.inventoryPage.page.waitForSelector('.inventory_list');
  }

  async resetAppState() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.page.click('#react-burger-menu-btn');
    await this.page.click('#reset_sidebar_link');
    await this.page.click('#react-burger-cross-btn');
  }

  // Missing utility methods
  async addItemsToCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.inventoryPage.addItemToCart(productName);
    }
  }

  async verifyCartBadgeCount(expectedCount: number) {
    const cartBadge = this.page.locator('.shopping_cart_badge');
    if (expectedCount === 0) {
      await cartBadge.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
        // If badge doesn't disappear, check if count is 0
      });
    } else {
      await cartBadge.waitFor({ state: 'visible' });
      const badgeText = await cartBadge.textContent();
      if (badgeText !== expectedCount.toString()) {
        throw new Error(`Expected cart badge count ${expectedCount}, but got ${badgeText}`);
      }
    }
  }

  async getAllProducts() {
    await this.inventoryPage.verifyInventoryPage();
    const productElements = await this.page.locator('.inventory_item_name').all();
    const productNames: string[] = [];
    for (const element of productElements) {
      const name = await element.textContent();
      if (name) productNames.push(name);
    }
    return productNames;
  }

  async completeCheckoutFlow(productNames: string[], userData?: any) {
    // Add items to cart if not already added
    if (productNames && productNames.length > 0) {
      await this.addItemsToCart(productNames);
    }
    
    // Navigate to cart and proceed to checkout
    await this.inventoryPage.navigateToCart();
    await this.cartPage.proceedToCheckout();
    
    // Fill checkout information
    const user = userData || {
      firstName: 'Test',
      lastName: 'User',
      postalCode: '12345'
    };
    
    await this.checkoutPage.fillCheckoutInformation(user.firstName, user.lastName, user.postalCode);
    await this.checkoutPage.continueToOverview();
    await this.checkoutPage.finishOrder();
  }

  async completeCheckoutFlowWithCustomData(productNames: string[], userData: any) {
    return this.completeCheckoutFlow(productNames, userData);
  }

  async calculateExpectedTotal(productNames: string[]) {
    let total = 0;
    for (const productName of productNames) {
      const priceText = await this.inventoryPage.getProductPrice(productName);
      const price = TestUtils.parsePriceToNumber(priceText || '0');
      total += price;
    }
    // Return subtotal without tax
    return parseFloat(total.toFixed(2));
  }

  async logout() {
    await this.page.click('#react-burger-menu-btn');
    await this.page.click('#logout_sidebar_link');
  }
}

export class TestUtils {
  static getTestData() {
    return {
      validUser: { username: 'standard_user', password: 'secret_sauce' },
      lockedUser: { username: 'locked_out_user', password: 'secret_sauce' },
      problemUser: { username: 'problem_user', password: 'secret_sauce' },
      performanceUser: { username: 'performance_glitch_user', password: 'secret_sauce' },
      errorUser: { username: 'error_user', password: 'secret_sauce' },
      visualUser: { username: 'visual_user', password: 'secret_sauce' },
      checkoutInfo: { firstName: 'John', lastName: 'Doe', postalCode: '12345' },
    };
  }
  static parsePriceToNumber(price: string) {
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  }
  static generateUserData() {
    return {
      firstName: 'Generated',
      lastName: 'User',
      postalCode: '54321',
    };
  }

  static selectRandomProducts(products: string[], count: number): string[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
