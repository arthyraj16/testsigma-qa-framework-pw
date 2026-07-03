import { test } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const authFile = path.resolve(__dirname, '..', '..', '.auth', 'user.json');

test.describe('Auth setup', () => {
  test('save Testsigma auth state', async ({ page }) => {
    const email = process.env.TS_EMAIL;
    const password = process.env.TS_PASSWORD;

    if (!email || !password) {
      throw new Error('TS_EMAIL and TS_PASSWORD must be set in .env');
    }

    // Navigate to login with correct redirectTo (to id.testsigma.com where session is managed)
    await page.goto('https://app.testsigma.com/ui/login?redirectTo=https://id.testsigma.com/ui/dashboard', { waitUntil: 'domcontentloaded' });

    // Wait for email input to be visible (fail fast if wrong page/form not rendered)
    const emailInput = page.locator('input[placeholder="name@company.com"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Fill credentials
    await emailInput.fill(email);
    await page.locator('input[placeholder="Enter Password"]').fill(password);
    await page.locator('button:has-text("Sign in")').click();

    // Wait for dashboard to load
    await page.waitForURL((url: URL) => url.href.includes('/ui/dashboard'), {
      timeout: 30000,
    });

    // Ensure we're on the authenticated dashboard (id.testsigma.com is where session is valid)
    if (!page.url().includes('id.testsigma.com')) {
      await page.goto('https://id.testsigma.com/ui/dashboard', { waitUntil: 'networkidle' });
    }

    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.context().storageState({ path: authFile });
  });
});
