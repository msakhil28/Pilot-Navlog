import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load landing page', async ({ page }) => {
        await expect(page).toHaveTitle(/Pilot Navlog/); // Check exact title if known
        await expect(page.locator('app-landing-page')).toBeVisible();
    });

    test('should navigate to calculators', async ({ page }) => {
        // Desktop sidebar has individual calculator buttons. Click one.
        await page.getByRole('button', { name: 'Fuel Planner' }).click();
        await expect(page.locator('app-calculators-hub')).toBeVisible();
    });

    test('should navigate to navlog', async ({ page }) => {
        await page.getByRole('button', { name: 'Flight Log' }).click();
        await expect(page.locator('app-navlog')).toBeVisible();
    });

    test('should navigate to discovery', async ({ page }) => {
        await page.getByRole('button', { name: 'Discovery' }).click();
        await expect(page.locator('app-discovery-hub')).toBeVisible();
    });
});
