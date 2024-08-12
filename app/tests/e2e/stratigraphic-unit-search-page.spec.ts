import { test } from '@playwright/test'

import { loadFixtures } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'
import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { StratigraphicUnitSearchPage } from '@lib/poms/startigraphic-unit-search-page'
import { SiteItemPage } from '@lib/poms/site-item-page'

test.beforeEach(async () => {
  loadFixtures()
})
test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('Can navigate from collection', async ({ page }) => {
    const collectionPageObject = new StratigraphicUnitCollectionPage(page)
    await collectionPageObject.waitTableData()
    await collectionPageObject.getSearchLink.click()
    const searchPageObject = new StratigraphicUnitSearchPage(page)
    await searchPageObject.hasExpectedTitle()
    await searchPageObject.expectToBeEmpty()

    await searchPageObject.clickAddFilterButton()

    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
      /This field is required/,
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'site',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'equals',
    )
    await expect(searchPageObject.getAddFilterDialogContent).not.toHaveText(
      /This field is required/,
    )
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
      /This field is required/,
    )
    await searchPageObject.fillVuetifyVAutocompleteAncClickNth(
      searchPageObject.page.getByLabel('site'),
      'ED',
    )
    await searchPageObject.getSubmitAddFilterButton.click()

    await expect(searchPageObject.getAddFilterDialog).toHaveCount(0)
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await collectionPageObject.expectResponseTotalItems(8)
    await collectionPageObject.waitTableData()
  })
  test('Each resource page has his own state', async ({ page }) => {
    const collectionPageObject = new StratigraphicUnitCollectionPage(page)
    await collectionPageObject.waitTableData()
    await collectionPageObject.getSearchLink.click()
    const searchPageObject = new StratigraphicUnitSearchPage(page)
    await searchPageObject.hasExpectedTitle()
    await searchPageObject.expectToBeEmpty()
    await searchPageObject.clickAddFilterButton()
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'number',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'greater than',
    )
    await searchPageObject.getAddFilterDialogSingleOperatorInput.fill('1003')
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.getSubmitAddFiltersButton.click()

    const sitePageObjectModel = new SiteItemPage(page)
    await sitePageObjectModel.clickAppNavigationListItem('data', 'site')
    await expect(sitePageObjectModel.getTitle).toHaveText(/site/i)
    await sitePageObjectModel.navigateFromCollectionPage('ED')
    await sitePageObjectModel.getStratigraphicUnitsTab.click()
    await sitePageObjectModel.getStratigraphicUnitsTabContent.getChildrenCollectionTable.expectRowCount(
      9,
    )
    await sitePageObjectModel.page.getByTestId('collection-search-link').click()
    await searchPageObject.hasExpectedTitle()
    await searchPageObject.expectToBeEmpty()
    await searchPageObject.clickAddFilterButton()
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'interpretation',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'contains',
    )
    await searchPageObject.getAddFilterDialogSingleOperatorInput.fill('grave')
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.clickAddFilterButton()
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogPropertyInput,
      'description',
    )
    await searchPageObject.clickVuetifyVSelect(
      searchPageObject.getAddFilterDialogOperatorInput,
      'contains',
    )
    await searchPageObject.getAddFilterDialogSingleOperatorInput.fill('brown')
    await searchPageObject.getSubmitAddFilterButton.click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(2)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await sitePageObjectModel.getStratigraphicUnitsTab.click()
    await sitePageObjectModel.getStratigraphicUnitsTabContent.getChildrenCollectionTable.expectRowCount(
      3,
    )
    await sitePageObjectModel.clickAppNavigationListItem(
      'data',
      'stratigraphic',
    )
    await expect(collectionPageObject.getTitle).toHaveText(/Stratigraphic/)

    await collectionPageObject.page
      .getByTestId('collection-search-link')
      .click()
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
  })
})
