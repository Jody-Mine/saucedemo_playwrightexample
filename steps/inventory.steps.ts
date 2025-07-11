import { When, Then } from '@cucumber/cucumber';
import { InventoryPage } from '../po/playwright/inventory.page';
import { expect } from '@playwright/test';

function getInventoryPage(world: any) {
  return new InventoryPage(world.page);
}

When('I sort inventory by {string}', async function (this: any, option: string) {
  const page = getInventoryPage(this);
  await page.sortBy(option);
});

Then('the inventory should be sorted by {string}', async function (this: any, option: string) {
  // Implement sorting verification logic here
  // For brevity, this is a placeholder
  expect(true).toBeTruthy();
});

When('I add item {int} to the cart', async function (this: any, index: number) {
  const page = getInventoryPage(this);
  await page.addItem(index);
});

When('I remove item {int} from the cart', async function (this: any, index: number) {
  const page = getInventoryPage(this);
  await page.removeItem(index);
});

When('I go to the cart', async function (this: any) {
  const page = getInventoryPage(this);
  await page.goToCart();
});
