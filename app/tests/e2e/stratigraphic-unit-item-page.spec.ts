import { test } from '@playwright/test'

import { StratigraphicUnitItemPage } from '@lib/poms/stratigraphic-unit-item-page'
import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { loadFixtures, resetFixtureMedia } from '@lib/common/api'
import { expect } from '@fixtures/fixtures'
import * as path from 'node:path'

test.beforeEach(async () => {
  loadFixtures()
})

const suCode = 'ED.2023.1001'
test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Stratigraphic unit item form succeed', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode)
    await itemPageObjectModel.dataCardHasExpectedTitle(/Stratigraphic Unit\s/)
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
  test('Stratigraphic unit relationships tab workflow works as expected', async ({
    page,
  }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode)
    await itemPageObjectModel.dataCardHasExpectedTitle(/Stratigraphic Unit\s/)
    await itemPageObjectModel.getRelationshipsTab.click()
    await expect(page.getByTestId('su-relationship-card')).toHaveCount(7)
    await expect(page.getByTestId('enable-editing-button')).toHaveCount(0)
    await expect(page.getByTestId('add-relationship-button')).toHaveCount(0)
    await expect(page.getByTestId('delete-relationship-button')).toHaveCount(0)
    await page.getByTestId('su-relationship-chip').nth(0).click()
    await expect(page.getByTestId('su-relationship-selected-card')).toHaveCount(
      1,
    )
    await expect(page.getByTestId('su-relationship-selected-card')).toHaveText(
      /description/,
    )
  })
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Update item without Site permissions', async ({ page }) => {
    const collectionPageObjectModel = new StratigraphicUnitCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await page.getByLabel('Next page').click()
    await collectionPageObjectModel
      .getNavigationLink('WW.2024.1001', 'UPDATE')
      .click()
    await expect(page.getByLabel('code')).not.toBeEditable()
    await expect(page.getByLabel('year')).not.toBeEditable()
    await expect(page.getByLabel('number')).not.toBeEditable()
  })
  test('Update item with site permissions', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode, 'UPDATE')
    await itemPageObjectModel.siteInputAutocomplete.click()
    await itemPageObjectModel.siteInputAutocomplete.fill('')
    await expect(itemPageObjectModel.getVuetifyAutocompleteContent).toHaveCount(
      2,
    )
    await expect(page.getByLabel('year')).toBeEditable()
    await expect(page.getByLabel('number')).toBeEditable()
  })
  test('Create item with site permissions', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    const collectionPageObjectModel = new StratigraphicUnitCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel.getCreateLink.click()
    await itemPageObjectModel.siteInputAutocomplete.click()
    await itemPageObjectModel.siteInputAutocomplete.fill('')
    await expect(itemPageObjectModel.getVuetifyAutocompleteContent).toHaveCount(
      2,
    )
    await expect(page.getByLabel('year')).toBeEditable()
    await expect(page.getByLabel('number')).toBeEditable()
  })
  test('Media tab workflow work as expected', async ({ page }) => {
    resetFixtureMedia()

    // Insufficient site privileges in order to modify media
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage('AN.2024.1001', 'READ')
    await itemPageObjectModel.getMediaTab.click()

    await expect(page.getByTestId('media-object-join-card')).toHaveCount(1)
    await expect(page.getByTestId('download-media-button')).toHaveCount(1)
    await expect(
      page
        .getByTestId('media-object-join-card')
        .getByTestId('delete-media-button'),
    ).toHaveCount(0)
    await expect(page.getByTestId('create-media-button')).toHaveCount(0)

    await page
      .getByTestId('app-data-card-toolbar')
      .getByTestId('button-navigation-back')
      .click()

    await itemPageObjectModel.collectionPageObjectModel
      .getNavigationLink(suCode, 'READ')
      .click()

    // Sufficient site privileges in order to modify media
    await itemPageObjectModel.getMediaTab.click()
    await expect(page.getByTestId('media-object-join-card')).toHaveCount(4)
    await expect(page.getByTestId('delete-media-object-card')).not.toBeVisible()
    await page
      .getByTestId('media-object-join-card')
      .nth(0)
      .getByTestId('delete-media-button')
      .click()
    await expect(page.getByTestId('delete-media-object-card')).toBeVisible()
    await page
      .getByTestId('delete-media-object-card')
      .getByRole('button', { name: 'delete' })
      .click()
    await expect(page.getByTestId('delete-media-object-card')).toHaveText(
      /deleting/i,
    )
    await expect(page.getByText('Successfully deleted media')).toHaveCount(1)
    await expect(page.getByTestId('media-object-join-card')).toHaveCount(3)
    await expect(page.getByTestId('delete-media-object-card')).not.toBeVisible()
    await expect(page.getByTestId('create-media-object-card')).not.toBeVisible()
    await page.getByTestId('create-media-button').click()
    await expect(page.getByTestId('create-media-object-card')).toBeVisible()
    const submitButton = page
      .getByTestId('create-media-object-card')
      .getByRole('button', { name: 'submit' })
    await expect(submitButton).not.toBeEnabled()

    await page
      .getByLabel('File input', { exact: true })
      .setInputFiles(
        path.join(
          __dirname,
          '../../fixtures/media',
          'ED221001B_changedName.pdf',
        ),
      )
    await submitButton.click()
    await expect(page.getByText(/Duplicate/)).toHaveCount(1)
    await page.getByTestId('app-snackbar').getByRole('button').click()
    await expect(page.getByTestId('create-media-object-card')).toBeVisible()
    await page.getByLabel('File input', { exact: true }).setInputFiles([])
    await expect(page.getByTestId('create-media-object-card')).toHaveText(
      /required/i,
    )
    await expect(submitButton).not.toBeEnabled()
    await page
      .getByLabel('File input', { exact: true })
      .setInputFiles(
        path.join(__dirname, '../../fixtures/media', 'ED241001A.xls'),
      )
    await submitButton.click()
    await expect(page.getByText('Successfully created media')).toHaveCount(1)
    await expect(page.getByTestId('media-object-join-card')).toHaveCount(4)
    await expect(page.getByTestId('create-media-object-card')).not.toBeVisible()
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
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(itemPageObjectModel.getAppSnackbar).toHaveText(/500/)
    await itemPageObjectModel.getAppSnackbar.getByRole('button').click()
    await page.getByTestId('app-data-card-toolbar').getByRole('link').click()
    await expect(page.getByTestId('app-data-card-toolbar')).not.toHaveText(
      /delete/i,
    )
    await itemPageObjectModel.navigateFromCollectionPage(
      'AN.2024.1004',
      'DELETE',
    )
    await expect(page.getByTestId('app-data-card-toolbar')).toHaveText(
      /delete/i,
    )
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(page.getByTestId('app-data-card-toolbar')).not.toHaveText(
      /delete/i,
    )
    await expect(itemPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully deleted resource',
    )
  })
  test('Update item', async ({ page }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode, 'UPDATE')
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
    await expect(page.getByTestId('app-data-card-toolbar')).toHaveText(/create/)
    await page.getByLabel('site').nth(0).fill('ED')
    await page.getByRole('option', { name: 'ED Ed-Dur' }).click()
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
  test('Stratigraphic unit relationships tab workflow work as expected', async ({
    page,
  }) => {
    const itemPageObjectModel = new StratigraphicUnitItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(suCode)
    await itemPageObjectModel.dataCardHasExpectedTitle(/Stratigraphic Unit\s/)
    await itemPageObjectModel.getRelationshipsTab.click()
    await expect(page.getByTestId('su-relationship-card')).toHaveCount(7)
    await expect(page.getByTestId('enable-editing-button')).toHaveCount(1)
    await expect(page.getByTestId('add-relationship-button')).toHaveCount(0)
    await expect(page.getByTestId('delete-relationship-button')).toHaveCount(0)
    await expect(page.getByTestId('su-relationship-chip')).toHaveCount(1)
    await page.getByTestId('enable-editing-button').click()
    await expect(page.getByTestId('add-relationship-button')).toHaveCount(7)
    await expect(
      page.getByTestId('delete-relationship-button'),
    ).not.toHaveCount(0)
    await page
      .getByTestId('su-relationship-card')
      .filter({ hasText: /covered/ })
      .getByTestId('add-relationship-button')
      .click()
    await expect(page.getByTestId('add-su-relationship-card')).toHaveCount(1)
    await page.getByLabel('SU').fill('23.02')
    await page.getByText('ED.2023.1002').first().click()
    await expect(page.getByTestId('add-su-relationship-card')).toHaveText(
      /Duplicate/,
    )
    await page.getByLabel('SU').fill('23.04')
    await page.getByText('ED.2023.1004').first().click()
    await page.getByRole('button', { name: 'submit' }).click()
    await expect(page.getByTestId('su-relationship-chip')).toHaveCount(2)
    await expect(
      page
        .getByTestId('su-relationship-card')
        .filter({ hasText: /covered/ })
        .getByTestId('su-relationship-chip'),
    ).toHaveText('23.1004')
    await page
      .getByTestId('su-relationship-card')
      .filter({ hasText: /covered/ })
      .getByTestId('su-relationship-chip')
      .getByTestId('delete-relationship-button')
      .click()
    await page
      .getByTestId('delete-su-relationship-card')
      .getByRole('button', { name: 'delete' })
      .click()
    await expect(page.getByTestId('su-relationship-chip')).toHaveCount(1)
    await page.getByTestId('enable-editing-button').click()
    await expect(page.getByTestId('add-relationship-button')).toHaveCount(0)
  })
})
