import { test, expect } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cenários Negativos', () => {

  test('logout retorna para a tela de login @smoke', async ({ page, loggedInPage }) => {
    await loggedInPage.logout();

    await expect(page).toHaveURL(process.env.BASE_URL!);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('carrinho vazio não permite checkout @regression', async ({ page, loggedInPage }) => {
    await loggedInPage.goToCart();

    await expect(loggedInPage.cartBadge).not.toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('checkout sem preencher dados mostra erro @regression', async ({ page, loggedInPage }) => {
    const checkoutPage = new CheckoutPage(page);

    await loggedInPage.addFirstProductToCart();
    await loggedInPage.goToCart();

    await checkoutPage.clickContinueWithoutData();
    await checkoutPage.expectError('First Name is required');
  });

});