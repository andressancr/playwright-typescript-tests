import { test, expect } from '../fixtures';

test.describe('Ordenação de produtos', () => {

  test('ordenar produtos por preço (menor para maior) @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');

    const precos = await loggedInPage.getAllPrices();
    const precosOrdenados = [...precos].sort((a, b) => a - b);
    expect(precos).toEqual(precosOrdenados);
  });

  test('ordenar produtos por nome (A a Z) @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('az');

    const nomes = await loggedInPage.getAllProductNames();
    const nomesOrdenados = [...nomes].sort();
    expect(nomes).toEqual(nomesOrdenados);
  });

});