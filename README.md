# SauceDemo E2E Tests

Projeto de testes End-to-End (E2E) com Playwright + TypeScript, cobrindo fluxos de login, compra, ordenação de produtos, cenários negativos e responsividade no site [SauceDemo](https://www.saucedemo.com/).

Site testado: [SauceDemo](https://www.saucedemo.com/) — aplicação de e-commerce pública, criada especificamente para prática de automação de testes.

Relatório publicado: [https://andressancr.github.io/playwright-typescript-tests/](https://andressancr.github.io/playwright-typescript-tests/)

---

## Cenários de Teste

### Login — `tests/login.spec.ts`

Valida diferentes comportamentos de autenticação usando os usuários de teste padrão do SauceDemo.

| Cenário | Usuário | Resultado Esperado |
|---|---|---|
| Login com sucesso | `standard_user` | Redireciona para `/inventory`, exibe "Products" |
| Login bloqueado | `locked_out_user` | Mensagem de erro "locked out", permanece na tela de login |
| Login com imagens incorretas | `problem_user` | Login funciona normalmente (imagens erradas são um bug visual conhecido do site) |
| Login com atraso de performance | `performance_glitch_user` | Login funciona, mas demora mais (timeout estendido para 10s) |
| Login com error_user | `error_user` | Login funciona normalmente, acessa a página de produtos |
| Login com visual_user | `visual_user` | Login funciona normalmente, acessa a página de produtos |

### Checkout — `tests/checkout.spec.ts`

Fluxo completo de compra e remoção de produtos do carrinho.

| Cenário | Etapas |
|---|---|
| Finalizar compra | Login → adicionar produto ao carrinho → verificar contador → ir ao carrinho → preencher dados de entrega → finalizar → verificar mensagem "Thank you for your order!" |
| Remover produto do carrinho | Login → adicionar produto ao carrinho → ir ao carrinho → remover produto → verificar carrinho vazio |

### Ordenação de Produtos — `tests/sort.spec.ts`

Valida que os filtros de ordenação da loja funcionam corretamente.

| Cenário | Filtro Aplicado | Validação |
|---|---|---|
| Ordenar por preço | Price (low to high) | Lista de preços extraída e comparada com a versão ordenada — devem ser iguais |
| Ordenar por nome | Name (A to Z) | Lista de nomes extraída e comparada com a versão ordenada alfabeticamente |

### Cenários Negativos — `tests/negative-scenarios.spec.ts`

Valida comportamentos de borda e tratamento de erros da aplicação.

| Cenário | Ação | Validação |
|---|---|---|
| Logout | Login → abrir menu lateral → Logout | Retorna para a tela de login (`baseURL`), campo "Username" visível |
| Carrinho vazio | Login → ir direto ao carrinho sem adicionar itens | Badge do carrinho não aparece, 0 itens listados |
| Checkout sem dados | Login → adicionar produto → ir ao checkout → avançar sem preencher campos | Mensagem de erro "First Name is required" exibida |

### Responsividade — `tests/responsive.spec.ts`

Valida o comportamento da aplicação em diferentes tamanhos de tela.

| Cenário | Viewport | Validação |
|---|---|---|
| Login em mobile | iPhone 13 (viewport, user-agent, touch) | Login funciona, página de produtos visível |
| Menu lateral em mobile | iPhone 13 | Menu abre e exibe a opção de logout |
| Produtos em tablet | 768x1024 | Lista de produtos visível |

---

## Resultados dos Testes

| Suíte | Arquivo | Testes | Resultado |
|---|---|---|---|
| Login | `login.spec.ts` | 6 | 6 passed |
| Checkout | `checkout.spec.ts` | 2 | 2 passed |
| Ordenação | `sort.spec.ts` | 2 | 2 passed |
| Cenários Negativos | `negative-scenarios.spec.ts` | 3 | 3 passed |
| Responsividade | `responsive.spec.ts` | 3 | 3 passed |
| Total | — | 16 | 16 passed |

Execução multi-browser: os testes rodam em Chromium, Firefox e WebKit.

---

## Tags — Smoke e Regression

Os testes possuem tags no nome para permitir execução de subconjuntos:

| Tag | Quantidade | Uso |
|---|---|---|
| `@smoke` | 3 testes | Validação rápida dos fluxos críticos (login, checkout, logout) |
| `@regression` | 13 testes | Suite completa de regressão |

### Executar por tag

```bash
npx playwright test --grep "@smoke" --project=chromium
npx playwright test --grep "@regression" --project=chromium
```

---

## Page Object Model (POM) e Fixtures

Para evitar repetição de código e facilitar manutenção, os seletores e ações de cada tela ficam isolados em "Page Objects", e as fixtures customizadas eliminam a repetição do processo de login.

| Page Object | Responsabilidade |
|---|---|
| `pages/LoginPage.ts` | Campos de usuário/senha, botão de login, mensagens de erro |
| `pages/InventoryPage.ts` | Lista de produtos, carrinho, ordenação, menu/logout, remoção de itens |
| `pages/CheckoutPage.ts` | Formulário de entrega, botões de continuar/finalizar, mensagens de sucesso e erro |

| Fixture | Descrição |
|---|---|
| `loginPage`, `inventoryPage`, `checkoutPage` | Page Objects instanciados automaticamente |
| `loggedInPage` | Já realiza o login com `standard_user` e entrega a página de produtos pronta |

Arquivo: `fixtures/index.ts`

Vantagem: se o site mudar um seletor, a correção é feita em um único lugar — o Page Object — e todos os testes que o usam continuam funcionando. Com as fixtures, novos testes não precisam repetir o passo a passo de login.

---

## Variáveis de Ambiente

As credenciais e a URL base do projeto ficam centralizadas em um arquivo `.env` (não versionado), evitando dados sensíveis "hardcoded" no código.

### Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

```
USER_STANDARD=standard_user
USER_LOCKED=locked_out_user
USER_PROBLEM=problem_user
USER_PERFORMANCE=performance_glitch_user
USER_ERROR=error_user
USER_VISUAL=visual_user
USER_PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com/
```

O arquivo `.env` está no `.gitignore` e não é enviado ao repositório. Cada pessoa que clonar o projeto precisa criar o seu próprio.

---

## Executar Localmente

### Pré-requisitos

- Node.js 18 ou superior ([nodejs.org](https://nodejs.org))
- npm (instalado junto com o Node.js)
- VS Code (recomendado) ou outro editor

### 1. Clonar o repositório

```bash
git clone https://github.com/andressancr/playwright-typescript-tests.git
cd playwright-typescript-tests
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo `.env`

Veja a seção "Variáveis de Ambiente" acima.

### 4. Instalar os browsers do Playwright

```bash
npx playwright install
```

### 5. Rodar todos os testes

```bash
npx playwright test
```

### 6. Rodar com o navegador visível (modo headed)

```bash
npx playwright test --headed
```

### 7. Rodar apenas em um browser específico

```bash
npx playwright test --project=chromium
```

### 8. Rodar um arquivo específico

```bash
npx playwright test tests/checkout.spec.ts
```

### 9. Ver o relatório HTML da última execução

```bash
npx playwright show-report
```

---

## Modo UI Interativo

O Playwright tem uma interface visual para rodar, debugar e inspecionar testes em tempo real:

```bash
npx playwright test --ui
```

| Recurso | Para que serve |
|---|---|
| Lista de testes | Mostra todos os testes organizados pelos grupos (`describe`): Login, Checkout, Ordenação, Cenários Negativos, Responsividade |
| Botão Play | Roda os testes selecionados ou todos de uma vez |
| Watch mode | Reroda os testes automaticamente sempre que você salva um arquivo |
| Timeline / Trace Viewer | Mostra cada ação (`goto`, `fill`, `click`...) com um screenshot da tela naquele momento exato |
| Pick Locator | Permite testar seletores ao vivo, clicando em elementos da página |

Esse modo é ideal para debugar falhas: é possível ver exatamente em qual passo o teste quebrou e como a tela estava naquele momento, sem precisar adicionar `console.log`.

---

## Allure Report

Além do relatório HTML padrão do Playwright, o projeto está configurado para gerar relatórios no formato Allure, com gráficos de tendência, categorização de falhas e timeline detalhada por teste.

### Gerar e abrir o relatório Allure

```bash
npx playwright test --project=chromium
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

As pastas `allure-results/` e `allure-report/` são geradas automaticamente e não são versionadas (estão no `.gitignore`).

---

## CI/CD — GitHub Actions

O projeto possui um workflow configurado em `.github/workflows/playwright.yml`, que executa automaticamente a cada `push` ou `pull request` na branch `main`.

### O que o pipeline faz

1. Faz checkout do código
2. Instala o Node.js
3. Instala as dependências (`npm ci`)
4. Instala os browsers do Playwright
5. Cria o arquivo `.env` a partir dos Secrets configurados no repositório
6. Executa todos os testes
7. Publica o relatório HTML como artifact (disponível por 30 dias)
8. Publica o relatório HTML no GitHub Pages (apenas na branch `main`)

### Secrets necessários

As variáveis de ambiente do `.env` precisam ser configuradas como Secrets no repositório do GitHub (`Settings > Secrets and variables > Actions`):

| Secret | Valor |
|---|---|
| `USER_STANDARD` | `standard_user` |
| `USER_LOCKED` | `locked_out_user` |
| `USER_PROBLEM` | `problem_user` |
| `USER_PERFORMANCE` | `performance_glitch_user` |
| `USER_ERROR` | `error_user` |
| `USER_VISUAL` | `visual_user` |
| `USER_PASSWORD` | `secret_sauce` |
| `BASE_URL` | `https://www.saucedemo.com/` |

### Ver os resultados

- Aba Actions do repositório: acompanha a execução do pipeline
- Relatório publicado: [https://andressancr.github.io/playwright-typescript-tests/](https://andressancr.github.io/playwright-typescript-tests/)

---

## Estrutura do Projeto

```
playwright-typescript-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml          Pipeline CI/CD
├── fixtures/
│   └── index.ts                    Fixtures customizadas (loggedInPage, etc.)
├── tests/
│   ├── login.spec.ts               Testes de Login (6 testes)
│   ├── checkout.spec.ts            Testes de Checkout (2 testes)
│   ├── sort.spec.ts                Testes de Ordenação (2 testes)
│   ├── negative-scenarios.spec.ts  Cenários Negativos (3 testes)
│   └── responsive.spec.ts          Responsividade (3 testes)
├── pages/
│   ├── LoginPage.ts                Page Object da tela de login
│   ├── InventoryPage.ts            Page Object da lista de produtos / menu / carrinho
│   └── CheckoutPage.ts             Page Object do checkout
├── playwright-report/              Gerado automaticamente (relatório HTML)
├── allure-results/                 Gerado automaticamente (dados Allure, não versionado)
├── allure-report/                  Gerado automaticamente (relatório Allure, não versionado)
├── test-results/                   Gerado automaticamente (screenshots/vídeos de falhas)
├── .env                            Variáveis de ambiente (não versionado)
├── .gitignore
├── playwright.config.ts            Configuração central do Playwright
├── package.json
└── README.md
```

---

## Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
|---|---|
| TypeScript | Linguagem usada para escrever os testes — adiciona tipagem ao JavaScript |
| Node.js | Runtime que executa o código TypeScript/JavaScript fora do navegador |
| Playwright | Framework de automação — controla os browsers e executa os testes |
| npm | Gerenciador de pacotes — instala Playwright e demais dependências |
| dotenv | Carrega variáveis de ambiente do arquivo `.env` |
| Allure | Geração de relatórios visuais detalhados |
| Chromium / Firefox / WebKit | Browsers reais usados para execução dos testes |
| HTML | Relatórios visuais gerados automaticamente pelo Playwright |
| YAML | Configuração do pipeline CI/CD no GitHub Actions |
| GitHub Actions | Pipeline CI/CD — executa os testes automaticamente a cada push e publica o relatório |
| GitHub Pages | Hospeda o relatório HTML publicado automaticamente |
