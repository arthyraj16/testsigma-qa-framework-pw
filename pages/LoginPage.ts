import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly loginUrl = 'https://id.testsigma.com/ui/login';
  private readonly emailInput = '#login-email';
  private readonly passwordInput = '#login-password';
  private readonly signInButton = 'button:has-text("Sign in")';
  private readonly forgotPasswordLink = 'a:has-text("Forgot password?")';
  private readonly passwordToggleIcon = 'input#login-password + div [data-icon-name*="visibility"], input#login-password + div [data-testid*="visibility"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.navigateTo(this.loginUrl);
  }

  async loginWithEmail(email: string, password: string) {
    await this.waitForVisible(this.emailInput);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async fillEmail(email: string) {
    await this.fill(this.emailInput, email.trim());
  }

  async fillPassword(password: string) {
    await this.fill(this.passwordInput, password);
  }

  async submit() {
    await Promise.all([
      this.click(this.signInButton),
      this.page.waitForLoadState('networkidle').catch(() => undefined),
    ]);
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  async getValidationError() {
    const errorLocator = this.page.locator(
      'div.bg-error-50, p.text-xs.text-text-error, div:has-text("Username is required"), div:has-text("Please enter a valid email address"), div:has-text("Please fill out this field")'
    );

    await errorLocator.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => undefined);

    if (await errorLocator.count()) {
      const text = (await errorLocator.first().innerText()).trim();
      if (text) {
        return text;
      }
    }

    const activeValidation = await this.page.evaluate(() => {
      const active = document.activeElement as HTMLInputElement | null;
      return active?.validationMessage ?? '';
    });
    if (activeValidation.trim()) {
      return activeValidation.trim();
    }

    const bodyText = await this.page.locator('body').first().innerText();
    const patterns = [
      'Username is required',
      'Please enter a valid email address',
      'Please fill out this field',
      'Incorrect password',
      'invalid email',
      'incorrect',
      'invalid',
      'failed',
      'wrong',
      'required',
    ];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      const match = bodyText.match(regex);
      if (match?.[0]) {
        return match[0].trim();
      }
    }

    return '';
  }

  async togglePasswordVisibility() {
    await this.waitForVisible(this.passwordToggleIcon, 15000);
    await this.click(this.passwordToggleIcon);
  }

  async getPasswordFieldType() {
    return this.page.locator(this.passwordInput).evaluate((input: HTMLInputElement) => input.type);
  }
}
