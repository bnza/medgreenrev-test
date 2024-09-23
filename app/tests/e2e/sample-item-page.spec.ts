import { expect, test } from '@playwright/test'

import { loadFixtures } from '@lib/common/api'
import { SampleItemPage } from '@lib/poms/sample-item-page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Sample item form succeed', async ({ page }) => {
    const itemPageObjectModel = new SampleItemPage(page)
    await page.goto('#/')
    await itemPageObjectModel.clickAppNavigationListItem('data', 'sample')
    await page.getByRole('row').nth(1).getByTestId('read-item-button').click()
    await itemPageObjectModel.formHasExpectedInput('SU')
    await itemPageObjectModel.formHasExpectedInput('number')
    await itemPageObjectModel.formHasExpectedInput('description')
  })
  test('Site item resource not found', async ({ page }) => {
    const itemPageObjectModel = new SampleItemPage(page)
    await itemPageObjectModel.goto(0)
    await itemPageObjectModel.pageHasEmptyItem()
  })
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Stratigraphic unit tab workflow succeed', async ({ page }) => {
    const itemPageObjectModel = new SampleItemPage(page)
    const collectionPageObjectModel =
      await itemPageObjectModel.navigateFromStratigraphicUnitItemPage(
        'ED.2023.1001',
        3,
        'UPDATE',
      )

    await expect(collectionPageObjectModel.getAppDataCard).toHaveText(/update/i)
    await page.getByLabel('description').fill('changed description')
    await page.getByTestId('submit-request-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).not.toHaveText(
      /update/i,
    )
    await expect(collectionPageObjectModel.getAppDataCard).toHaveText(
      /sample\s/i,
    )
    await expect(itemPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully updated resource',
    )
    await expect(page.getByLabel('description')).toHaveValue(
      'changed description',
    )
    await page.getByTestId('button-navigation-back').click()
    await expect(collectionPageObjectModel.getAppDataCardToolbar).toHaveText(
      /stratigraphic/i,
    )
    await collectionPageObjectModel
      .getTableRowBySampleId('ED.2023.1001.3')
      .getByTestId('delete-item-button')
      .click()
    await expect(collectionPageObjectModel.getAppDataCard).toHaveText(/delete/i)
    await page.getByTestId('submit-request-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).not.toHaveText(
      /delete/i,
    )
    await expect(collectionPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully deleted resource',
    )
    await expect(collectionPageObjectModel.getAppDataCardToolbar).toHaveText(
      /stratigraphic/i,
    )
    await expect(
      collectionPageObjectModel.getTableRowBySampleId('ED.2023.1001.3'),
    ).toHaveCount(0)
    await collectionPageObjectModel.page
      .getByTestId('collection-create-link')
      .click()
    await expect(itemPageObjectModel.getAppDataCardToolbar).toHaveText(
      /create/i,
    )
    await page.getByLabel('number').fill('1')
    await expect(itemPageObjectModel.getAppDataCard).toHaveText(
      /duplicate number/i,
    )
    await page.getByLabel('number').fill('')
    await expect(itemPageObjectModel.getAppDataCard).toHaveText(/required/i)
    await page.getByLabel('number').fill('w')
    await expect(itemPageObjectModel.getAppDataCard).toHaveText(
      /not an integer/i,
    )
    await page.getByLabel('number').fill('0')
    await expect(itemPageObjectModel.getAppDataCard).toHaveText(
      /greater than 0/i,
    )
    await page.getByLabel('number').fill('5')
    await page.getByLabel('number').press('Tab')
    await page.getByLabel('description').fill('The new sample description')
    await page.getByTestId('submit-request-button').click()
    await expect(collectionPageObjectModel.getAppDataCard).not.toHaveText(
      /create/i,
    )
    await expect(collectionPageObjectModel.getAppSnackbar).toHaveText(
      'Successfully created resource',
    )
    await expect(collectionPageObjectModel.getAppDataCardToolbar).toHaveText(
      /sample\s/i,
    )
    await expect(page.getByLabel('number')).toHaveValue('5')
    await expect(page.getByLabel('description')).toHaveValue(
      'The new sample description',
    )
    await page.getByTestId('button-navigation-back').click()
    await expect(collectionPageObjectModel.getAppDataCardToolbar).toHaveText(
      /stratigraphic/i,
    )
    await expect(
      collectionPageObjectModel.getTableRowBySampleId('ED.2023.1001.5'),
    ).toHaveCount(1)
  })
})
