import { test, expect } from '@playwright/test';
import { SauceDemoTestLibrary, TestUtils } from '../lib/index';

test.describe('Cart Functionality', () => {
  let testLibrary: SauceDemoTestLibrary;

  test.beforeEach(async ({ page }) => {
    testLibrary = new SauceDemoTestLibrary(page);
    await testLibrary.loginAsStandardUser();
  });

  test('should display empty cart initially', async ({ page }) => {
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify cart is empty
    await testLibrary.cartPage.verifyCartIsEmpty();
  });

  test('should add item to cart and verify in cart page', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart from inventory
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify item is in cart
    await testLibrary.cartPage.verifyItemInCart(productName);
    
    // Verify cart count
    const cartCount = await testLibrary.cartPage.getCartItemsCount();
    expect(cartCount).toBe(1);
  });

  test('should add multiple items to cart and verify all items', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
    
    // Add items to cart
    await testLibrary.addItemsToCart(productNames);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify all items are in cart
    for (const productName of productNames) {
      await testLibrary.cartPage.verifyItemInCart(productName);
    }
    
    // Verify cart count
    const cartCount = await testLibrary.cartPage.getCartItemsCount();
    expect(cartCount).toBe(productNames.length);
  });

  test('should remove item from cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify item is in cart
    await testLibrary.cartPage.verifyItemInCart(productName);
    
    // Remove item from cart
    await testLibrary.cartPage.removeItemFromCart(productName);
    
    // Verify cart is empty
    await testLibrary.cartPage.verifyCartIsEmpty();
  });

  test('should continue shopping from cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Continue shopping
    await testLibrary.cartPage.continueShopping();
    
    // Verify we're back on inventory page
    await testLibrary.inventoryPage.verifyInventoryPage();
  });

  test('should proceed to checkout from cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Proceed to checkout
    await testLibrary.cartPage.proceedToCheckout();
    
    // Verify we're on checkout page
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
  });

  test('should verify item details in cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Get product details from inventory
    const inventoryPrice = await testLibrary.inventoryPage.getProductPrice(productName);
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Get item details from cart
    const cartPrice = await testLibrary.cartPage.getItemPriceInCart(productName);
    const cartQuantity = await testLibrary.cartPage.getItemQuantityInCart(productName);
    
    // Verify details match
    expect(cartPrice).toBe(inventoryPrice);
    expect(cartQuantity).toBe('1');
  });

  test('should handle multiple identical items', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart twice
    await testLibrary.inventoryPage.addItemToCart(productName);
    await testLibrary.inventoryPage.removeItemFromCart(productName);
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify only one item is in cart (SauceDemo doesn't allow quantity increase)
    const cartCount = await testLibrary.cartPage.getCartItemsCount();
    expect(cartCount).toBe(1);
  });

  test('should verify cart items match added items', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    
    // Add items to cart
    await testLibrary.addItemsToCart(productNames);
    
    // Navigate to cart
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Get cart items
    const cartItems = await testLibrary.cartPage.getCartItems();
    const cartItemNames = cartItems.map((item: any) => item.name);
    
    // Verify all added items are in cart
    for (const productName of productNames) {
      expect(cartItemNames).toContain(productName);
    }
  });

  test('should handle empty cart checkout attempt', async ({ page }) => {
    // Navigate to cart without adding items
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
    
    // Verify cart is empty
    await testLibrary.cartPage.verifyCartIsEmpty();
    
    // Try to proceed to checkout
    await testLibrary.cartPage.proceedToCheckout();
    
    // Should still be able to proceed (SauceDemo allows empty cart checkout)
    await testLibrary.checkoutPage.verifyCheckoutInformationPage();
  });
});
