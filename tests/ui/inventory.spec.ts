import { expect, test } from '@playwright/test';
import { demoUsers, products } from '../../fixtures/test-data';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';

test.describe('Inventory and cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(demoUsers.standard.username, demoUsers.standard.password);
    await new InventoryPage(page).expectLoaded();
  });

  test('@smoke inventory shows the expected catalog state', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add to cart', exact: true })).toHaveCount(6);
    await expect(page.getByRole('img', { name: products.backpack.name })).toBeVisible();
    await expect(page.getByText(products.backpack.price, { exact: true })).toBeVisible();
  });

  test('@regression products sort by price from low to high', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = (await inventory.prices()).map((value) => Number(value.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('@smoke adding a product updates the cart badge', async ({ page }) => {
    await new InventoryPage(page).addFirstProduct();
    await expect(page.getByRole('button', { name: 'Cart, 1 item' })).toBeVisible();
  });

  test('@regression removing a product clears the cart badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addFirstProduct();
    await inventory.removeFirstProduct();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
  });

  test('@regression cart contents persist across inventory navigation', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addFirstProduct();
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.expectProduct(products.backpack.name, products.backpack.price);
    await cart.continueShopping();

    await inventory.expectLoaded();
    await expect(page.getByRole('button', { name: 'Cart, 1 item' })).toBeVisible();
  });
});
