import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

  test('login com sucesso no SauceDemo', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login com usuário bloqueado mostra erro', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_LOCKED!, process.env.USER_PASSWORD!);

    await loginPage.expectError('locked out');
    await expect(page).toHaveURL(process.env.BASE_URL!);
  });

  test('login com problem_user ainda acessa produtos', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_PROBLEM!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login com performance_glitch_user é mais lento mas funciona', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_PERFORMANCE!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
  });

});