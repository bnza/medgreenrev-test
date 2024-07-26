import { Locator, Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'

export class StratigraphicUnitItemPage extends AbstractItemReadPage {
  readonly siteInputAutocomplete: Locator

  constructor(page: Page) {
    super(page)
    this.siteInputAutocomplete = page.getByLabel('site')
  }

  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new StratigraphicUnitCollectionPage(page)
  }

  getBasePath(): string {
    return '#/data/stratigraphic-units'
  }
}
