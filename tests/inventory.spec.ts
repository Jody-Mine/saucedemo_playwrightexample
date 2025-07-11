import { test, expect } from '@playwright/test';
import { SauceDemoTestLibrary, TestUtils } from '../lib/index';

test.describe('Inventory Functionality', () => {
  let testLibrary: SauceDemoTestLibrary;

  test.beforeEach(async ({ page }) => {
    testLibrary = new SauceDemoTestLibrary(page);
    await testLibrary.loginAsStandardUser();
  });

  test('should display all inventory items', async ({ page }) => {
    const products = await testLibrary.inventoryPage.getAllProductNames();
    
    // Verify we have expected number of products
    expect(products).toHaveLength(6);
    
    // Verify specific products exist
    expect(products).toContain('Sauce Labs Backpack');
    expect(products).toContain('Sauce Labs Bike Light');
    expect(products).toContain('Sauce Labs Bolt T-Shirt');
    expect(products).toContain('Sauce Labs Fleece Jacket');
    expect(products).toContain('Sauce Labs Onesie');
    expect(products).toContain('Test.allTheThings() T-Shirt (Red)');
  });

  test('should add single item to cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    
    // Verify item is added (button text changes)
    await testLibrary.inventoryPage.verifyProductAddedToCart(productName);
    
    // Verify cart badge shows count of 1
    await testLibrary.verifyCartBadgeCount(1);
  });

  test('should add multiple items to cart', async ({ page }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
    
    // Add items to cart
    await testLibrary.addItemsToCart(productNames);
    
    // Verify cart badge shows correct count
    await testLibrary.verifyCartBadgeCount(productNames.length);
  });

  test('should remove item from cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    
    // Add item to cart
    await testLibrary.inventoryPage.addItemToCart(productName);
    await testLibrary.verifyCartBadgeCount(1);
    
    // Remove item from cart
    await testLibrary.inventoryPage.removeItemFromCart(productName);
    
    // Verify cart badge is no longer visible (count = 0)
    await testLibrary.verifyCartBadgeCount(0);
  });

  test('should sort products by name A-Z', async ({ page }) => {
    await testLibrary.inventoryPage.sortProducts('az');
    
    const products = await testLibrary.inventoryPage.getAllProductNames();
    const sortedProducts = [...products].sort();
    
    expect(products).toEqual(sortedProducts);
  });

  test('should sort products by name Z-A', async ({ page }) => {
    await testLibrary.inventoryPage.sortProducts('za');
    
    const products = await testLibrary.inventoryPage.getAllProductNames();
    const sortedProducts = [...products].sort().reverse();
    
    expect(products).toEqual(sortedProducts);
  });

  test('should sort products by price low to high', async ({ page }) => {
    await testLibrary.inventoryPage.sortProducts('lohi');
    
    const products = await testLibrary.inventoryPage.getAllProductNames();
    const prices: number[] = [];
    
    for (const product of products) {
      const priceString = await testLibrary.inventoryPage.getProductPrice(product);
      prices.push(TestUtils.parsePriceToNumber(priceString));
    }
    
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('should sort products by price high to low', async ({ page }) => {
    await testLibrary.inventoryPage.sortProducts('hilo');
    
    const products = await testLibrary.inventoryPage.getAllProductNames();
    const prices: number[] = [];
    
    for (const product of products) {
      const priceString = await testLibrary.inventoryPage.getProductPrice(product);
      prices.push(TestUtils.parsePriceToNumber(priceString));
    }
    
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('should navigate to cart from inventory', async ({ page }) => {
    await testLibrary.inventoryPage.navigateToCart();
    await testLibrary.cartPage.verifyCartPage();
  });

  test('should get product details', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';
    const productDetails = await testLibrary.inventoryPage.getProductDetails(productName);
    
    expect(productDetails.name).toBe(productName);
    expect(productDetails.price).toMatch(/\$\d+\.\d{2}/);
    expect(productDetails.description).toContain('Sly Pack');
  });

  test('should add all items to cart and verify count', async ({ page }) => {
    const allProducts = await testLibrary.inventoryPage.getAllProductNames();
    
    // Add all items to cart
    await testLibrary.addItemsToCart(allProducts);
    
    // Verify cart badge shows correct count
    await testLibrary.verifyCartBadgeCount(allProducts.length);
  });
});
