# Playwright Test Framework with Allure Reporting

A comprehensive Playwright automation testing framework with integrated Allure reporting for web and API tests.

## Project Structure

```
├── tests/
│   ├── api/              # API tests
│   └── web/              # Web UI tests
├── fixtures/             # Test fixtures and helpers
├── allure-results/       # Raw Allure test data (generated, excluded from git)
├── allure-report/        # Generated Allure HTML report (excluded from git)
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project dependencies and scripts
└── .github/workflows/    # CI/CD pipeline configuration
```

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests by project (Web or API)
```bash
npx playwright test --project=chromium  # Web tests
npx playwright test --project=api       # API tests
```

### Run specific test file
```bash
npx playwright test tests/web/path/to/test.spec.ts
```

### Run in headed mode (with browser UI)
```bash
npx playwright test --headed
```

## Allure Reporting

Allure results are automatically generated during test runs in the `allure-results/` folder.

### Generate and View Report Locally

```bash
npm run test:report:generate
npm run test:report:open
```

Or use a single command:
```bash
npm run test:report:generate && npm run test:report:open
```

### Report Contents
- **Overview**: Test execution summary, total counts, pass/fail rates
- **Tests**: Detailed test results with logs, attachments, and traces
- **Suites**: Organized by test categories
- **Timeline**: Execution timeline and duration analytics
- **History**: Historical test trends

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/playwright-ci.yml`) automatically:

1. **Runs Web Tests**: Executes Chromium-based web tests
2. **Runs API Tests**: Executes API tests
3. **Merges Reports**: Combines results from both test suites
4. **Generates Allure Report**: Creates a unified HTML report
5. **Uploads Artifacts**: Makes reports downloadable from GitHub Actions

### Accessing Reports in CI
- Download `allure-report` artifact from GitHub Actions workflow run
- Extract and open `index.html` in a browser

## Configuration Files

- **playwright.config.ts**: Test configuration, browser selection, reporter setup, timeouts
- **package.json**: Dependencies, scripts, project metadata
- **.gitignore**: Excludes generated reports and node_modules

## Debugging

### View Traces
Trace files are attached to test results and viewable in the Allure report.

### Run with Debug Mode
```bash
npx playwright test --debug
```

### View Test Results
```bash
npx playwright show-report
```

## Troubleshooting

### No Allure Report Generated
- Ensure tests ran successfully: `npx playwright test`
- Check `allure-results/` folder has data
- Reinstall allure-commandline: `npm install --save-dev allure-commandline`

### Report Won't Open
- Try: `npx allure serve allure-results`
- Or manually open: `open allure-report/index.html`

## Dependencies

- **@playwright/test**: Playwright testing framework
- **allure-playwright**: Allure reporter for Playwright
- **allure-commandline**: CLI tool for generating Allure reports
- **dotenv**: Environment variable management
- **@types/node**: TypeScript definitions for Node.js

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Allure Framework Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Reporter](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
