import { test, expect, devices } from '@playwright/test';
import 'dotenv/config';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// Extrai apenas viewport e userAgent do perfil iPhone 13 (sem defaultBrowserType)
const iphone13 = devices['iPhone 13'];

test.describe('Responsividade - Mobile (iPhone 13)', () => {
  test.use({
    viewport: iphone13.viewport,
    userAgent: iphone13.userAgent,
    hasTouch: iphone13.hasTouch,
    isMobile: iphone13.isMobile,
  });

  test('login funciona em viewport mobile @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('menu lateral abre corretamente em mobile @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.menuButton.click();
    await expect(inventoryPage.logoutLink).toBeVisible();
  });
});

test.describe('Responsividade - Tablet (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('produtos visíveis em viewport tablet @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });
});