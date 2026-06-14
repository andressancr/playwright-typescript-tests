import { test, expect } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {

  test('adicionar produto ao carrinho e finalizar compra @smoke', async ({ page, loggedInPage }) => {
    const checkoutPage = new CheckoutPage(page);

    await loggedInPage.addFirstProductToCart();
    await loggedInPage.expectCartCount('1');
    await loggedInPage.goToCart();

    await checkoutPage.checkout('João', 'Silva', '12345');
    await checkoutPage.expectSuccess();
  });

  test('remover produto do carrinho @regression', async ({ page, loggedInPage }) => {
    await loggedInPage.addFirstProductToCart();
    await loggedInPage.expectCartCount('1');

    await loggedInPage.goToCart();

    await loggedInPage.removeFirstProductFromCart();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });

});