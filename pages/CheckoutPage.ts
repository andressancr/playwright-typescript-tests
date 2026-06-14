import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.zipInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.successMessage = page.getByText('Thank you for your order!');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async checkout(firstName: string, lastName: string, zip: string) {
    await this.checkoutButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
    await this.continueButton.click();
    await this.finishButton.click();
  }

  async clickContinueWithoutData() {
    await this.checkoutButton.click();
    await this.continueButton.click();
  }

  async expectError(texto: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(texto);
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible();
  }
}