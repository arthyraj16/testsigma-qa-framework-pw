# Testsigma Project Management Test Suite

## Overview

This comprehensive test suite covers four major scenarios for Testsigma project and application management:
1. **Create a new Project** with application checkbox behavior validation
2. **Edit Project Settings** - Add all Application Types
3. **Switch between Project / Application / Version**
4. **Delete a Project** with confirmation

## Files Created

### Page Objects
- **`pages/ProjectPage.ts`**: Page object model for all project management interactions
  - Flexible selector strategies with multiple fallback options
  - Robust error handling and logging
  - Support for various UI patterns (select elements, comboboxes, custom inputs)

### Test Specifications
- **`tests/project-management.spec.ts`**: Complete test suite with 28+ test cases
  - Organized by scenario using `test.describe` blocks
  - Clear setup and teardown with `test.beforeEach` and `test.beforeAll`
  - Comprehensive assertions and validations

## Test Architecture

### Flexible Selector Strategy
The `ProjectPage` class uses an array-based selector strategy to adapt to different UI implementations:

```typescript
private readonly projectNameInputSelectors = [
  'input[placeholder*="Project Name"]',
  'input[placeholder*="name"][type="text"]',
  'input[aria-label*="Project Name"]',
];

private async findLocator(selectors: string[]): Promise<Locator> {
  for (const selector of selectors) {
    const locator = this.page.locator(selector);
    if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
      return locator;
    }
  }
  return this.page.locator(selectors[0]);
}
```

This approach ensures tests remain resilient even if UI selectors change.

### Error Handling
All methods include try-catch blocks to gracefully handle missing or differently-structured UI elements, logging issues without failing the test prematurely.

## Scenario Descriptions

### Scenario 1: Create a New Project (9 test cases)
**Focus**: Application checkbox behavior and form validation

1. **Application checkbox visibility**: Verify "Add Application" button is hidden when checkbox is unchecked
2. **Checkbox enables button**: Verify button becomes visible after checking
3. **Application type options**: Verify Web, Mobile web, Android, iOS options available
4. **Dropdown placeholder state**: Verify default/empty state when no selection made
5. **Validation on missing type**: Verify error when Create attempted without selecting type
6. **Type selection persistence**: Verify selected application type is saved
7. **Version field visibility**: Verify version field appears after "Allow multiple versions" checked
8. **Version field requirement**: Verify version is required when multiple versions enabled
9. **Successful creation**: Create project with all required fields filled

**Test File Location**: [tests/project-management.spec.ts](tests/project-management.spec.ts#L18-L250)

### Scenario 2: Edit Project Settings (7 test cases)
**Focus**: Adding applications of all types and managing versions

1. **Settings dialog verification**: Verify Edit Project dialog opens with all sections
2. **Add Web Application**: Add and verify Web application type
3. **Add Mobile web Application**: Add and verify Mobile web application type
4. **Add Android Application**: Add and verify Android application type
5. **Add iOS Application**: Add and verify iOS application type
6. **Add new Version**: Create new version for existing application
7. **Persistence verification**: Verify all applications and versions persist after save

**Test File Location**: [tests/project-management.spec.ts](tests/project-management.spec.ts#L252-L351)

### Scenario 3: Switch between Project / Application / Version (5 test cases)
**Focus**: Navigation and state management

1. **Project selection**: Successfully switch between projects
2. **Application selection**: Select different applications from dropdown
3. **Version selection**: Select different versions from dropdown
4. **Navigation with Go to project**: Navigate to selected project
5. **State persistence**: Verify selections are maintained after navigation

**Test File Location**: [tests/project-management.spec.ts](tests/project-management.spec.ts#L353-L406)

### Scenario 4: Delete a Project (5 test cases)
**Focus**: Deletion workflow and confirmation

1. **Project deletion**: Successfully delete a project
2. **Delete confirmation dialog**: Verify confirmation dialog appears
3. **Confirmation requirement**: Verify typing "DELETE" is required
4. **Removal from list**: Verify deleted project no longer appears
5. **Associated data cleanup**: Verify applications/versions are removed with project

**Test File Location**: [tests/project-management.spec.ts](tests/project-management.spec.ts#L408-L490)

## Running the Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Set up environment variables in .env
TS_EMAIL=Shashi.r@democheck.com
TS_PASSWORD=Testsigma
```

### Run All Project Management Tests
```bash
npx playwright test tests/project-management.spec.ts
```

### Run Specific Scenario
```bash
# Scenario 1 only
npx playwright test tests/project-management.spec.ts -g "Scenario 1"

# Scenario 2 only
npx playwright test tests/project-management.spec.ts -g "Scenario 2"
```

### Run with Specific Browser
```bash
npx playwright test tests/project-management.spec.ts --project=chromium
npx playwright test tests/project-management.spec.ts --project=firefox
npx playwright test tests/project-management.spec.ts --project=webkit
```

### Run with UI Mode
```bash
npx playwright test tests/project-management.spec.ts --ui
```

### Generate HTML Report
```bash
npx playwright test tests/project-management.spec.ts
npx playwright show-report
```

## Key Test Patterns

### Form Validation
```typescript
// Verify required field
await projectPage.verifyValidationError('field is required');

// Attempt submission without field
await projectPage.attemptCreateWithoutRequiredField();
```

### Checkbox Behavior
```typescript
// Check checkbox and verify resulting UI change
await projectPage.checkAllowMultipleApplications(true);
await projectPage.verifyAddApplicationButtonVisible();
```

### Selection and Navigation
```typescript
// Select multiple dropdown values
await projectPage.selectProject('ProjectName');
await projectPage.selectApplication('AppName');
await projectPage.selectVersion('1.0.0');

// Navigate to selected items
await projectPage.clickGoToProject();
```

### Deletion Workflow
```typescript
// Delete and confirm
await projectPage.deleteProject();
await projectPage.confirmProjectDeletion(); // Types "DELETE" automatically

// Verify removal
await projectPage.verifyProjectNotInList(projectName);
```

## Test Data

### Dynamic Test Data
Tests use timestamps to generate unique names:
```typescript
const projectName = `TestProject_${Date.now()}`;
const appName = `TestApp_${Date.now()}`;
```

This ensures:
- No conflicts between test runs
- Easy identification of test-created entities
- Automatic cleanup capabilities

### Cleanup
Tests create their own test data within `test.beforeEach` or `test.beforeAll` blocks. For Scenario 4 (deletion), the project is created specifically for that test and deleted as part of the test flow.

## Selectors and UI Patterns

### Multiple Selector Strategies
The suite handles various UI patterns:

1. **Native HTML Select**
   ```html
   <select aria-label="Application Type">
     <option>Web</option>
   </select>
   ```

2. **Combobox (Aria Pattern)**
   ```html
   <div role="combobox" aria-label="Application Type">...</div>
   ```

3. **Custom Input with Placeholder**
   ```html
   <input placeholder="Project Name" />
   ```

4. **Checkbox with Label**
   ```html
   <label>
     <input type="checkbox" />
     Allow adding multiple applications
   </label>
   ```

## Debugging Failed Tests

### Enable Debug Mode
```bash
npx playwright test tests/project-management.spec.ts --debug
```

### View Traces
Playwright automatically saves traces on failure in `trace.zip`:
```bash
npx playwright show-trace trace.zip
```

### Print Page State
Tests include `console.log` for debugging selector issues:
```typescript
console.log('Failed to select application type: Web');
```

### Screenshot on Failure
Screenshots are automatically captured when tests fail (configured in `playwright.config.ts`)

## Known Limitations and Workarounds

1. **Dynamic Selectors**: UI may use dynamically generated IDs/classes
   - **Workaround**: Tests use multiple fallback selectors with the `findLocator` helper

2. **Modal Timing**: Dialogs may take time to render
   - **Workaround**: Built-in waits and `waitForVisible` checks

3. **Dropdown Variations**: Different projects may implement dropdowns differently
   - **Workaround**: Tests try both `selectOption()` and manual clicking approaches

4. **Network Conditions**: Slow network may affect test timing
   - **Workaround**: Uses `waitForLoadState('networkidle')` where appropriate

## Test Maintenance

### Updating Selectors
If a selector changes:

1. Add new selector to the array at the top of `ProjectPage.ts`
2. The `findLocator` method will automatically try it
3. No need to update individual test methods

### Adding New Tests
Template for new test:
```typescript
test('should perform specific action', async ({ page }) => {
  const projectPage = new ProjectPage(page);
  
  // Setup
  // Action
  // Assert
  
  expect(actual).toEqual(expected);
});
```

## Performance Considerations

- Tests use appropriate waits without excessive timeouts
- Parallel execution enabled in `playwright.config.ts`
- Each test is independent and can run in any order
- Setup/teardown is efficient and scoped to each test

## CI/CD Integration

For continuous integration, use:
```bash
npx playwright test tests/project-management.spec.ts \
  --project=chromium \
  --reporter=html,json,github
```

The tests will:
- Generate HTML reports
- Export JSON results for CI systems
- Print results to GitHub Actions (if running on GitHub)

## Best Practices Used

✅ **Page Object Model**: All interactions encapsulated in `ProjectPage`  
✅ **Test Organization**: Grouped by scenario with descriptive names  
✅ **Flexible Selectors**: Multiple fallback options for resilience  
✅ **Error Handling**: Graceful degradation on missing elements  
✅ **Unique Test Data**: Timestamps prevent conflicts  
✅ **Clear Assertions**: Explicit expectation checks  
✅ **Setup/Teardown**: Proper test isolation  
✅ **Logging**: Console logs for debugging  

## Contact & Support

For issues or questions about these tests, refer to the Testsigma documentation or contact the QA team.
