import { test, expect } from '@playwright/test';

test.describe('Navlog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Flight Log' }).click();
        await expect(page.locator('app-navlog')).toBeVisible();
    });

    test('should add row', async ({ page }) => {
        const initialRows = await page.getByPlaceholder('IDENT').count();
        // Add button might need to be more specific if multiple buttons exist
        await page.locator('button.bg-flight-blue.rounded-full').click();

        await expect(page.getByPlaceholder('IDENT')).toHaveCount(initialRows + 1);
    });

    test('should calculate fuel', async ({ page }) => {
        // Find inputs in the first row
        const firstRowWaypoint = page.getByPlaceholder('IDENT').first();
        await expect(firstRowWaypoint).toBeVisible();

        // Fill data to trigger calculation
        // Need to find inputs by name or sequence in the first row block
        // The rows are generated with ID.
        // We can just fill the first visible inputs.

        await page.locator('input[name^="distance-"]').first().fill('100');
        await page.locator('input[name^="tas-"]').first().fill('120');
        await page.locator('input[name^="gph-"]').first().fill('10');

        // Check calculation
        // Total fuel or row fuel
        // Row fuel is in a span. "Fuel Req" -> value
        // span containing fuel value.
        // The fuel value is in a span like: <span class="block text-lg ...">{{ row.fuel }}</span>
        // We can verify the total fuel in the top bar or the row fuel.

        // Let's verify row fuel.
        // It's hard to target specific row text without specific test ids.
        // But we can check if a text appearing matches expected calculation.
        // 100nm / 120kt = 0.833 hr. * 10gph = 8.3 gal.

        await expect(page.getByText('8.3').first()).toBeVisible();
    });
});
