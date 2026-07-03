import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { OrgSelectionPage } from '../../pages/OrgSelectionPage';
import { DashboardPage } from '../../pages/DashboardPage';
import loginData from '../../testdata/login-data.json';

const loginUrl = 'https://id.testsigma.com/ui/login';
const orgSelectionUrl = 'https://id.testsigma.com/ui/org';
const dashboardUrl = 'https://app.testsigma.com/ui/dashboard';
const forgotPasswordUrl = 'https://id.testsigma.com/ui/forgot_password';

const validEmail = process.env.TS_EMAIL;
const validPassword = process.env.TS_PASSWORD;

if (!validEmail || !validPassword) {
  throw new Error('TS_EMAIL and TS_PASSWORD must be set in environment variables');
}

test.describe('@regression Testsigma login suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.context().clearPermissions();
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('#login-email').waitFor({ state: 'visible', timeout: 15000 });
  });

  test('@smoke Valid login redirects through org selection to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orgSelectionPage = new OrgSelectionPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginWithEmail(validEmail, validPassword);
    await orgSelectionPage.waitForLoad();
    await orgSelectionPage.selectFirstOrganization();

    await dashboardPage.waitForLoad();
  });

  test('@smoke Invalid password displays error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginWithEmail(validEmail, loginData.invalidPassword);
    await expect(page).toHaveURL(/login/);
    const errorText = await loginPage.getValidationError();

    expect(errorText.toLowerCase()).toMatch(/incorrect|invalid|password/);
  });

  test('Unregistered email displays error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginWithEmail(loginData.unregisteredEmail, validPassword);
    await expect(page).toHaveURL(/login/);
    const errorText = await loginPage.getValidationError();

    expect(errorText).not.toBe('');
  });

  test('Empty email shows required field validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginWithEmail(loginData.emptyEmail, validPassword);
    const validationMessage = await loginPage.getValidationError();

    expect(validationMessage.toLowerCase()).toContain('please fill out this field');
  });

  test('Empty password shows required field validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginWithEmail(validEmail, loginData.emptyPassword);
    const validationMessage = await loginPage.getValidationError();

    expect(validationMessage.toLowerCase()).toContain('please fill out this field');
  });

  test('Invalid email format shows validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginWithEmail(loginData.invalidEmailFormat, validPassword);
    const validationMessage = await loginPage.getValidationError();

    expect(validationMessage.toLowerCase()).toMatch(/please enter a valid email address|username is required|invalid email/i);
  });

  test('Leading/trailing spaces in email are handled correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orgSelectionPage = new OrgSelectionPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.loginWithEmail(`  ${validEmail}  `, validPassword);

    await orgSelectionPage.waitForLoad();
    await orgSelectionPage.selectFirstOrganization();

    await dashboardPage.waitForLoad();
  });

  test('Forgot password link navigates to reset page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(new RegExp(`${forgotPasswordUrl}`));
  });

  test('Password masking toggles visibility', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    expect(await loginPage.getPasswordFieldType()).toBe('password');
    await page.fill('#login-password', 'Testsigma');
    await loginPage.togglePasswordVisibility();
    expect(await loginPage.getPasswordFieldType()).toBe('text');
    await loginPage.togglePasswordVisibility();
    expect(await loginPage.getPasswordFieldType()).toBe('password');
  });

  test('Direct dashboard URL without login redirects to login page', async ({ page }) => {
    await page.goto(dashboardUrl, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/ui\/login/);
  });
});
