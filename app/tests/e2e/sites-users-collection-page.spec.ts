import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Sites/Users basic workflow succeed', async ({ page }) => {
    await page.goto('#/')
    await page.getByTestId('app-bar-nav-icon').click()
    await page.getByTestId('app-nav-drawer-li-admin').getByText('Admin').click()
    await page.getByTestId('app-nav-drawer-li-sites-users-privileges').click()
    await page.getByTestId('app-data-card-toolbar').getByRole('link').click()
    await page.getByLabel('site', { exact: true }).click()
    await page.getByText('ED', { exact: true }).click()
    await page.getByLabel('user', { exact: true }).click()
    await page.getByText('user_base@example.com').click()
    await page.getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'ED Ed-Dur' }).click()
    await page.getByLabel('site', { exact: true }).click()
    await page.getByLabel('site', { exact: true }).fill('')
    await page.getByRole('option', { name: /ALA/ }).click()
    await page.getByLabel('ROLE_SITE_USER').check()
    await page.getByTestId('app-data-card-toolbar').getByRole('button').click()
    await page
      .getByRole('row', { name: 'ALA user_base@example.com' })
      .getByRole('link')
      .nth(1)
      .click()
    await page.getByLabel('ROLE_SITE_EDITOR').uncheck()
    await page.getByTestId('app-data-card-toolbar').getByRole('button').click()
    await page
      .getByRole('row', { name: 'ALA user_base@example.com' })
      .getByTestId('auth-user-button')
      .hover()
    await expect(
      page.getByRole('tooltip', { name: 'ROLE_SITE_USER' }),
    ).toHaveCount(1)
    await page
      .getByRole('row', { name: 'ALA user_base@example.com' })
      .getByRole('link')
      .first()
      .click()
    await expect(page.getByTestId('app-data-card-toolbar')).toHaveText(
      /[0-9a-f\-]{36}/,
    )
    await page.getByTestId('delete-item-button').click()
    await page.getByTestId('app-data-card-toolbar').getByRole('button').click()
    await expect(page.getByTestId('app-data-card-toolbar')).not.toHaveText(
      /[0-9a-f\-]{36}/,
    )
    await expect(
      page.getByRole('row', { name: 'ALA user_base@example.com' }),
    ).toHaveCount(0)
  })
})
