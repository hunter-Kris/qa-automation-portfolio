import { expect, type Page } from '@playwright/test';

type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async enterCustomer(customer: Customer) {
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(customer.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(customer.lastName);
    await this.page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill(customer.postalCode);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async expectValidation(message: string) {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  async expectComplete() {
    await expect(this.page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
    await expect(this.page.getByText(/Your order has been dispatched/)).toBeVisible();
  }
}
