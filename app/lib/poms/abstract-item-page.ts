import { type Locator, type Page } from '@playwright/test'

import { expect } from '@fixtures/fixtures'
import type {
  AbstractCollectionPage,
  NavigationLinksTypes,
} from '@lib/poms/abstract-collection-page'
import { AbstractAppPage } from '@lib/poms/abstract-app-page'

export abstract class AbstractItemReadPage extends AbstractAppPage {
  readonly getForm: Locator
  readonly collectionPageObjectModel: AbstractCollectionPage
  readonly deleteItemButton: Locator
  readonly updateItemButton: Locator
  readonly getDataTab: Locator

  constructor(page: Page) {
    super(page)
    this.getForm = page.getByTestId('app-data-card')
    this.collectionPageObjectModel = this._getCollectionPageModel(page)
    this.deleteItemButton = page
      .getByTestId('app-data-card-toolbar')
      .getByTestId('delete-item-button')
    this.updateItemButton = page
      .getByTestId('app-data-card-toolbar')
      .getByTestId('delete-item-button')
    this.getDataTab = page.getByRole('button').getByText('Data')
  }

  protected abstract _getCollectionPageModel(page: Page): AbstractCollectionPage

  async navigateFromCollectionPage(
    rowSelector: number | string,
    linkType: NavigationLinksTypes = 'READ',
  ) {
    await this.collectionPageObjectModel.waitTableData()
    await this.collectionPageObjectModel
      .getNavigationLink(rowSelector, linkType)
      .click()
  }

  async formHasExpectedTitle(expectedTitle: string | RegExp) {
    await expect(this.getTitle, "Form's header has the right title").toHaveText(
      expectedTitle,
    )
  }

  async formHasExpectedInput(label: string | RegExp) {
    await expect(
      this.getForm.getByLabel(label),
      'Form has expected input',
    ).toHaveCount(1)
  }

  async formInputIsReadonly(label: string | RegExp) {
    await expect(
      this.getForm.getByLabel(label),
      'Form input is readonly',
    ).toHaveAttribute('readonly')
  }

  abstract getBasePath(): string

  async goto(id: string | number) {
    await this.page.goto(`${this.getBasePath()}/${id}`)
  }

  async pageHasEmptyItem() {
    await expect(this.page.getByTestId('resource-empty-state')).toHaveCount(1)
  }
}
