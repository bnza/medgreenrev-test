import { type Locator, type Page } from '@playwright/test'

import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { expect } from '@fixtures/fixtures'
import type {
  AbstractCollectionPage,
  NavigationLinksTypes,
} from '@lib/poms/abstract-collection-page'

export abstract class AbstractItemReadPage {
  readonly page: Page
  readonly collectionPageObjectModel: AbstractCollectionPage
  readonly getTitle: Locator
  readonly getForm: Locator

  constructor(page: Page) {
    this.page = page
    this.getTitle = page.getByTestId('app-data-card-toolbar')
    this.getForm = page.getByTestId('app-data-card')
  }

  protected abstract _getCollectionPageModel(page: Page): AbstractCollectionPage

  async navigateFromCollectionPage(
    rowSelector: number | string,
    linkType: NavigationLinksTypes = 'READ',
  ) {
    const siteCollectionPage = new SiteCollectionPage(this.page)
    await siteCollectionPage.waitTableData()
    await siteCollectionPage.getNavigationLink(rowSelector, linkType).click()
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

  async fillForm(formData: Record<string, string>) {
    return Object.entries(formData).map(([label, value]) => {
      this.page.getByLabel(label).fill(value)
    })
  }
}
