import { expect, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.fill(value);
  }

  async waitForVisible(selector: string, timeout = 10000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  async getErrorText() {
    const bodyText = await this.page.locator('body').innerText();
    const match = bodyText.match(/invalid|incorrect|failed|wrong|required|please fill out this field|please fill in this field|please enter a valid email address|please include|invalid email|username is required/i);
    return match ? match[0].trim() : '';
  }

  currentUrl() {
    return this.page.url();
  }
}
