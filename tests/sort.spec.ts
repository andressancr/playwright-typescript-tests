import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Ordenação de produtos', () => {

  test('ordenar produtos por preço (menor para maior)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.sortBy('lohi');

    const precos = await inventoryPage.getAllPrices();
    const precosOrdenados = [...precos].sort((a, b) => a - b);
    expect(precos).toEqual(precosOrdenados);
  });

  test('ordenar produtos por nome (A a Z)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await inventoryPage.sortBy('az');

    const nomes = await inventoryPage.getAllProductNames();
    const nomesOrdenados = [...nomes].sort();
    expect(nomes).toEqual(nomesOrdenados);
  });

});