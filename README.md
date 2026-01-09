# MyFormulai Automation Framework

Automated testing framework for [Formulai](https://myformulai.com/) using Playwright.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [CI/CD](#cicd)

## 🚀 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MyFormulai
```

2. Install dependencies
```bash
npm install
```

3. Install Playwright browsers
```bash
npx playwright install
```

## 📁 Project Structure

```
MyFormulai/
├── tests/
│   ├── constants.js          # Centralized selectors and constants
│   ├── fixtures/             # Custom test fixtures
│   ├── helpers/              # Utility and helper functions
│   ├── pages/                # Page Object Models
│   └── *.spec.js             # Test files
├── playwright.config.js       # Playwright configuration
├── package.json
└── README.md
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run a specific test file
```bash
npx playwright test tests/homepage.spec.js
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests with specific tags
```bash
npx playwright test --grep @smoke
```

## ⚙️ Configuration

### Base URL

The base URL is configured in `playwright.config.js`. You can override it using environment variables:

```bash
# Use default (https://myformulai.com)
npm test

# Override for different environment
BASE_URL=https://staging.myformulai.com npm test
```

### Environment Variables

Create a `.env` file (not committed) for local configuration:

```env
BASE_URL=https://myformulai.com
```

## 🏗️ Best Practices

### Page Object Model (POM)

Tests use the Page Object Model pattern for better maintainability:

```javascript
// tests/pages/HomePage.js
class HomePage {
  constructor(page) {
    this.page = page;
  }
  
  async navigate() {
    await this.page.goto('/');
  }
  
  async clickShopLink() {
    await this.page.locator(SELECTORS.SHOP_LINK).click();
  }
}
```

### Selectors

- Prefer `data-testid` attributes
- Use role-based selectors when possible
- Avoid text-based selectors for critical elements
- Centralize all selectors in `tests/constants.js`

### Test Organization

- One test file per page/feature
- Use descriptive test names
- Group related tests with `test.describe()`
- Use `beforeEach` for common setup

## 📊 Reporting

Test reports are generated in the `playwright-report/` directory:

```bash
# View HTML report
npx playwright show-report
```

## 🔄 CI/CD

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🐛 Debugging

### Debug Tests
```bash
npx playwright test --debug
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

## 📝 Writing Tests

### Example Test

```javascript
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Homepage Tests', () => {
  test('should display main content', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(homePage.mainHeading).toBeVisible();
  });
});
```

## 🤝 Contributing

1. Follow the existing code structure
2. Write descriptive test names
3. Use Page Object Model pattern
4. Add appropriate comments
5. Update README if needed

## 📄 License

ISC

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Formulai Website](https://myformulai.com/)
