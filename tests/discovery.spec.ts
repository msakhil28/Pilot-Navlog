import { test, expect } from '@playwright/test';

test.describe('Discovery', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Discovery' }).click();
    });

    test('should show search input', async ({ page }) => {
        await expect(page.getByPlaceholder('ICAO')).toBeVisible();
    });

    test('should handle search', async ({ page }) => {
        // Mock API? Or just check button state
        await expect(page.getByText('Find Destinations')).toBeVisible();
    });
});
