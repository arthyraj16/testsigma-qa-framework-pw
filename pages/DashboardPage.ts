import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForLoad() {
    await expect(this.page.locator('text=/logout|sign out|projects|workspace|dashboard/i').first()).toBeVisible({ timeout: 30000 });
  }
}
