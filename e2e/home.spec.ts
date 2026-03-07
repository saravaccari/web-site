import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page and have the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Moto Travel Trentino/);
  });

  test('should navigate to Chi Siamo page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Chi Siamo');
    await expect(page).toHaveURL(/\/chi-siamo.html/);
    await expect(page.locator('h2').first()).toContainText(/Visione/);
  });
});
