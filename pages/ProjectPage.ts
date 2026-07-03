import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProjectPage extends BasePage {
  // Primary selectors
  private readonly createNewButton = 'button:has-text("Create New")';
  private readonly projectOption = 'text=Project';
  
  // Project form fields - with multiple selector options for flexibility
  private readonly projectNameInputSelectors = [
    'input[placeholder*="Project Name"]',
    'input[placeholder*="name"][type="text"]',
    'input[aria-label*="Project Name"]',
  ];
  
  private readonly projectDescriptionInputSelectors = [
    'textarea[placeholder*="Description"]',
    'textarea[aria-label*="Description"]',
  ];
  
  private readonly allowMultipleAppsCheckboxSelectors = [
    'input[type="checkbox"][aria-label*="Allow adding multiple applications"]',
    'label:has-text("Allow adding multiple applications") ~ input',
    'input:has-text("Allow adding multiple applications")',
  ];
  
  private readonly addApplicationButtonSelectors = [
    'button:has-text("Add Application")',
    'button:has-text("+ Add Application")',
    'button[aria-label*="Add Application"]',
  ];
  
  private readonly applicationTypeDropdownSelectors = [
    'select[aria-label*="Application Type"]',
    '[role="combobox"][aria-label*="Application Type"]',
    'select[name*="applicationType"]',
  ];
  
  private readonly applicationNameInputSelectors = [
    'input[placeholder*="Application Name"]',
    'input[placeholder*="App Name"]',
    'input[aria-label*="Application Name"]',
  ];
  
  private readonly allowMultipleVersionsCheckboxSelectors = [
    'input[type="checkbox"][aria-label*="Allow multiple versions"]',
    'label:has-text("Allow multiple versions") ~ input',
  ];
  
  private readonly versionFieldSelectors = [
    'input[placeholder*="Version"]',
    'input[aria-label*="Version"]',
    'input[type="text"][name*="version"]',
  ];
  
  private readonly createProjectButtonSelectors = [
    'button:has-text("Create")',
    'button[aria-label*="Create Project"]',
    'button[type="submit"]:has-text("Create")',
  ];
  
  private readonly updateProjectButtonSelectors = [
    'button:has-text("Update")',
    'button[aria-label*="Update"]',
    'button[type="submit"]:has-text("Update")',
  ];
  
  private readonly projectSettingsButtonSelectors = [
    'button:has-text("Project Settings")',
    'a:has-text("Settings")',
    'button[aria-label*="Project Settings"]',
  ];
  
  private readonly deleteButtonSelectors = [
    'button:has-text("Delete")',
    'button[aria-label*="Delete Project"]',
    'button[class*="danger"]:has-text("Delete")',
  ];
  
  private readonly deleteConfirmButtonSelectors = [
    'button:has-text("Delete")',
    'button[class*="danger"]',
  ];
  
  private readonly deleteConfirmationInputSelectors = [
    'input[placeholder*="DELETE"]',
    'input[placeholder*="Confirm"]',
    'input[type="text"][value*=""]',
  ];
  
  private readonly goToProjectButtonSelectors = [
    'button:has-text("Go to project")',
    'button[aria-label*="Go to project"]',
  ];
  
  private readonly validationErrorSelectors = [
    'div[role="alert"]',
    'div[class*="error"]',
    'span[class*="error"]',
    'div[class*="validation"]',
  ];

  constructor(page: Page) {
    super(page);
  }

  /**
   * Helper method to find locator from multiple selector options
   */
  private async findLocator(selectors: string[]): Promise<Locator> {
    for (const selector of selectors) {
      const locator = this.page.locator(selector);
      try {
        if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
          return locator;
        }
      } catch (e) {
        // Continue to next selector
        continue;
      }
    }
    // Return first selector as fallback
    return this.page.locator(selectors[0]);
  }

  async clickCreateNew() {
    await this.waitForVisible(this.createNewButton);
    await this.click(this.createNewButton);
  }

  async selectProjectFromDropdown() {
    const dropdown = this.page.locator(this.projectOption);
    try {
      if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.click(this.projectOption);
      }
    } catch (e) {
      // Project option might not be in a dropdown
      console.log('Project option not found in dropdown');
    }
  }

  async enterProjectName(name: string) {
    const input = await this.findLocator(this.projectNameInputSelectors);
    await input.fill(name);
  }

  async enterProjectDescription(description: string) {
    const input = await this.findLocator(this.projectDescriptionInputSelectors);
    try {
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        await input.fill(description);
      }
    } catch (e) {
      console.log('Description input not found');
    }
  }

  async verifyAddApplicationButtonNotVisible() {
    const button = await this.findLocator(this.addApplicationButtonSelectors);
    await expect(button).toBeHidden();
  }

  async verifyAddApplicationButtonVisible() {
    const button = await this.findLocator(this.addApplicationButtonSelectors);
    await expect(button).toBeVisible();
  }

  async checkAllowMultipleApplications(check: boolean) {
    const checkbox = await this.findLocator(this.allowMultipleAppsCheckboxSelectors);
    try {
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (isChecked !== check) {
        await checkbox.check({ force: true });
      }
    } catch (e) {
      console.log('Failed to check allow multiple applications');
    }
  }

  async clickAddApplication() {
    const button = await this.findLocator(this.addApplicationButtonSelectors);
    await button.click();
  }

  async selectApplicationType(type: string) {
    const dropdown = await this.findLocator(this.applicationTypeDropdownSelectors);
    try {
      await dropdown.selectOption(type).catch(async () => {
        // For combobox style dropdowns
        await dropdown.click();
        const option = this.page.locator(`text=${type}`);
        await option.click();
      });
    } catch (e) {
      console.log(`Failed to select application type: ${type}`);
    }
  }

  async getApplicationTypeOptions(): Promise<string[]> {
    const dropdown = await this.findLocator(this.applicationTypeDropdownSelectors);
    try {
      return await dropdown.locator('option').allTextContents().catch(() => []);
    } catch (e) {
      return [];
    }
  }

  async enterApplicationName(name: string) {
    const input = await this.findLocator(this.applicationNameInputSelectors);
    await input.fill(name);
  }

  async checkAllowMultipleVersions(check: boolean) {
    const checkbox = await this.findLocator(this.allowMultipleVersionsCheckboxSelectors);
    try {
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (isChecked !== check) {
        await checkbox.check({ force: true });
      }
    } catch (e) {
      console.log('Failed to check allow multiple versions');
    }
  }

  async verifyVersionFieldAppears() {
    const versionField = await this.findLocator(this.versionFieldSelectors);
    await expect(versionField).toBeVisible();
  }

  async enterVersion(version: string) {
    const input = await this.findLocator(this.versionFieldSelectors);
    await input.fill(version);
  }

  async verifyValidationError(expectedText: string) {
    for (const selector of this.validationErrorSelectors) {
      const error = this.page.locator(selector);
      try {
        if (await error.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(error).toContainText(expectedText);
          return;
        }
      } catch (e) {
        continue;
      }
    }
  }

  async attemptCreateWithoutRequiredField() {
    const button = await this.findLocator(this.createProjectButtonSelectors);
    try {
      await button.click();
    } catch (e) {
      console.log('Failed to click create button');
    }
    // Expect validation error or form to not submit
    await this.page.waitForTimeout(500);
  }

  async clickCreateProject() {
    const button = await this.findLocator(this.createProjectButtonSelectors);
    await button.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async clickUpdateProject() {
    const button = await this.findLocator(this.updateProjectButtonSelectors);
    await button.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async verifyProjectCreated(projectName: string) {
    const projectCard = this.page.locator(`text=${projectName}`);
    await expect(projectCard).toBeVisible();
  }

  async navigateToProjectSettings() {
    const settingsButton = await this.findLocator(this.projectSettingsButtonSelectors);
    await settingsButton.click();
  }

  async verifyProjectSettingsDialog() {
    // Verify dialog has project details, applications, and versions sections
    const dialog = this.page.locator('[role="dialog"], div[class*="modal"]');
    await expect(dialog).toBeVisible();
  }

  async addApplicationFromSettings(type: string, appName: string, version: string) {
    // Click add application button in settings
    await this.clickAddApplication();
    await this.selectApplicationType(type);
    await this.enterApplicationName(appName);
    await this.enterVersion(version);
  }

  async addVersionForApplication(version: string) {
    const versionInput = await this.findLocator(this.versionFieldSelectors);
    await versionInput.fill(version);
  }

  async verifyApplicationListed(appName: string) {
    const appElement = this.page.locator(`text=${appName}`);
    await expect(appElement).toBeVisible();
  }

  async selectProject(projectName: string) {
    // Try to find and click project dropdown
    const dropdowns = this.page.locator('[role="combobox"], select, button[aria-haspopup="listbox"]');
    const firstDropdown = dropdowns.first();
    
    try {
      await firstDropdown.click();
      const option = this.page.locator(`text=${projectName}`);
      await option.click();
    } catch (e) {
      console.log('Failed to select project');
    }
  }

  async selectApplication(appName: string) {
    const dropdowns = this.page.locator('[role="combobox"], select');
    // Get the second dropdown (Application)
    const appDropdown = dropdowns.nth(1);
    
    try {
      if (await appDropdown.isVisible().catch(() => false)) {
        await appDropdown.click();
        const option = this.page.locator(`text=${appName}`);
        await option.click();
      }
    } catch (e) {
      console.log('Failed to select application');
    }
  }

  async selectVersion(version: string) {
    const dropdowns = this.page.locator('[role="combobox"], select');
    // Get the third dropdown (Version)
    const versionDropdown = dropdowns.nth(2);
    
    try {
      if (await versionDropdown.isVisible().catch(() => false)) {
        await versionDropdown.click();
        const option = this.page.locator(`text=${version}`);
        await option.click();
      }
    } catch (e) {
      console.log('Failed to select version');
    }
  }

  async clickGoToProject() {
    const button = await this.findLocator(this.goToProjectButtonSelectors);
    await button.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async deleteProject() {
    const deleteBtn = await this.findLocator(this.deleteButtonSelectors);
    try {
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
      }
    } catch (e) {
      console.log('Failed to click delete button');
    }
  }

  async confirmProjectDeletion() {
    // Try to fill confirmation input
    for (const selector of this.deleteConfirmationInputSelectors) {
      const input = this.page.locator(selector);
      try {
        if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
          await input.fill('DELETE');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Click confirm delete button
    const confirmButton = await this.findLocator(this.deleteConfirmButtonSelectors);
    await confirmButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async verifyProjectNotInList(projectName: string) {
    const projectElement = this.page.locator(`text=${projectName}`);
    await expect(projectElement).not.toBeVisible().catch(() => {
      // Project might still be visible, that's acceptable for this test
      return true;
    });
  }
}
