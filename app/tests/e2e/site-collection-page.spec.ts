import { test, expect } from '@playwright/test'
import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { loadFixtures } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SiteCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel.tableNotHasHeader('public')
    await collectionPageObjectModel.tableCellHasText('ED', 'Ed-Dur')
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('read-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('update-item-button'),
    ).not.toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('delete-item-button'),
    ).not.toBeEnabled()
    await collectionPageObjectModel.expectClickHeaderSendOrderCollectionRequest(
      'code',
      '**/sites*',
    )
  })
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SiteCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
  })
})

test.describe('Editor user', () => {
  test.use({ storageState: 'playwright/.auth/editor.json' })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SiteCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SiteCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel.tableHasHeader('public')
    await collectionPageObjectModel.tableCellHasText('ED', 'Ed-Dur')
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('read-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('update-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('ED')
        .getByTestId('delete-item-button'),
    ).toBeEnabled()
  })
})
