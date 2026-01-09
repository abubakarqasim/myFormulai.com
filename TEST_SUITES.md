# Test Suites Documentation

## Overview

The test automation framework is organized into three main test suites:

1. **Sanity Suite** - Critical path validation
2. **Smoke Suite** - Core functionality checks
3. **Regression Suite** - Complete test coverage

## Test Suite Definitions

### 🚀 Sanity Suite (`@sanity`)

**Purpose**: Quick validation of critical user flows  
**Duration**: ~5-10 minutes  
**When to run**: After every deployment, before major releases

**Tests Included**:
- ✅ Homepage loading and navigation
- ✅ User login functionality
- ✅ Basic shopping flow (browse → product → add to cart)

**Run Command**:
```bash
npm run test:sanity
```

### 💨 Smoke Suite (`@smoke`)

**Purpose**: Core functionality verification  
**Duration**: ~15-20 minutes  
**When to run**: Daily builds, pre-merge validation

**Tests Included**:
- ✅ All Sanity tests
- ✅ User registration
- ✅ Product search functionality

**Run Command**:
```bash
npm run test:smoke
```

### 🔄 Regression Suite (`@regression`)

**Purpose**: Complete test coverage  
**Duration**: ~60-90 minutes  
**When to run**: Nightly builds, pre-release, major changes

**Tests Included**:
- ✅ All Smoke tests
- ✅ Complete quiz flow
- ✅ Payment gateway tests
- ✅ AI recommendations
- ✅ Performance tests

**Run Command**:
```bash
npm run test:regression
```

## Test Organization

### Test Tags

Tests are tagged using Playwright's tag system:

- `@sanity` - Critical path tests
- `@smoke` - Core functionality tests
- `@regression` - All tests

### Test Distribution

| Test File | Sanity | Smoke | Regression |
|-----------|--------|-------|------------|
| homepage.spec.ts | ✅ | ✅ | ✅ |
| login.spec.ts | ✅ | ✅ | ✅ |
| shop.spec.ts | ✅ | ✅ | ✅ |
| register.spec.ts | ❌ | ✅ | ✅ |
| product-search.spec.ts | ❌ | ✅ | ✅ |
| startQuiz.spec.ts | ❌ | ❌ | ✅ |
| payment-gateway.spec.ts | ❌ | ❌ | ✅ |
| recommendations.spec.ts | ❌ | ❌ | ✅ |
| page-load.spec.ts | ❌ | ❌ | ✅ |

## Running Test Suites

### Local Execution

```bash
# Sanity suite (Chrome only)
npm run test:sanity

# Smoke suite (Chrome only)
npm run test:smoke

# Regression suite (Chrome only)
npm run test:regression

# Run on all browsers
npm run test:sanity:all
npm run test:smoke:all
npm run test:regression:all
```

### CI/CD Execution

Test suites run automatically in GitHub Actions:

1. **On Push to Master**:
   - Sanity suite runs first (fast feedback)
   - Smoke suite runs in parallel
   - Regression suite runs after smoke passes

2. **Manual Trigger**:
   - Can run individual suites via workflow dispatch
   - Can specify environment (local/dev/staging/prod)

## Best Practices

1. **Tag New Tests**: Always tag new tests with appropriate suite tags
2. **Keep Sanity Fast**: Sanity tests should complete in < 10 minutes
3. **Maintain Balance**: Ensure each suite has appropriate coverage
4. **Update Tags**: Review and update tags when test importance changes

## Adding Tests to Suites

To add a test to a suite, use the tag in the test describe block:

```typescript
// Add to Sanity suite
test.describe('My Test', { tag: ['@sanity'] }, () => {
  // test code
});

// Add to multiple suites
test.describe('My Test', { tag: ['@sanity', '@smoke', '@regression'] }, () => {
  // test code
});
```
