import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {

  test('adicionar produto ao carrinho e finalizar compra', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.addFirstProductToCart();
    await inventoryPage.expectCartCount('1');
    await inventoryPage.goToCart();

    await checkoutPage.checkout('João', 'Silva', '12345');
    await checkoutPage.expectSuccess();
  });

});