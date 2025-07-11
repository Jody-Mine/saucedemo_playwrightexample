import { test, expect } from '@playwright/test';
import { SauceDemoTestLibrary, TestUtils } from '../lib/index';

test.describe('Checkout Functionality', () => {
  let testLibrary: SauceDemoTestLibrary;

  test.beforeEach(async ({ page }) => {
    testLibrary = new SauceDemoTestLibrary(page);
    await testLibrary.loginAsStandardUser();
  });

  test('should complete full checkout process with single item', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Complete checkout flow
    await testLibrary.completeCheckoutFlow([productName]);
    
    // Verify we're on completion page
    await testLibrary.checkoutCompletePage.verifyCheckoutComplete();
    
    // Navigate back to home
    await testLibrary.checkoutCompletePage.backToHome();
    
    // Verify we're back on inventory page
    await testLibrary.inventoryPage.verifyInventoryPage();
  });

  test('should complete full checkout process with multiple items', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
    
    // Complete checkout flow
    await testLibrary.completeCheckoutFlow(productNames);
    
    // Verify completion message
    const completionMessage = await testLibrary.checkoutCompletePage.getCompletionMessage();
    expect(completionMessage).toContain('dispatch');
  });

  test('should validate checkout information form', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item and navigate to checkout
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Try to continue without filling information
    await testLibrary.checkoutPage.continueToOverview();
    
    // Verify error message for missing first name
    await testLibrary.checkoutPage.verifyErrorMessage('Error: First Name is required');
  });

  test('should validate missing last name', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item and navigate to checkout
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Fill only first name
    await testLibrary.checkoutPage.fillCheckoutInformation('John', '', '');
    await testLibrary.checkoutPage.continueToOverview();
    
    // Verify error message for missing last name
    await testLibrary.checkoutPage.verifyErrorMessage('Error: Last Name is required');
  });

  test('should validate missing postal code', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item and navigate to checkout
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Fill first and last name only
    await testLibrary.checkoutPage.fillCheckoutInformation('John', 'Doe', '');
    await testLibrary.checkoutPage.continueToOverview();
    
    // Verify error message for missing postal code
    await testLibrary.checkoutPage.verifyErrorMessage('Error: Postal Code is required');
  });

  test('should cancel checkout from information page', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item and navigate to checkout
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Cancel checkout
    await testLibrary.checkoutPage.cancelCheckout();
    
    // Verify we're back on cart page
    await testLibrary.cartPage.verifyCartPage();
  });

  test('should cancel checkout from overview page', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item and navigate to checkout
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Fill checkout information
    const userData = TestUtils.getTestData().checkoutInfo;
    await testLibrary.checkoutPage.fillCheckoutInformation(userData.firstName, userData.lastName, userData.postalCode);
    await testLibrary.checkoutPage.continueToOverview();
    await testLibrary.checkoutOverviewPage.verifyCheckoutOverviewPage();
    
    // Cancel checkout
    await testLibrary.checkoutOverviewPage.cancelCheckout();
    
    // Verify we're back on inventory page
    await testLibrary.inventoryPage.verifyInventoryPage();
  });

  test('should verify checkout overview displays correct items', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    
    // Add items and navigate to checkout overview
    await testLibrary.addItemsToCart(productNames);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    const userData = TestUtils.getTestData().checkoutInfo;
    await testLibrary.checkoutPage.fillCheckoutInformation(userData.firstName, userData.lastName, userData.postalCode);
    await testLibrary.checkoutPage.continueToOverview();
    await testLibrary.checkoutOverviewPage.verifyCheckoutOverviewPage();
    
    // Verify items in overview
    const overviewItems = await testLibrary.checkoutOverviewPage.getCheckoutItems();
    for (const productName of productNames) {
      expect(overviewItems).toContain(productName);
    }
  });

  test('should verify checkout overview displays payment and shipping info', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Navigate to checkout overview
    await testLibrary.addItemsToCart([productName]);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    const userData = TestUtils.getTestData().checkoutInfo;
    await testLibrary.checkoutPage.fillCheckoutInformation(userData.firstName, userData.lastName, userData.postalCode);
    await testLibrary.checkoutPage.continueToOverview();
    await testLibrary.checkoutOverviewPage.verifyCheckoutOverviewPage();
    
    // Verify payment and shipping information
    await testLibrary.checkoutOverviewPage.verifyPaymentInformation();
    await testLibrary.checkoutOverviewPage.verifyShippingInformation();
  });

  test('should verify checkout overview displays correct pricing', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    
    // Calculate expected total
    const expectedTotal = await testLibrary.calculateExpectedTotal(productNames);
    
    // Navigate to checkout overview
    await testLibrary.addItemsToCart(productNames);
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    const userData = TestUtils.getTestData().checkoutInfo;
    await testLibrary.checkoutPage.fillCheckoutInformation(userData.firstName, userData.lastName, userData.postalCode);
    await testLibrary.checkoutPage.continueToOverview();
    await testLibrary.checkoutOverviewPage.verifyCheckoutOverviewPage();
    
    // Get order summary
    const orderSummary = await testLibrary.checkoutOverviewPage.getOrderSummary();
    
    // Verify subtotal matches expected
    const subtotalValue = TestUtils.parsePriceToNumber(orderSummary.subtotal.replace('Item total: ', ''));
    expect(subtotalValue).toBe(expectedTotal);
    
    // Verify tax is calculated
    expect(orderSummary.tax).toMatch(/Tax: \$\d+\.\d{2}/);
    
    // Verify total includes tax
    expect(orderSummary.total).toMatch(/Total: \$\d+\.\d{2}/);
  });

  test('should complete checkout with custom user data', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const customUserData = TestUtils.generateUserData();
    
    // Complete checkout with custom data
    await testLibrary.completeCheckoutFlowWithCustomData([productName], customUserData);
    
    // Verify completion
    await testLibrary.checkoutCompletePage.verifyCheckoutComplete();
  });

  test('should handle checkout with all available products', async ({ page }) => {
    // Get all products and add them to cart
    const allProducts = await testLibrary.getAllProducts();
    
    // Complete checkout with all products
    await testLibrary.completeCheckoutFlow(allProducts);
    
    // Verify completion
    await testLibrary.checkoutCompletePage.verifyCheckoutComplete();
  });

  test('should maintain cart contents through checkout process', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
    
    // Add items to cart
    await testLibrary.addItemsToCart(productNames);
    
    // Verify cart contents
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    const cartItems = await testLibrary.cartPage.getCartItems();
    expect(cartItems).toHaveLength(productNames.length);
    
    // Proceed to checkout
    await testLibrary.cartPage.proceedToCheckout();
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
    
    // Fill information and continue
    const userData = TestUtils.getTestData().checkoutInfo;
    await testLibrary.checkoutPage.fillCheckoutInformation(userData.firstName, userData.lastName, userData.postalCode);
    await testLibrary.checkoutPage.continueToOverview();
    await testLibrary.checkoutOverviewPage.verifyCheckoutOverviewPage();
    
    // Verify items are still present in overview
    const overviewItems = await testLibrary.checkoutOverviewPage.getCheckoutItems();
    expect(overviewItems).toHaveLength(productNames.length);
    
    for (const productName of productNames) {
      expect(overviewItems).toContain(productName);
    }
  });
});
