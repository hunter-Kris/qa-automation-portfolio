import { test } from '@playwright/test';
import { checkoutCustomer, demoUsers } from '../../fixtures/test-data';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(demoUsers.standard.username, demoUsers.standard.password);

    const inventory = new InventoryPage(page);
    await inventory.addFirstProduct();
    await inventory.openCart();
    await new CartPage(page).checkout();
  });

  test('@smoke customer can complete checkout', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.enterCustomer(checkoutCustomer);
    await checkout.finish();
    await checkout.expectComplete();
  });

  test('@regression checkout rejects a missing last name', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.enterCustomer({ ...checkoutCustomer, lastName: '' });
    await checkout.expectValidation('Error: Last Name is required');
  });
});
