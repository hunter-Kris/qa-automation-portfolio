import { expect, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByText('Products', { exact: true })).toBeVisible();
  }

  async addFirstProduct() {
    await this.page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
  }

  async removeFirstProduct() {
    await this.page.getByRole('button', { name: 'Remove', exact: true }).first().click();
  }

  async openCart() {
    await this.page.getByRole('button', { name: /^Cart/ }).click();
  }

  async sortBy(value: 'lohi' | 'hilo' | 'az' | 'za') {
    const labels = {
      lohi: 'Price (low to high)',
      hilo: 'Price (high to low)',
      az: 'Name (A to Z)',
      za: 'Name (Z to A)'
    } as const;
    await this.page.getByRole('combobox', { name: 'Sort products' }).selectOption({ label: labels[value] });
  }

  async prices() {
    return this.page.getByText(/^\$\d+\.\d{2}$/).allTextContents();
  }
}
