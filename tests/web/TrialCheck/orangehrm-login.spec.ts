import { test, expect } from '@playwright/test';

test('logs in successfully and opens the dashboard', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.waitForLoadState('domcontentloaded');

  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');
  const loginButton = page.getByRole('button', { name: 'Login' });

  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();

  await usernameInput.fill('Admin');
  await passwordInput.fill('admin123');
  await loginButton.click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
});
