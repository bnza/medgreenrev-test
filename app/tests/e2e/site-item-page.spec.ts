import { test } from '@playwright/test'

import { SiteItemPage } from '@lib/poms/site-item-page'
import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { loadFixtures } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'
import { SiteSearchPage } from '@lib/poms/site-search-page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Site item form succeed', async ({ page }) => {
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage('ED')
    await itemPageObjectModel.formHasExpectedTitle(/Site\sED/)
    await itemPageObjectModel.formHasExpectedInput('code')
    await itemPageObjectModel.formHasExpectedInput('name')
    await itemPageObjectModel.formHasExpectedInput('description')
    await itemPageObjectModel.formInputIsReadonly('code')
    await itemPageObjectModel.formInputIsReadonly('name')
    await itemPageObjectModel.formInputIsReadonly('description')
  })
  test('Site item resource not found', async ({ page }) => {
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.goto(0)
    await itemPageObjectModel.pageHasEmptyItem()
  })
  test('Stratigraphic units tab', async ({ page }) => {
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage('ED')
    await itemPageObjectModel.formHasExpectedTitle(/Site\sED/)
    await itemPageObjectModel.getStratigraphicUnitsTab.click()
    await itemPageObjectModel.getStratigraphicUnitsTabContent.getChildrenCollectionTable.expectRowCount(
      9,
    )
    await itemPageObjectModel.getStratigraphicUnitsTabContent.getSearchButton.click()
    const searchPageObject = new SiteSearchPage(page)
    await searchPageObject.hasExpectedTitle()
    await searchPageObject.expectToBeEmpty()
    await searchPageObject.getAddFilterButton.click()
    await expect(searchPageObject.getAddFilterDialogTitle).toHaveText(
      'Add filter',
    )
    await expect(searchPageObject.getAddFilterDialogContent).toHaveCount(1)
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

    await expect(searchPageObject.getAddFilterDialog).toHaveCount(0)
    await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
    await searchPageObject.getSubmitAddFiltersButton.click()
    await page.waitForURL('**/' + itemPageObjectModel.getBasePath() + '/*')
    await itemPageObjectModel.formHasExpectedTitle(/Site\sED/)
    await itemPageObjectModel.getStratigraphicUnitsTab.click()
    await itemPageObjectModel.getStratigraphicUnitsTabContent.getChildrenCollectionTable.expectRowCount(
      4,
    )
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Delete item', async ({ page }) => {
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage('SAH', 'DELETE')
    await expect(
      itemPageObjectModel.page.getByTestId('delete-item-alert-row'),
    ).toHaveCount(1)
    const _url = itemPageObjectModel.page.url()
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await page.goto(_url)
    await itemPageObjectModel.pageHasEmptyItem()
  })
  test('Update item', async ({ page }) => {
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage('ED', 'EDIT')
    await itemPageObjectModel.page.getByLabel('name').fill('A nice old city')
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Site/),
    ).not.toHaveText('delete')
    await expect(itemPageObjectModel.page.getByLabel('name')).toHaveValue(
      'A nice old city',
    )
  })
  test('Create item', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await siteCollectionPage.getCreateLink.click()
    const itemPageObjectModel = new SiteItemPage(page)
    await itemPageObjectModel.page.getByLabel('code').fill('ED')
    await expect(
      itemPageObjectModel.page.getByText('Duplicate code'),
    ).toHaveCount(1)
    await itemPageObjectModel.page.getByLabel('code').press('Backspace')
    await itemPageObjectModel.page.getByLabel('code').press('Backspace')
    await expect(
      itemPageObjectModel.page.getByText('This field is required'),
    ).toHaveCount(1)
    await itemPageObjectModel.page.getByLabel('code').fill('AA')
    await itemPageObjectModel.page.getByLabel('name').fill('A new site')
    await itemPageObjectModel.page
      .getByLabel('description')
      .fill('Description of the site')
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Site/),
    ).not.toHaveText('create')
    await expect(itemPageObjectModel.page.getByLabel('code')).toHaveValue('AA')
    await expect(itemPageObjectModel.page.getByLabel('name')).toHaveValue(
      'A new site',
    )
    await expect(
      itemPageObjectModel.page.getByLabel('description'),
    ).toHaveValue('Description of the site')
  })
})
