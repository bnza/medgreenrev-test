import { test } from '@playwright/test'

import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { SiteSearchPage } from '@lib/poms/site-search-page'
import { loadFixtures } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'

test.beforeEach(async () => {
  loadFixtures()
})
test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Can navigate from collection', async ({ page }) => {
    const collectionPageObject = new SiteCollectionPage(page)
    await collectionPageObject.waitTableData()
    await collectionPageObject.getSearchLink.click()
    const searchPageObject = new SiteSearchPage(page)
    await searchPageObject.hasExpectedTitle()
    await searchPageObject.expectToBeEmpty()
    await searchPageObject.getAddFilterButton.click()

    await expect(searchPageObject.getAddFilterDialogTitle).toHaveText(
      'Add filter',
    )
    await expect(searchPageObject.getAddFilterDialogContent).toHaveCount(1)

    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
      /This field is required/,
    )

    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'description',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'contains',
    )

    await expect(searchPageObject.getAddFilterDialogContent).not.toHaveText(
      /This field is required/,
    )
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
      /This field is required/,
    )

    await searchPageObject.getAddFilterDialogSingleOperatorInput.fill('uae')
    await searchPageObject.getSubmitAddFilterButton.click()

    await expect(searchPageObject.getAddFilterDialog).toHaveCount(0)
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await collectionPageObject.expectResponseTotalItems(5)
    await collectionPageObject.waitTableData()

    await collectionPageObject.getSearchLink.click()
    await searchPageObject.getAddFilterButton.click()
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'name',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'contains',
    )
    await searchPageObject.getAddFilterDialogSingleOperatorInput.fill('al')
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(2)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await collectionPageObject.expectResponseTotalItems(3)
    await collectionPageObject.waitTableData()
    await collectionPageObject.getSearchLink.click()
    await searchPageObject.getFiltersListItem
      .nth(0)
      .getByTestId('delete-filter-button')
      .click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await collectionPageObject.expectResponseTotalItems(6)
    await collectionPageObject.waitTableData()
  })
})
