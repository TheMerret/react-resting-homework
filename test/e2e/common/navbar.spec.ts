import { test, expect } from '@playwright/test';

test('if screen is wide navbar shows links', async ({ page }) => {
  page.setViewportSize({ width: 1200, height: 644 });
  await page.goto('./');
  const navbar = page.locator('nav');
  await expect(navbar).toHaveScreenshot();
});

test('if screen is small navbar shows links under collapse', async ({
  page,
}) => {
  page.setViewportSize({ width: 575, height: 644 });
  await page.goto('./');
  await page.locator('button.navbar-toggler').click();
  const navbar = page.locator('nav');
  await expect(navbar).toHaveScreenshot();
});

test('after choosing from collapse menu is closed', async ({ page }) => {
  page.setViewportSize({ width: 575, height: 644 });
  await page.goto('./');
  await page.locator('button.navbar-toggler').click();
  await page.locator('a.nav-link').first().click();
  const navbar = page.locator('nav');
  await expect(navbar).toHaveScreenshot();
});
