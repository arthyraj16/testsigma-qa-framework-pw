import { test, expect } from '@playwright/test';

test('Testsigma login and dashboard verification', async ({ page }, testInfo) => {
  await page.goto('https://app.testsigma.com/ui/');

  const emailInput = page.locator('#login-email');
  const passwordInput = page.locator('#login-password');
  const signInButton = page.locator('button[type="submit"]', { hasText: /sign in/i });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(signInButton).toBeVisible();

  await emailInput.fill('Shashi.r@democheck.com');
  await passwordInput.fill('Testsigma');

  await Promise.all([
    page.waitForURL(/^(?!.*login)/, { waitUntil: 'networkidle', timeout: 30000 }),
    signInButton.click(),
  ]);

  await expect(page).not.toHaveURL(/login/, { timeout: 30000 });

  const loggedInElement = page.locator(
    'button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout"), a:has-text("Sign out"), [aria-label*="user" i], [data-testid*="user" i], [data-qa*="user" i], text=/dashboard/i'
  ).first();

  await expect(loggedInElement).toBeVisible({ timeout: 30000 });

  const errorMessage = page.locator('text=/invalid|error|failed|wrong credentials|incorrect/i');
  await expect(errorMessage).toHaveCount(0);

  await page.screenshot({ path: testInfo.outputPath('testsigma-dashboard.png'), fullPage: true });
});
