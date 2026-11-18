const { test, expect } = require('@playwright/test');

test.describe('Pip OS Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations for deterministic pixel-perfect snapshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('Homepage full screenshot across device viewports and themes', async ({ page }, testInfo) => {
    await page.goto('/');

    // Wait for fonts and main SVG to be fully rendered
    await page.waitForSelector('#pipSvg');
    await page.waitForLoadState('networkidle');

    // If night project, toggle or verify dark theme
    if (testInfo.project.name === 'desktop-night') {
      const isNight = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'night');
      if (!isNight) {
        await page.click('#themeBtn');
      }
    }

    // Verify taskbar and hero are visible
    await expect(page.locator('.taskbar')).toBeVisible();
    await expect(page.locator('#hello')).toBeVisible();

    // Visual screenshot match
    await expect(page).toHaveScreenshot(`homepage-${testInfo.project.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05
    });
  });

  test('Hero section and Pip illustration snapshot', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForSelector('#pipSvg');

    const hero = page.locator('#hello');
    await expect(hero).toHaveScreenshot(`hero-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Work section with playable workbench toys', async ({ page }, testInfo) => {
    await page.goto('/#work');
    await page.waitForSelector('#work');

    const workSection = page.locator('#work');
    await expect(workSection).toHaveScreenshot(`work-section-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Bedtime storybook window snapshot', async ({ page }, testInfo) => {
    await page.goto('/#story');
    await page.waitForSelector('#story');

    const storySection = page.locator('#story');
    await expect(storySection).toHaveScreenshot(`storybook-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.05
    });
  });
});
