import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cenários Negativos', () => {

  test('logout retorna para a tela de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);

    await inventoryPage.logout();

    await expect(page).toHaveURL(process.env.BASE_URL!);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('carrinho vazio não permite checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.goToCart();

    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('checkout sem preencher dados mostra erro', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.addFirstProductToCart();
    await inventoryPage.goToCart();

    await checkoutPage.clickContinueWithoutData();

    await checkoutPage.expectError('First Name is required');
  });

});