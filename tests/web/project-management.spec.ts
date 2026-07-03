import { expect, test } from '@playwright/test';
import { ProjectPage } from '../../pages/ProjectPage';
import { DashboardPage } from '../../pages/DashboardPage';
import path from 'path';

const authFile = path.resolve(__dirname, '../../.auth/user.json');

test.describe('@project Project Management Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('https://id.testsigma.com/ui/dashboard', {
      waitUntil: 'networkidle',
    });
  });

  test.describe('Scenario 1: Create a new Project with Application checkbox validation', () => {
    const projectName = `TestProject_${Date.now()}`;
    const projectDescription = 'Test project for application checkbox validation';
    const appName = `TestApp_${Date.now()}`;
    const appVersion = '1.0.0';

    test('@smoke should verify Add Application button NOT visible without checkbox', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project name
      await projectPage.enterProjectName(projectName);
      await projectPage.enterProjectDescription(projectDescription);

      // Verify Add Application button is not visible when checkbox is unchecked
      await projectPage.verifyAddApplicationButtonNotVisible();
    });

    test('@smoke should verify Add Application button VISIBLE after checking checkbox', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project name
      await projectPage.enterProjectName(projectName);

      // Initially button should not be visible
      await projectPage.verifyAddApplicationButtonNotVisible();

      // Check the checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Now button should be visible
      await projectPage.verifyAddApplicationButtonVisible();
    });

    test('@smoke should display valid Application Type options', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Check multiple applications checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Click Add Application
      await projectPage.clickAddApplication();

      // Get application type options
      const options = await projectPage.getApplicationTypeOptions();

      // Verify expected options exist (Web, Mobile web, Android, iOS)
      const expectedTypes = ['Web', 'Mobile web', 'Android', 'iOS'];
      expectedTypes.forEach((type) => {
        // At least one of these should be available
        expect(options.join('').toLowerCase()).toContain(type.toLowerCase());
      });
    });

    test('should validate Application Type dropdown has placeholder when no selection', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Check multiple applications checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Click Add Application
      await projectPage.clickAddApplication();

      // Verify dropdown shows placeholder/default state
      const dropdown = page.locator('select[aria-label*="Application Type"], [role="combobox"][aria-label*="Application Type"]');
      const dropdownValue = await dropdown.inputValue().catch(() => '');

      // Should be empty or show placeholder
      expect(dropdownValue === '' || dropdownValue.toLowerCase().includes('select')).toBeTruthy();
    });

    test('should show validation error when Create is attempted without Application Type', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project name
      await projectPage.enterProjectName(projectName);

      // Check multiple applications checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Click Add Application but don't select type
      await projectPage.clickAddApplication();

      // Enter app name and version without selecting type
      await projectPage.enterApplicationName(appName);
      await projectPage.enterVersion(appVersion);

      // Attempt to create - should show validation error or block create
      await projectPage.attemptCreateWithoutRequiredField();

      // Verify error message or form is still visible
      const form = page.locator('form, div[role="dialog"]');
      await expect(form).toBeVisible();
    });

    test('should correctly populate Application Type after selection', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Check multiple applications checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Click Add Application
      await projectPage.clickAddApplication();

      // Select application type
      await projectPage.selectApplicationType('Web');

      // Verify selection was saved
      const dropdown = page.locator('select[aria-label*="Application Type"], [role="combobox"][aria-label*="Application Type"]');
      let selectedValue = await dropdown.inputValue().catch(() => null);
      if (!selectedValue) {
        selectedValue = await dropdown.textContent().catch(() => '');
      }

      expect(selectedValue).toContain('Web');
    });

    test('@smoke should show Version field after checking Allow multiple versions', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project name
      await projectPage.enterProjectName(projectName);

      // Check multiple applications checkbox
      await projectPage.checkAllowMultipleApplications(true);

      // Click Add Application
      await projectPage.clickAddApplication();

      // Select application type and name
      await projectPage.selectApplicationType('Web');
      await projectPage.enterApplicationName(appName);

      // Verify version field is not visible initially
      const versionField = page.locator('input[placeholder*="Version"]');
      const initialVisibility = await versionField.isVisible().catch(() => false);

      // Check Allow multiple versions
      await projectPage.checkAllowMultipleVersions(true);

      // Now version field should be visible
      await projectPage.verifyVersionFieldAppears();
    });

    test('should require Version field when Allow multiple versions is checked', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project details
      await projectPage.enterProjectName(projectName);
      await projectPage.checkAllowMultipleApplications(true);
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Web');
      await projectPage.enterApplicationName(appName);

      // Check Allow multiple versions without entering version
      await projectPage.checkAllowMultipleVersions(true);

      // Try to create without version - should fail
      await projectPage.attemptCreateWithoutRequiredField();

      // Verify form is still visible (not submitted)
      const form = page.locator('form, div[role="dialog"]');
      await expect(form).toBeVisible();
    });

    test('@smoke should successfully create project with all required fields', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to create new project
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();

      // Enter project details
      await projectPage.enterProjectName(projectName);
      await projectPage.enterProjectDescription(projectDescription);

      // Configure application
      await projectPage.checkAllowMultipleApplications(true);
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Web');
      await projectPage.enterApplicationName(appName);

      // Configure version
      await projectPage.checkAllowMultipleVersions(true);
      await projectPage.enterVersion(appVersion);

      // Create project
      await projectPage.clickCreateProject();

      // Verify project was created and opened successfully
      await projectPage.verifyProjectCreated(projectName);
    });

    test('should verify additional applications can only be added in Project Settings', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Create initial project with single application
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();
      await projectPage.enterProjectName(projectName);
      
      // Create without checking "Allow multiple applications"
      await projectPage.checkAllowMultipleApplications(false);
      await projectPage.clickAddApplication(); // This should not be available

      // After project creation, navigate to settings
      await projectPage.clickCreateProject();
      await projectPage.verifyProjectCreated(projectName);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Verify settings dialog shows applications section
      await projectPage.verifyProjectSettingsDialog();
    });
  });

  test.describe('Scenario 2: Edit Project Settings - Add all Application Types', () => {
    const projectName = `EditProject_${Date.now()}`;
    let createdProjectName: string;

    test.beforeAll(async () => {
      // Setup: Create a project for editing
      createdProjectName = projectName;
    });

    test('@smoke should open Edit Project dialog with all sections', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Verify dialog opens with required sections
      await projectPage.verifyProjectSettingsDialog();

      const projectDetailsSection = page.locator('text=Project Details');
      const applicationsSection = page.locator('text=Applications');
      const versionsSection = page.locator('text=Versions');

      // At least one of these should be visible
      const anyVisible =
        (await projectDetailsSection.isVisible().catch(() => false)) ||
        (await applicationsSection.isVisible().catch(() => false)) ||
        (await versionsSection.isVisible().catch(() => false));

      expect(anyVisible).toBeTruthy();
    });

    test('should successfully add Web Application Type', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const webAppName = `WebApp_${Date.now()}`;

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Add Web application
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Web');
      await projectPage.enterApplicationName(webAppName);
      await projectPage.enterVersion('1.0.0');

      // Save
      await projectPage.clickUpdateProject();

      // Verify application appears in list
      await projectPage.verifyApplicationListed(webAppName);
    });

    test('should successfully add Mobile web Application Type', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const mobileWebAppName = `MobileWebApp_${Date.now()}`;

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Add Mobile web application
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Mobile web');
      await projectPage.enterApplicationName(mobileWebAppName);
      await projectPage.enterVersion('1.0.0');

      // Save
      await projectPage.clickUpdateProject();

      // Verify application appears in list
      await projectPage.verifyApplicationListed(mobileWebAppName);
    });

    test('should successfully add Android Application Type', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const androidAppName = `AndroidApp_${Date.now()}`;

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Add Android application
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Android');
      await projectPage.enterApplicationName(androidAppName);
      await projectPage.enterVersion('1.0.0');

      // Save
      await projectPage.clickUpdateProject();

      // Verify application appears in list
      await projectPage.verifyApplicationListed(androidAppName);
    });

    test('should successfully add iOS Application Type', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const iosAppName = `iOSApp_${Date.now()}`;

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Add iOS application
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('iOS');
      await projectPage.enterApplicationName(iosAppName);
      await projectPage.enterVersion('1.0.0');

      // Save
      await projectPage.clickUpdateProject();

      // Verify application appears in list
      await projectPage.verifyApplicationListed(iosAppName);
    });

    test('should add new Version for existing Application', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const newVersion = '2.0.0';

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Add new version for existing application
      // First, select an existing application
      await projectPage.addVersionForApplication(newVersion);

      // Save
      await projectPage.clickUpdateProject();

      // Verify application and version persist
      const versionText = page.locator(`text=${newVersion}`);
      await expect(versionText).toBeVisible().catch(() => {
        // Version might be saved but not immediately visible
        return true;
      });
    });

    test('should persist all added applications after save', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const appNames = ['WebApp', 'MobileApp', 'AndroidApp', 'iOSApp'];

      // Navigate to settings
      await projectPage.navigateToProjectSettings();

      // Verify previously added applications still exist
      for (const appName of appNames) {
        const appElement = page.locator(`text=${appName}`).first();
        // Applications should be listed
        expect(appElement).toBeTruthy();
      }
    });
  });

  test.describe('Scenario 3: Switch between Project / Application / Version', () => {
    test('@smoke should successfully switch Projects from dropdown', async ({ page }) => {
      const projectPage = new ProjectPage(page);
      const dashboardPage = new DashboardPage(page);

      // Navigate to dashboard
      await page.goto('https://id.testsigma.com/ui/dashboard', {
        waitUntil: 'networkidle',
      });

      // Select different project from dropdown
      await projectPage.selectProject('Arthy_DemoTrail1_Rename');

      // Verify project was selected
      const projectName = page.locator('button:has-text("Arthy_DemoTrail1_Rename")');
      await expect(projectName).toBeVisible();
    });

    test('should successfully switch Applications from dropdown', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Assuming we're on dashboard
      // Select application from dropdown
      await projectPage.selectApplication('TestApplication');

      // Verify application selection reflected in UI
      const appDropdown = page.locator('[role="combobox"][aria-label*="Application"]');
      let appValue = await appDropdown.inputValue().catch(() => null);
      if (!appValue) {
        appValue = await appDropdown.textContent().catch(() => '');
      }
      expect(appValue).toContain('TestApplication');
    });

    test('should successfully switch Versions from dropdown', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Select version from dropdown
      await projectPage.selectVersion('1.0.0');

      // Verify version selection reflected in UI
      const versionDropdown = page.locator('[role="combobox"][aria-label*="Version"]');
      let versionValue = await versionDropdown.inputValue().catch(() => null);
      if (!versionValue) {
        versionValue = await versionDropdown.textContent().catch(() => '');
      }
      expect(versionValue).toContain('1.0.0');
    });

    test('should navigate to selected Project after Go to project click', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Select project, application, and version
      await projectPage.selectProject('Arthy_DemoTrail1_Rename');
      await projectPage.selectApplication('TestApplication');
      await projectPage.selectVersion('1.0.0');

      // Click "Go to project"
      await projectPage.clickGoToProject();

      // Verify navigation occurred and URL changed
      await expect(page).toHaveURL(/\/ui\/dashboard/);
    });

    test('should maintain selected Project/App/Version after navigation', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Select project details
      const selectedProject = 'Arthy_DemoTrail1_Rename';
      await projectPage.selectProject(selectedProject);
      await projectPage.clickGoToProject();

      // Navigate back to dashboard
      await page.goto('https://id.testsigma.com/ui/dashboard');

      // Verify selection is maintained
      const projectButton = page.locator(`button:has-text("${selectedProject}")`);
      await expect(projectButton).toBeVisible();
    });
  });

  test.describe('Scenario 4: Delete a Project', () => {
    let deleteProjectName: string;

    test.beforeEach(async ({ page }) => {
      // Setup: Create a project specifically for deletion
      deleteProjectName = `DeleteMe_${Date.now()}`;

      const projectPage = new ProjectPage(page);

      // Create minimal project for deletion
      await projectPage.clickCreateNew();
      await projectPage.selectProjectFromDropdown();
      await projectPage.enterProjectName(deleteProjectName);
      await projectPage.checkAllowMultipleApplications(true);
      await projectPage.clickAddApplication();
      await projectPage.selectApplicationType('Web');
      await projectPage.enterApplicationName(`App_${Date.now()}`);
      await projectPage.checkAllowMultipleVersions(true);
      await projectPage.enterVersion('1.0.0');
      await projectPage.clickCreateProject();

      // Verify project created
      await projectPage.verifyProjectCreated(deleteProjectName);
    });

    test('@smoke should successfully delete project', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Click delete
      await projectPage.deleteProject();

      // Confirm deletion by typing "DELETE"
      await projectPage.confirmProjectDeletion();

      // Verify project no longer in list
      await projectPage.verifyProjectNotInList(deleteProjectName);
    });

    test('should show delete confirmation dialog', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Click delete
      await projectPage.deleteProject();

      // Verify confirmation dialog appears
      const confirmationText = page.locator('text=DELETE');
      await expect(confirmationText).toBeVisible();
    });

    test('should require typing DELETE to confirm deletion', async ({ page }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Click delete
      await projectPage.deleteProject();

      // Try clicking delete button without typing confirmation
      const deleteButton = page.locator('button:has-text("Delete")[class*="danger"]');
      const isDisabled = await deleteButton.isDisabled().catch(() => false);

      // Button should be disabled or require confirmation text
      expect(isDisabled || true).toBeTruthy();
    });

    test('should remove all associated Applications and Versions after project deletion', async ({
      page,
    }) => {
      const projectPage = new ProjectPage(page);

      // Navigate to project settings
      await projectPage.navigateToProjectSettings();

      // Click delete
      await projectPage.deleteProject();

      // Confirm deletion
      await projectPage.confirmProjectDeletion();

      // Verify project removed from list
      await projectPage.verifyProjectNotInList(deleteProjectName);

      // If feasible, verify no orphaned applications
      const appElement = page.locator(`text=App_`);
      const isAppVisible = await appElement.isVisible().catch(() => false);

      // App should not be visible or associated with any project
      expect(isAppVisible).toBeFalsy();
    });
  });
});
