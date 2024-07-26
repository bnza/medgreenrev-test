import { test } from '@playwright/test'
import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { loadFixtures } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Stratigraphic units list succeed', async ({ page }) => {
    const collectionPage = new StratigraphicUnitCollectionPage(page)
    const suCode = 'ED.2023.1001'
    await collectionPage.waitTableData()
    await collectionPage.tableNotHasHeader('public')
    await collectionPage.tableCellHasText(suCode, 'light brown')
    await collectionPage.linkIsEnabled({
      rowSelector: suCode,
      linkType: 'READ',
    })
    await collectionPage.linkIsDisabled({
      rowSelector: suCode,
      linkType: 'EDIT',
    })
    await collectionPage.linkIsDisabled({
      rowSelector: suCode,
      linkType: 'DELETE',
    })
  })
})
