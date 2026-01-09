# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing.

## Workflows

### 1. `ci.yml` - Continuous Integration
**Triggers:** Push, Pull Request, Manual Dispatch

**Features:**
- Runs tests on multiple browsers (Chromium, Firefox, WebKit)
- Tests on multiple OS (Ubuntu, Windows)
- Generates Allure reports
- Uploads test artifacts
- Matrix strategy for parallel execution

**Usage:**
```bash
# Automatic on push/PR
# Manual: GitHub Actions → CI - Test Automation → Run workflow
```

### 2. `newman.yml` - API Tests (Newman)
**Triggers:** Push, Pull Request, Manual Dispatch

**Features:**
- Runs Postman collections via Newman
- Supports custom collections and environments
- Generates HTML reports

**Usage:**
```bash
# Manual: GitHub Actions → API Tests - Newman → Run workflow
# Specify collection and environment in inputs
```

### 3. `nightly.yml` - Nightly Test Suite
**Triggers:** Scheduled (2 AM UTC daily), Manual Dispatch

**Features:**
- Full test suite execution
- Extended artifact retention
- PR comments with results

**Usage:**
```bash
# Automatic: Runs daily at 2 AM UTC
# Manual: GitHub Actions → Nightly Test Suite → Run workflow
```

### 4. `release.yml` - Production Tests
**Triggers:** Release creation, Manual Dispatch

**Features:**
- Production environment testing
- Long-term artifact retention (365 days)
- Version-tagged artifacts

**Usage:**
```bash
# Automatic: On release creation
# Manual: GitHub Actions → Release - Production Tests → Run workflow
```

## Artifacts

All workflows upload:
- Test results (screenshots, videos, traces)
- Allure reports
- API call captures
- MCP context files
- User data (if applicable)

## Environment Variables

Set in GitHub Secrets:
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `ENV` - Environment (local/dev/staging/prod)

## Status Badges

Add to README.md:
```markdown
![CI](https://github.com/your-org/your-repo/workflows/CI%20-%20Test%20Automation/badge.svg)
```
