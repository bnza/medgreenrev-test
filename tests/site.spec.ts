import {test, expect, APIResponse,} from '@playwright/test';
import { apiUrl, loadFixtures} from "../lib/common/api";

test.beforeEach(async () => {
  loadFixtures();
})

test('Unauthenticated GET Collection', async ({ request }) => {
  const response: APIResponse = await request.get(
      `${apiUrl}/sites`
  );
  expect(response.ok()).toBeTruthy();
});

/*test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});*/
