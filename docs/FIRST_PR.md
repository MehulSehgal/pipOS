# 🚀 First PR in 10 Minutes: A Beginner's Guide to Contributing to Pip OS

Welcome to **Pip OS**! Whether you are participating in **IEEE IGDTUW Open Source Week 10.0** or making your very first open-source contribution, this guide will walk you through from zero to a merged Pull Request in under 10 minutes.

---

## 🌟 The Pip OS Philosophy: Zero Build, Zero Hassle

- **No `npm install`**. No Webpack, Vite, or Babel.
- **Pure Web Standards**: Vanilla HTML5, modern CSS3, and ES6+ JavaScript.
- Everything runs immediately in your browser.

---

## Step 1: Fork and Clone the Repository (2 minutes)

1. Navigate to the main repository: [https://github.com/Tech4Aditya/pipOS](https://github.com/Tech4Aditya/pipOS)
2. Click the **Fork** button (top-right) to create your personal copy.
3. Open your terminal or shell and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/pipOS.git
   cd pipOS
   ```
4. Set up the `upstream` remote so you can always sync with the latest project updates:
   ```bash
   git remote add upstream https://github.com/Tech4Aditya/pipOS.git
   git fetch upstream
   ```

---

## Step 2: Run Pip OS Locally (1 minute)

Pip OS runs anywhere with any standard local HTTP server:

```bash
# Using Python 3:
python3 -m http.server 8000

# Or on Windows:
python -m http.server 8000

# Or using Node (built-in npx):
npx serve .
```

Open your browser and visit: **`http://localhost:8000`**  
You should see Pip blinking, music playing, and toys ready on the nursery workbench!

---

## Step 3: Create a Dedicated Feature Branch (1 minute)

Never commit directly to `main`. Always branch fresh from `upstream/main`:

```bash
git checkout -b fix/my-first-contribution upstream/main
```

---

## Step 4: Make a Small, High-Quality Change (3 minutes)

For your first contribution, find a good first issue on GitHub or make a small improvement such as:
- Updating a typo or micro-copy in `index.html` (e.g. resident story under the Delivery Route).
- Adding a seed wish in `js/wall.js`.
- Fixing an accessibility attribute or contrast issue in `css/style.css`.

Example: Open `index.html` and tweak a caption or title.

---

## Step 5: Run the Built-In Test Suite (1 minute)

Pip OS uses Node.js's built-in native test runner (`node:test`) requiring zero external test libraries:

```bash
node --test
```

Verify that all tests pass (`✔`) and that the browser DevTools console has **0 errors**.

---

## Step 6: Commit and Open Your Pull Request (2 minutes)

1. Check your changed files:
   ```bash
   git status
   git diff
   ```

2. Stage and commit your changes using Conventional Commits:
   ```bash
   git add <modified-files>
   git commit -m "docs(guide): clarify local server commands in FIRST_PR.md"
   ```

3. Push your branch to your GitHub fork:
   ```bash
   git push -u origin fix/my-first-contribution
   ```

4. Go to your fork on GitHub or use the GitHub CLI to open your Pull Request:
   ```bash
   gh pr create --repo Tech4Aditya/pipOS --base main --title "docs(guide): clarify local server commands" --body "Closes #<issue-number>"
   ```

---

## 🎯 PR Review Checklist

Before submitting, double-check:
- [x] Branch is created from `upstream/main`.
- [x] All unit tests pass (`node --test`).
- [x] Browser console has zero errors.
- [x] Zero package dependencies added to the root directory.
- [x] PR description references the related issue number (`Closes #123`).

Congratulations on your contribution to Pip OS! 🌙
