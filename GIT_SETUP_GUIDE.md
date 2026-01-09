# Git Setup Guide - Fixing Commit Issues

## Why Commits Are Blocked

The most common reason commits are blocked is because **Git is not initialized** in your project directory.

## Solution: Initialize Git Repository

### Step 1: Check if Git is Installed

Open PowerShell or Command Prompt and run:
```bash
git --version
```

If Git is not installed, download it from: https://git-scm.com/download/win

### Step 2: Initialize Git Repository

Navigate to your project directory and run:
```bash
cd E:\MyFormulai
git init
```

### Step 3: Configure Git (First Time Only)

Set your name and email:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Or set globally:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Add Files to Git

```bash
# Add all files
git add .

# Or add specific files
git add package.json
git add playwright.config.js
git add tests/
```

### Step 5: Make Your First Commit

```bash
git commit -m "Initial commit: Playwright automation framework"
```

## Verify Everything Works

Check git status:
```bash
git status
```

You should see your files listed and be able to commit them.

## Common Issues and Solutions

### Issue 1: "Not a git repository"
**Solution:** Run `git init` in your project directory

### Issue 2: "Nothing to commit"
**Solution:** Make sure you've run `git add .` to stage files

### Issue 3: Files are ignored
**Solution:** Check `.gitignore` - some files are intentionally ignored (like `node_modules/`)

### Issue 4: VS Code Git Extension Issues
**Solution:** 
- Reload VS Code window: `Ctrl+Shift+P` → "Reload Window"
- Check VS Code Git settings
- Try using command line instead

## Files That Should Be Committed

✅ **DO Commit:**
- `package.json`
- `playwright.config.js`
- `README.md`
- `tests/` folder (all test files)
- `.gitignore`
- `playwright.config.js`

❌ **DON'T Commit (already in .gitignore):**
- `node_modules/`
- `test-results/`
- `playwright-report/`
- `.env` files

## Quick Setup Commands

Copy and paste these commands in order:

```bash
# Navigate to project
cd E:\MyFormulai

# Initialize git
git init

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Playwright automation framework"

# Check status
git status
```

## After Setup

Once Git is initialized, you can:
- Commit changes: `git commit -m "Your message"`
- Check status: `git status`
- View history: `git log`
- Create branches: `git branch feature-name`

---

**Note:** If you're using VS Code, after running `git init`, you may need to reload the window for the Git extension to recognize the repository.
