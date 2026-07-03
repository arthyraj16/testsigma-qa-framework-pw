import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrgSelectionPage extends BasePage {
  private readonly orgPageUrlSegment = '/ui/org';
  private readonly organizationTitle = 'h2:has-text("Products")';
  private readonly activeOrganizationCard = 'div.rounded-lg.cursor-pointer:has(h3)';

  constructor(page: Page) {
    super(page);
  }

  async waitForLoad() {
    await expect(this.page).toHaveURL(new RegExp(this.orgPageUrlSegment), { timeout: 30000 });
    await expect(this.page.locator(this.organizationTitle)).toBeVisible({ timeout: 30000 });
    await expect(this.page.locator(this.activeOrganizationCard).first()).toBeVisible({ timeout: 30000 });
  }

  async selectFirstOrganization() {
    const card = this.page.locator(this.activeOrganizationCard).first();
    await expect(card).toBeVisible({ timeout: 30000 });
    await Promise.all([
      card.click(),
      this.page.waitForURL(/\/ui\/dashboard/, { timeout: 30000 }),
    ]);
  }

  async selectOrganization(name: string) {
    const card = this.page.locator(`${this.activeOrganizationCard}:has(h3:text-is("${name}"))`).first();
    await expect(card).toBeVisible({ timeout: 30000 });
    await Promise.all([
      card.click(),
      this.page.waitForURL(/\/ui\/dashboard/, { timeout: 30000 }),
    ]);
  }
}
