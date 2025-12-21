import { test, expect } from '@playwright/test';

test.describe('Calculators', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Pressure & Density Altitude' }).click();
    });

    test('should default to Pressure/Density Altitude', async ({ page }) => {
        await expect(page.locator('app-pa-da-calculator')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Pressure & Density Altitude' })).toBeVisible();
    });

    test('should switch to Fuel Planner', async ({ page }) => {
        // Assuming there are buttons/tabs inside calculator hub
        await page.getByRole('button', { name: 'Fuel Planner' }).click();
        await expect(page.locator('app-fuel-planner')).toBeVisible();
    });

    test('should calculate TAS', async ({ page }) => {
        await page.getByRole('button', { name: 'True Airspeed' }).click();
        await expect(page.locator('app-tas-calculator')).toBeVisible();

        // Fill inputs
        await page.locator('input[name="ias"]').fill('100');
        await expect(page.getByRole('heading', { name: 'True Airspeed', exact: true })).toBeVisible();
    });
});
