import { test } from '@playwright/test'

import { StratigraphicUnitItemPage } from '@lib/poms/stratigraphic-unit-item-page'
import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { loadFixtures } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'

test.beforeEach(async () => {
  loadFixtures()
})

const suCode = 'ED.2023.1001'
test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Stratigraphic unit item form succeed', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode)
    await itemPageObjectModel.formHasExpectedTitle(/Stratigraphic Unit\s/)
    await itemPageObjectModel.formHasExpectedInput('code')
    await itemPageObjectModel.formHasExpectedInput('year')
    await itemPageObjectModel.formHasExpectedInput('number')
    await itemPageObjectModel.formHasExpectedInput('description')
    await itemPageObjectModel.formHasExpectedInput('interpretation')
    await itemPageObjectModel.formInputIsReadonly('code')
    await itemPageObjectModel.formInputIsReadonly('year')
    await itemPageObjectModel.formInputIsReadonly('number')
    await itemPageObjectModel.formInputIsReadonly('description')
    await itemPageObjectModel.formInputIsReadonly('interpretation')
  })
  test('Site item resource not found', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.goto(0)
    await itemPageObjectModel.pageHasEmptyItem()
  })
})
test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Delete item', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode, 'DELETE')
    await expect(
      itemPageObjectModel.page.getByTestId('delete-item-alert-row'),
    ).toHaveCount(1)
    const _url = itemPageObjectModel.page.url()
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    const collectionPageObjectModel = new StratigraphicUnitCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await expect(collectionPageObjectModel.getTableRow(suCode)).toHaveCount(0)
    // await page.goto(_url)
    // await itemPageObjectModel.pageHasEmptyItem()
  })
  test('Update item', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode, 'EDIT')
    await itemPageObjectModel.page.getByLabel('year').fill('2023')
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Stratigraphic Unit\s/),
    ).not.toHaveText('update')
    await expect(itemPageObjectModel.page.getByLabel('year')).toHaveValue(
      '2023',
    )
  })
  test('Create item', async ({ page }) => {
    const collectionPageObjectModel = new StratigraphicUnitCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel.getCreateLink.click()
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.fillVuetifyVAutocompleteAncClickNth(
      itemPageObjectModel.siteInputAutocomplete,
      'ED',
    )
    await expect(
      itemPageObjectModel.page.getByText('Duplicate code'),
    ).toHaveCount(0)
    await itemPageObjectModel.page.getByLabel('year').fill('2023')
    await expect(
      itemPageObjectModel.page.getByText('Duplicate code'),
    ).toHaveCount(0)
    await itemPageObjectModel.page.getByLabel('number').fill('1001')
    await expect(
      itemPageObjectModel.page.getByText(/Duplicate .+ tuple/),
    ).toHaveCount(2)
    await itemPageObjectModel.page.getByLabel('number').fill('2000')
    await expect(
      itemPageObjectModel.page.getByText('Duplicate code'),
    ).toHaveCount(0)
    await itemPageObjectModel.page
      .getByLabel('description')
      .fill('Description of the SU')
    await itemPageObjectModel.page
      .getByLabel('interpretation')
      .fill('Interpretation of the SU')
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Stratigraphic Unit/),
    ).not.toHaveText('create')
    await expect(itemPageObjectModel.page.getByLabel('code')).toHaveValue(
      'ED.2023.2000',
    )
    await expect(itemPageObjectModel.page.getByLabel('year')).toHaveValue(
      '2023',
    )
    await expect(itemPageObjectModel.page.getByLabel('number')).toHaveValue(
      '2000',
    )
    await expect(
      itemPageObjectModel.page.getByLabel('description'),
    ).toHaveValue('Description of the SU')
    await expect(
      itemPageObjectModel.page.getByLabel('interpretation'),
    ).toHaveValue('Interpretation of the SU')
  })
})
