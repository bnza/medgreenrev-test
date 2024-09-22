import { expect, test } from '@playwright/test'
import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { loadFixtures } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Stratigraphic units list succeed', async ({ page }) => {
    const collectionPageObjectModel = new StratigraphicUnitCollectionPage(page)
    const suCode = 'ED.2023.1001'
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel.tableNotHasHeader('public')
    await collectionPageObjectModel.tableCellHasText(suCode, 'light brown')
    await expect(
      collectionPageObjectModel
        .getTableRow(suCode)
        .getByTestId('read-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow(suCode)
        .getByTestId('update-item-button'),
    ).not.toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow(suCode)
        .getByTestId('delete-item-button'),
    ).not.toBeEnabled()
    await collectionPageObjectModel.expectClickHeaderSendOrderCollectionRequest(
      'number',
      '**/stratigraphic_units*',
    )
  })
})
