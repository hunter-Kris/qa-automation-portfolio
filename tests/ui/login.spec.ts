import { test } from '@playwright/test';
import { demoUsers } from '../../fixtures/test-data';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).open();
  });

  test('@smoke standard user can sign in', async ({ page }) => {
    await new LoginPage(page).login(demoUsers.standard.username, demoUsers.standard.password);
    await new InventoryPage(page).expectLoaded();
  });

  test('@regression incorrect password is rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(demoUsers.standard.username, 'incorrect-password');
    await login.expectError('Epic sadface: Username and password do not match any user in this service');
  });

  test('@regression locked user receives a specific error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(demoUsers.locked.username, demoUsers.locked.password);
    await login.expectError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('@regression username is required', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('', demoUsers.standard.password);
    await login.expectError('Epic sadface: Username is required');
  });
});
