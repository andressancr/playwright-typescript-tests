import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.removeButtons = page.getByRole('button', { name: 'Remove' });
  }

  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  async expectCartCount(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async goToCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getAllPrices(): Promise<number[]> {
    const textos = await this.productPrices.allTextContents();
    // Remove o "$" e converte para número, ex: "$29.99" → 29.99
    return textos.map(t => parseFloat(t.replace('$', '')));
  }

  async logout() {
  await this.menuButton.click();
  await this.logoutLink.click();
  }

  async removeFirstProductFromCart() {
  await this.removeButtons.first().click();
  }

}