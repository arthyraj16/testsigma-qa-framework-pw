# Quick Start Guide - Testsigma Project Management Tests

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd /Users/arthy.mohanraj/Documents/prep/TSM_PWMCP
npm install
```

### 2. Configure Environment
Ensure your `.env` file contains:
```
TS_EMAIL=Shashi.r@democheck.com
TS_PASSWORD=Testsigma
```

### 3. Run Tests

#### Run All Tests
```bash
npx playwright test tests/project-management.spec.ts
```

#### Run Specific Scenario
```bash
# Create Project Scenario
npx playwright test tests/project-management.spec.ts -g "Scenario 1"

# Edit Project Settings Scenario  
npx playwright test tests/project-management.spec.ts -g "Scenario 2"

# Switch Project/App/Version Scenario
npx playwright test tests/project-management.spec.ts -g "Scenario 3"

# Delete Project Scenario
npx playwright test tests/project-management.spec.ts -g "Scenario 4"
```

#### Run with Debug Mode
```bash
npx playwright test tests/project-management.spec.ts --debug
```

#### Run with UI Mode (Interactive)
```bash
npx playwright test tests/project-management.spec.ts --ui
```

#### Generate and View Reports
```bash
npx playwright test tests/project-management.spec.ts
npx playwright show-report
```

## 📋 Test Summary

| Scenario | Tests | Focus | File |
|----------|-------|-------|------|
| 1 | 9 | Create Project with Application checkbox validation | Line 18-250 |
| 2 | 7 | Add all Application Types in Settings | Line 252-351 |
| 3 | 5 | Switch Projects/Applications/Versions | Line 353-406 |
| 4 | 5 | Delete Project with confirmation | Line 408-490 |
| **TOTAL** | **26** | Complete project lifecycle | - |

## 🎯 Test Scenarios Covered

### Scenario 1: Create a New Project ✨
- [x] Application checkbox button visibility control
- [x] Application Type dropdown options validation
- [x] Placeholder/default state verification
- [x] Validation on missing fields
- [x] Application Type selection persistence
- [x] Version field conditional display
- [x] Version requirement validation
- [x] Successful project creation
- [x] Single vs. multiple applications restriction

### Scenario 2: Edit Project Settings 🔧
- [x] Project Settings dialog opening
- [x] Add Web application
- [x] Add Mobile web application
- [x] Add Android application
- [x] Add iOS application
- [x] Add new versions
- [x] Data persistence after save

### Scenario 3: Switch Projects/Apps/Versions 🔄
- [x] Project selection from dropdown
- [x] Application selection from dropdown
- [x] Version selection from dropdown
- [x] Navigate using "Go to project" button
- [x] Selection state maintenance

### Scenario 4: Delete Project 🗑️
- [x] Project deletion workflow
- [x] Delete confirmation dialog
- [x] Confirmation text requirement ("DELETE")
- [x] Project removal from list
- [x] Associated data cleanup

## 📊 Key Features

### Smart Selector Strategy
Tests use flexible selectors that adapt to UI changes:
- Multiple fallback selector options
- Automatic retry logic
- Graceful error handling

### Dynamic Test Data
- Unique names using timestamps (e.g., `ProjectName_1719216000000`)
- No conflicts between test runs
- Self-contained test isolation

### Comprehensive Validations
- UI element visibility checks
- Form validation verification
- Navigation confirmation
- Data persistence validation

## 🐛 Troubleshooting

### Tests fail with "Element not found"
**Solution**: The selector might have changed. Check the actual HTML and update the selector array in `ProjectPage.ts`.

### Tests timeout
**Solution**: Increase the wait timeout or check if the Testsigma server is responsive.

### Authentication fails
**Solution**: Verify credentials in `.env` file match your Testsigma account.

### Flaky tests
**Solution**: Tests include error handling. If still flaky, add explicit waits using:
```typescript
await page.waitForTimeout(1000);
```

## 📁 File Structure

```
TSM_PWMCP/
├── pages/
│   ├── ProjectPage.ts           ← Project management page object
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
├── tests/
│   ├── project-management.spec.ts ← Main test suite (26 tests)
│   ├── login.spec.ts
│   └── ...other tests
├── PROJECT_MANAGEMENT_TESTS.md   ← Detailed documentation
└── QUICK_START.md               ← This file
```

## 🔍 Test Execution Flow

### Before Each Test
1. Load authentication if available
2. Navigate to dashboard
3. Wait for page load

### Test Execution
1. Create unique test data
2. Perform actions
3. Validate outcomes

### After Test
- Automatic screenshot on failure
- HTML report generation
- Trace recording

## 📈 CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
- name: Run Testsigma Project Management Tests
  run: |
    npx playwright test tests/project-management.spec.ts \
      --project=chromium \
      --reporter=html,json
      
- name: Upload Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 💡 Pro Tips

1. **Debug Specific Test**: Use `test.only()` to run single test
2. **Skip Test**: Use `test.skip()` to skip temporarily
3. **Headed Mode**: See what tests are doing
   ```bash
   npx playwright test --headed
   ```
4. **Slow Down**: Useful for debugging
   ```bash
   npx playwright test --headed --no-deps --timeout=0
   ```

## 🎓 Learn More

- Full documentation: [PROJECT_MANAGEMENT_TESTS.md](PROJECT_MANAGEMENT_TESTS.md)
- Playwright docs: https://playwright.dev
- Testsigma docs: https://testsigma.com/docs

## ✅ Pre-flight Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env` file)
- [ ] Connected to internet
- [ ] Testsigma account credentials valid
- [ ] Playwright browsers installed

---

**Ready to test?** Run: `npx playwright test tests/project-management.spec.ts`
