import { test, expect } from '@playwright/test'
import { loadFixtures } from '@lib/common/api'
import { SampleCollectionPage } from '@lib/poms/sample-collection-page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Samples list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SampleCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    let row = collectionPageObjectModel.getTableRowBySampleId('AN.2024.1001.2')
    await expect(row.getByTestId('read-item-button')).toBeEnabled()
    await expect(row.getByTestId('update-item-button')).not.toBeEnabled()
    await expect(row.getByTestId('delete-item-button')).not.toBeEnabled()
    await collectionPageObjectModel.expectClickHeaderSendOrderCollectionRequest(
      'number',
      '**/samples*',
    )
  })
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Samples list workflow succeed', async ({ page }) => {
    const collectionPageObjectModel = new SampleCollectionPage(page)
    await collectionPageObjectModel.waitTableData()

    let row = collectionPageObjectModel.getTableRowBySampleId('AN.2024.1001.2')
    await expect(row.getByTestId('read-item-button')).toBeEnabled()
    await expect(row.getByTestId('update-item-button')).not.toBeEnabled()
    await expect(row.getByTestId('delete-item-button')).not.toBeEnabled()

    row = collectionPageObjectModel.getTableRowBySampleId('ED.2023.1001.1')

    await expect(row.getByTestId('read-item-button')).toBeEnabled()
    await expect(row.getByTestId('update-item-button')).toBeEnabled()
    await row.getByTestId('update-item-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).toHaveText(/update/i)
    await page.getByLabel('description').fill('updated description')
    await page.getByTestId('submit-request-button').click()
    await expect(collectionPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully updated resource',
    )
    await expect(collectionPageObjectModel.getAppDataCard).not.toHaveText(
      /update/i,
    )
    await expect(page.getByLabel('description')).toHaveValue(
      /updated description/,
    )
    await page.getByTestId('button-navigation-back').click()
    await expect(row.getByTestId('delete-item-button')).toBeEnabled()
    await row.getByTestId('delete-item-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).toHaveText(/delete/i)
    await page.getByTestId('submit-request-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).not.toHaveText(
      /delete/i,
    )
    await expect(collectionPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully deleted resource',
    )
    await expect(
      collectionPageObjectModel.getTableRowBySampleId('ED.2023.1001.1'),
    ).toHaveCount(0)
  })
})

test.describe('Editor user', () => {
  test.use({ storageState: 'playwright/.auth/editor.json' })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SampleCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Sites list succeed', async ({ page }) => {
    const collectionPageObjectModel = new SampleCollectionPage(page)
    await collectionPageObjectModel.waitTableData()

    const row = collectionPageObjectModel.getTableRowBySuCodeAndNumber(
      'ED',
      2023,
      1001,
      1,
    )
    await expect(row.getByTestId('read-item-button')).toBeEnabled()
    await expect(row.getByTestId('update-item-button')).toBeEnabled()
    await expect(row.getByTestId('delete-item-button')).toBeEnabled()
  })
})
