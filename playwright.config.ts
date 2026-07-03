import dotenv from 'dotenv';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/web',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://id.testsigma.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: '**/tests/web/**/auth.setup.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      // No storageState for setup - it creates the file
    },

    {
      name: 'chromium',
      testIgnore: '**/auth.setup.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   testIgnore: '**/auth.setup.spec.ts',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: path.resolve(__dirname, '.auth/user.json'),
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'webkit',
    //   testIgnore: '**/auth.setup.spec.ts',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: path.resolve(__dirname, '.auth/user.json'),
    //   },
    //   dependencies: ['setup'],
    // },

    /* API Tests */
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://app.testsigma.com/api/v1' },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
