# 🎭 SauceDemo E2E Tests

Projeto de testes End-to-End (E2E) com **Playwright + TypeScript**, cobrindo fluxos de login, compra, ordenação de produtos e cenários negativos no site [SauceDemo](https://www.saucedemo.com/).

🎯 **Site testado:** [SauceDemo](https://www.saucedemo.com/) — aplicação de e-commerce pública, criada especificamente para prática de automação de testes.

---

## 🧪 Cenários de Teste

### 🔵 Login — `tests/login.spec.ts`

Valida diferentes comportamentos de autenticação usando os usuários de teste padrão do SauceDemo.

| Cenário | Usuário | Resultado Esperado |
|---|---|---|
| Login com sucesso | `standard_user` | Redireciona para `/inventory`, exibe "Products" |
| Login bloqueado | `locked_out_user` | Mensagem de erro "locked out", permanece na tela de login |
| Login com imagens incorretas | `problem_user` | Login funciona normalmente (imagens erradas são um bug visual conhecido do site) |
| Login com atraso de performance | `performance_glitch_user` | Login funciona, mas demora mais (timeout estendido para 10s) |

### 🟢 Checkout — `tests/checkout.spec.ts`

Fluxo completo de compra, do login até a confirmação do pedido.

| Etapa | Ação |
|---|---|
| 1 | Login com `standard_user` |
| 2 | Adicionar o primeiro produto da lista ao carrinho |
| 3 | Verificar contador do carrinho = "1" |
| 4 | Acessar o carrinho |
| 5 | Preencher dados de entrega (nome, sobrenome, CEP) |
| 6 | Finalizar compra |
| 7 | Verificar mensagem "Thank you for your order!" |

### 🟡 Ordenação de Produtos — `tests/sort.spec.ts`

Valida que os filtros de ordenação da loja funcionam corretamente.

| Cenário | Filtro Aplicado | Validação |
|---|---|---|
| Ordenar por preço | Price (low to high) | Lista de preços extraída e comparada com a versão ordenada — devem ser iguais |
| Ordenar por nome | Name (A to Z) | Lista de nomes extraída e comparada com a versão ordenada alfabeticamente |

### 🔴 Cenários Negativos — `tests/negative-scenarios.spec.ts`

Valida comportamentos de borda e tratamento de erros da aplicação.

| Cenário | Ação | Validação |
|---|---|---|
| Logout | Login → abrir menu lateral → Logout | Retorna para a tela de login (`baseURL`), campo "Username" visível |
| Carrinho vazio | Login → ir direto ao carrinho sem adicionar itens | Badge do carrinho não aparece, 0 itens listados |
| Checkout sem dados | Login → adicionar produto → ir ao checkout → avançar sem preencher campos | Mensagem de erro "First Name is required" exibida |

---

## 📊 Resultados dos Testes

| Suíte | Arquivo | Testes | Resultado |
|---|---|---|---|
| 🔵 Login | `login.spec.ts` | 4 | ✅ 4 passed |
| 🟢 Checkout | `checkout.spec.ts` | 1 | ✅ 1 passed |
| 🟡 Ordenação | `sort.spec.ts` | 2 | ✅ 2 passed |
| 🔴 Cenários Negativos | `negative-scenarios.spec.ts` | 3 | ✅ 3 passed |
| **Total** | — | **10** | ✅ **10 passed** |

> Execução multi-browser: os testes rodam em **Chromium**, **Firefox** e **WebKit**, totalizando 30 execuções (10 testes × 3 browsers).

---

## 📖 Entendendo a Estrutura — Page Object Model (POM)

Para evitar repetição de código e facilitar manutenção, os seletores e ações de cada tela ficam isolados em "Page Objects":

| Page Object | Responsabilidade |
|---|---|
| `pages/LoginPage.ts` | Campos de usuário/senha, botão de login, mensagens de erro |
| `pages/InventoryPage.ts` | Lista de produtos, botão "Add to cart", carrinho, ordenação, menu/logout |
| `pages/CheckoutPage.ts` | Formulário de entrega, botões de continuar/finalizar, mensagens de sucesso e erro |

**Vantagem:** se o site mudar um seletor (ex: o botão "Login" virar "Sign in"), você corrige em **um único lugar** — o Page Object — e todos os testes que o usam continuam funcionando.

---

## 🔐 Variáveis de Ambiente

As credenciais e a URL base do projeto ficam centralizadas em um arquivo `.env` (não versionado), evitando dados sensíveis "hardcoded" no código.

### Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

```
USER_STANDARD=standard_user
USER_LOCKED=locked_out_user
USER_PROBLEM=problem_user
USER_PERFORMANCE=performance_glitch_user
USER_PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com/
```

> ⚠️ O arquivo `.env` está no `.gitignore` e **não é enviado ao repositório**. Cada pessoa que clonar o projeto precisa criar o seu próprio.

---

## ▶️ Executar Localmente

### Pré-requisitos

- **Node.js** 18 ou superior ([nodejs.org](https://nodejs.org))
- **npm** (instalado junto com o Node.js)
- **VS Code** (recomendado) ou outro editor

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/testes-saucedemo.git
cd testes-saucedemo
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo `.env`

Veja a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) acima.

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

## 🖥️ Modo UI Interativo

O Playwright tem uma interface visual para rodar, debugar e inspecionar testes em tempo real:

```bash
npx playwright test --ui
```

### O que você encontra no modo UI

| Recurso | Para que serve |
|---|---|
| **Lista de testes** | Mostra todos os testes organizados pelos grupos (`describe`): Login, Checkout, Ordenação, Cenários Negativos |
| **Botão Play (▶)** | Roda os testes selecionados ou todos de uma vez |
| **Watch mode** | Reroda os testes automaticamente sempre que você salva um arquivo |
| **Timeline / Trace Viewer** | Mostra cada ação (`goto`, `fill`, `click`...) com um screenshot da tela naquele momento exato |
| **Pick Locator** | Permite testar seletores ao vivo, clicando em elementos da página |

> 💡 Esse modo é ideal para **debugar falhas**: você vê exatamente em qual passo o teste quebrou e como a tela estava naquele momento, sem precisar adicionar `console.log`.

---

## 🔁 CI/CD — GitHub Actions

O projeto já vem com um workflow configurado em `.github/workflows/playwright.yml`, que executa automaticamente a cada `push` ou `pull request` na branch `main`.

### O que o pipeline faz

1. Faz checkout do código
2. Instala o Node.js
3. Instala as dependências (`npm ci`)
4. Instala os browsers do Playwright
5. Executa todos os testes
6. Publica o relatório HTML como artifact (disponível por 30 dias)

> ⚠️ As variáveis de ambiente do `.env` precisam ser configuradas como **Secrets** no repositório do GitHub (`Settings > Secrets and variables > Actions`) para o pipeline funcionar.

### Ver os resultados

Acesse a aba **Actions** do repositório no GitHub após qualquer push para acompanhar a execução.

---

## 📁 Estrutura do Projeto

```
testes-saucedemo/
├── .github/
│   └── workflows/
│       └── playwright.yml      ← Pipeline CI/CD
├── tests/
│   ├── login.spec.ts                 ← Testes de Login (4 testes)
│   ├── checkout.spec.ts              ← Teste de Checkout (1 teste)
│   ├── sort.spec.ts                  ← Testes de Ordenação (2 testes)
│   └── negative-scenarios.spec.ts    ← Cenários Negativos (3 testes)
├── pages/
│   ├── LoginPage.ts              ← Page Object da tela de login
│   ├── InventoryPage.ts          ← Page Object da lista de produtos / menu
│   └── CheckoutPage.ts           ← Page Object do checkout
├── playwright-report/            ← Gerado automaticamente (relatórios)
├── test-results/                 ← Gerado automaticamente (screenshots/vídeos de falhas)
├── .env                          ← Variáveis de ambiente (NÃO versionado)
├── .gitignore
├── playwright.config.ts          ← Configuração central do Playwright
├── package.json
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
|---|---|
| **TypeScript** | Linguagem usada para escrever os testes — adiciona tipagem ao JavaScript |
| **Node.js** | Runtime que executa o código TypeScript/JavaScript fora do navegador |
| **Playwright** | Framework de automação — controla os browsers e executa os testes |
| **npm** | Gerenciador de pacotes — instala Playwright e demais dependências |
| **dotenv** | Carrega variáveis de ambiente do arquivo `.env` |
| **Chromium / Firefox / WebKit** | Browsers reais usados para execução dos testes |
| **HTML** | Relatórios visuais gerados automaticamente pelo Playwright |
| **YAML** | Configuração do pipeline CI/CD no GitHub Actions |
| **GitHub Actions** | Pipeline CI/CD — executa os testes automaticamente a cada push |

---

## 🚀 Subindo este projeto para o GitHub

### 1. Confirmar o `.gitignore`

O arquivo `.gitignore` na raiz do projeto deve conter:

```
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/playwright/.auth/
.env
```

### 2. Inicializar o repositório Git (caso ainda não tenha feito)

```bash
git init
git add .
git commit -m "feat: projeto de testes SauceDemo com POM, .env e cenarios negativos"
```

### 3. Criar o repositório no GitHub

1. Acesse [github.com](https://github.com) e clique em **New repository**
2. Dê um nome (ex: `testes-saucedemo`)
3. **Não** marque a opção de criar README (já temos um)
4. Clique em **Create repository**
5. Copie a URL exibida, algo como `https://github.com/seu-usuario/testes-saucedemo.git`

### 4. Conectar e enviar o código

```bash
git branch -M main
git remote add origin https://github.com/seu-usuario/testes-saucedemo.git
git push -u origin main
```

### 5. Verificar o pipeline

Acesse a aba **Actions** no GitHub — o workflow `playwright.yml` deve disparar automaticamente e rodar todos os testes na nuvem.

---

## ✅ Próximos Passos Sugeridos

- [ ] Adicionar testes para os demais usuários do SauceDemo (`error_user`, `visual_user`)
- [ ] Adicionar testes de remoção de produtos do carrinho
- [ ] Adicionar testes de responsividade (mobile viewport)
- [ ] Adicionar fixtures customizadas para reduzir repetição de login
- [ ] Adicionar tags (`@smoke`, `@regression`) para rodar subconjuntos de testes
- [ ] Integrar relatório com Allure ou publicar HTML report no GitHub Pages