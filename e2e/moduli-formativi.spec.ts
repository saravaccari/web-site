import { test, expect } from '@playwright/test';

test.describe('Moduli Formativi Page', () => {
  test('should load the moduli formativi page', async ({ page }) => {
    await page.goto('/moduli-formativi.html');
    await expect(page).toHaveTitle(/Moduli Formativi/);
    await expect(page.locator('h1').first()).toContainText('Moduli Formativi Presidenti');
  });

  test('should navigate between modules', async ({ page }) => {
    await page.goto('/moduli-formativi.html');
    
    // Check initial module
    await expect(page.locator('h1').nth(1)).toContainText('Responsabilità Legale');
    
    // Click second module in sidebar
    await page.click('text=Modulo 2');
    
    // Check if content changed
    await expect(page.locator('h1').nth(1)).toContainText('Fiscalità e Finanza');
  });

  test('should track progress and show certificate', async ({ page }) => {
    await page.goto('/moduli-formativi.html');
    
    // Mark Module 1 as complete
    await page.click('text=Segna come Completato');
    await expect(page.locator('text=Completato').first()).toBeVisible();
    
    // Go to Module 2 and mark as complete
    await page.click('text=Modulo 2');
    await page.click('text=Segna come Completato');
    
    // Go to Module 3 and mark as complete
    await page.click('text=Modulo 3');
    await page.click('text=Segna come Completato');
    
    // Check if progress is 100%
    await expect(page.locator('text=100%')).toBeVisible();
    
    // Click "Ottieni il Certificato"
    await page.click('text=Ottieni il Certificato');
    
    // Check if certificate is shown
    await expect(page.locator('h1').first()).toContainText('Certificato di Eccellenza');
  });
});
