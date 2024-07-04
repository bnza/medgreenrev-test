import { test } from '@playwright/test'

import { SiteItemReadPage } from '@lib/poms/site-item-read-page'
import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { loadFixtures } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Site item form succeed', async ({ page }) => {
    const siteItemReadPage = new SiteItemReadPage(page)
    await siteItemReadPage.navigateFromCollectionPage('ED')
    await siteItemReadPage.formHasExpectedTitle(/Site\sED/)
    await siteItemReadPage.formHasExpectedInput('code')
    await siteItemReadPage.formHasExpectedInput('name')
    await siteItemReadPage.formHasExpectedInput('description')
    await siteItemReadPage.formInputIsReadonly('code')
    await siteItemReadPage.formInputIsReadonly('name')
    await siteItemReadPage.formInputIsReadonly('description')
  })
  test('Site item resource not found', async ({ page }) => {
    const siteItemReadPage = new SiteItemReadPage(page)
    await siteItemReadPage.goto(0)
    await siteItemReadPage.pageHasEmptyItem()
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Delete item', async ({ page }) => {
    const siteItemReadPage = new SiteItemReadPage(page)
    await siteItemReadPage.navigateFromCollectionPage('SAH', 'DELETE')
    await expect(
      siteItemReadPage.page.getByTestId('delete-item-alert-row'),
    ).toHaveCount(1)
    const _url = siteItemReadPage.page.url()
    await siteItemReadPage.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await page.goto(_url)
    await siteItemReadPage.pageHasEmptyItem()
  })
  test('Update item', async ({ page }) => {
    const siteItemReadPage = new SiteItemReadPage(page)
    await siteItemReadPage.navigateFromCollectionPage('ED', 'EDIT')
    await siteItemReadPage.page.getByLabel('name').fill('A nice old city')
    await siteItemReadPage.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      siteItemReadPage.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Site/),
    ).not.toHaveText('delete')
    await expect(siteItemReadPage.page.getByLabel('name')).toHaveValue(
      'A nice old city',
    )
  })
  test('Create item', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await siteCollectionPage.getCreateLink.click()
    const siteItemReadPage = new SiteItemReadPage(page)
    await siteItemReadPage.page.getByLabel('code').fill('ED')
    await expect(siteItemReadPage.page.getByText('Duplicate code')).toHaveCount(
      1,
    )
    await siteItemReadPage.page.getByLabel('code').press('Backspace')
    await siteItemReadPage.page.getByLabel('code').press('Backspace')
    await expect(
      siteItemReadPage.page.getByText('This field is required'),
    ).toHaveCount(1)
    await siteItemReadPage.page.getByLabel('code').fill('AA')
    await siteItemReadPage.page.getByLabel('name').fill('A new site')
    await siteItemReadPage.page
      .getByLabel('description')
      .fill('Description of the site')
    await siteItemReadPage.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      siteItemReadPage.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Site/),
    ).not.toHaveText('create')
    await expect(siteItemReadPage.page.getByLabel('code')).toHaveValue('AA')
    await expect(siteItemReadPage.page.getByLabel('name')).toHaveValue(
      'A new site',
    )
    await expect(siteItemReadPage.page.getByLabel('description')).toHaveValue(
      'Description of the site',
    )
  })
})
