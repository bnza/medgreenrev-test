import { AbstractAppPage } from '@lib/poms/abstract-app-page'
import { Locator, Page } from '@playwright/test'
import { expect } from '@fixtures/fixtures'

export abstract class AbstractSearchPage extends AbstractAppPage {
  readonly getAddFilterButton: Locator
  readonly getAddFilterDialog: Locator
  readonly getAddFilterDialogTitle: Locator
  readonly getAddFilterDialogContent: Locator
  readonly getAddFilterDialogPropertyInput: Locator
  readonly getAddFilterDialogOperatorInput: Locator
  readonly getAddFilterDialogSingleOperatorInput: Locator
  readonly getSubmitAddFilterButton: Locator
  readonly getFiltersList: Locator
  readonly getFiltersListItem: Locator
  readonly getSubmitAddFiltersButton: Locator

  constructor(page: Page) {
    super(page)
    this.getAddFilterButton = page.getByTestId('add-filter-button')
    this.getAddFilterDialog = page.getByTestId('filter-edit-dialog')
    this.getAddFilterDialogTitle =
      this.getAddFilterDialog.getByTestId('filter-edit-title')
    this.getAddFilterDialogContent = this.getAddFilterDialog.getByTestId(
      'filter-edit-content',
    )
    this.getAddFilterDialogPropertyInput = this.getAddFilterDialogContent
      .getByRole('combobox')
      .nth(0)
    this.getAddFilterDialogOperatorInput = this.getAddFilterDialogContent
      .getByRole('combobox')
      .nth(1)
    this.getAddFilterDialogSingleOperatorInput =
      this.getAddFilterDialogContent.getByLabel('value')
    this.getSubmitAddFilterButton =
      this.getAddFilterDialog.getByTestId('submit-button')
    this.getFiltersList = page.getByTestId('filters-list')
    this.getFiltersListItem =
      this.getFiltersList.getByTestId('filters-list-item')
    this.getSubmitAddFiltersButton =
      this.getAppDataCard.getByTestId('submit-button')
  }

  abstract get appUrl(): string

  async goto() {
    await this.page.goto(this.appUrl)
  }

  async hasExpectedTitle(nth = 0) {
    await expect(this.getAppDataCardToolbar.nth(nth)).toHaveText(/Search \(/)
  }

  async expectToBeEmpty() {
    await expect(
      this.page.getByText('No filter selected', { exact: true }),
    ).toHaveCount(1)
  }

  async expectEditFilterDialogHasInputCount(count: number) {
    await expect(this.getAddFilterDialogContent.locator('input')).toHaveCount(
      count,
    )
  }

  async clickAddFilterButton() {
    await this.getAddFilterButton.click()

    await expect(this.getAddFilterDialogTitle).toHaveText('Add filter')
    await expect(this.getAddFilterDialogContent).toHaveCount(1)
  }
}
