import { test, expect } from '../fixtures';

test.describe('Login', () => {

  test('login com sucesso no SauceDemo @smoke', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_STANDARD!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login com usuário bloqueado mostra erro @regression', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_LOCKED!, process.env.USER_PASSWORD!);

    await loginPage.expectError('locked out');
    await expect(page).toHaveURL(process.env.BASE_URL!);
  });

  test('login com problem_user ainda acessa produtos @regression', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_PROBLEM!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login com performance_glitch_user é mais lento mas funciona @regression', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_PERFORMANCE!, process.env.USER_PASSWORD!);

    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
  });

  test('login com error_user acessa produtos @regression', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_ERROR!, process.env.USER_PASSWORD!);

    // error_user consegue logar, mas tem comportamentos quebrados em outras ações
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login com visual_user acessa produtos @regression', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_VISUAL!, process.env.USER_PASSWORD!);

    // visual_user tem pequenas diferenças visuais, mas login funciona
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

});