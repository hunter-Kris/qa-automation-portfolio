import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectProduct(name: string, price: string) {
    await expect(this.page.getByText(name, { exact: true })).toBeVisible();
    await expect(this.page.getByText(price, { exact: true })).toBeVisible();
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async checkout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
