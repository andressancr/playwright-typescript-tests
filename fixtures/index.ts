import 'dotenv/config';
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
  loggedInPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Fixture que já faz login com standard_user e entrega a página de produtos
  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);
    await expect(page).toHaveURL(/inventory/);

    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';